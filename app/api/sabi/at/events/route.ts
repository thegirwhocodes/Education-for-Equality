import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { parseATBody } from "@/lib/voice/at-xml";
import { clearCallState, addMessage } from "@/lib/voice/call-state";
import { sendSessionSummary, sendPracticeQuestion } from "@/lib/voice/sms";
import { downloadAudio } from "@/lib/voice/audio-storage";
import { transcribeAudio } from "@/lib/voice/stt";
import { callSabi } from "@/lib/voice/sabi-shared";

export const maxDuration = 30;

const anthropic = new Anthropic();

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const MODULE_TOPICS: Record<number, string> = {
  0: "diagnostic",
  1: "counting",
  2: "addition",
  3: "subtraction",
  4: "multiplication",
  5: "division",
  6: "word_problems",
  7: "completed",
};

/**
 * POST /api/sabi/at/events
 *
 * Africa's Talking call events webhook — called when call status changes.
 * When a call completes: saves conversation, analyzes with Claude,
 * updates student stats, sends SMS summary + practice question.
 *
 * Mirrors the Twilio voice/status route but for AT's event format.
 */
export async function POST(req: NextRequest) {
  try {
    const body = parseATBody(await req.text());

    const sessionId = body.sessionId || "";
    const callState = body.callSessionState || "";
    const duration = parseInt(body.durationInSeconds || "0", 10);
    const callerNumber = body.callerNumber || "";

    Sentry.setTags({
      "at.session_id": sessionId,
      "at.call_state": callState,
      "at.route": "events",
    });
    Sentry.setContext("at_event", { duration });
    Sentry.setContext("at_body_keys", { keys: Object.keys(body) });

    // Log EVERY field AT sends so we can debug what they actually deliver
    console.log(
      `[AT events] session=${sessionId} state=${callState} duration=${duration}s ` +
        `caller=${callerNumber} bodyKeys=${Object.keys(body).join(",")}`
    );

    // If AT delivered a recording URL via the events callback rather than the
    // voice callback, capture it as a Sentry breadcrumb so we can see it.
    if (body.recordingUrl) {
      Sentry.captureMessage(
        `AT events delivered recordingUrl=${body.recordingUrl}`,
        "info"
      );
    }

    // Only process completed calls
    if (callState !== "Completed") {
      // Clean up state for failed calls
      if (callState === "Failed" || callState === "Rejected") {
        await clearCallState(sessionId);
      }
      return NextResponse.json({ ok: true });
    }

    // AT delivers the recording URL via the events callback (NOT in-call to
    // /recording). If we have a URL, run STT + LLM + append a final exchange
    // to the call state before clearing it for analysis.
    if (body.recordingUrl) {
      try {
        const audioBuffer = await downloadAudio(body.recordingUrl);
        const sttResult = await transcribeAudio(audioBuffer);

        // Whisper's confidence score on compressed VoIP audio (Yolla, Skype,
        // AT PSTN compression) is almost always low even when the transcript
        // is usable. Trust the text if there are any words at all — Claude
        // is robust to dropped phonemes and noisy input.
        if (sttResult.text && sttResult.text.trim().length > 0) {
          await addMessage(sessionId, "user", sttResult.text);

          // Build messages array from current call state for the LLM
          const { getCallState } = await import("@/lib/voice/call-state");
          const currentState = await getCallState(sessionId);
          const messages = (currentState?.messages || []).map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          }));

          const sabiReply = await callSabi(
            messages,
            currentState?.studentId || "",
            true
          );
          await addMessage(sessionId, "assistant", sabiReply);

          Sentry.captureMessage(
            `AT events: processed recording (${sttResult.text.length} chars)`,
            "info"
          );
        } else {
          Sentry.captureMessage(
            `AT events: STT returned low-confidence text=${sttResult.text} conf=${sttResult.confidence}`,
            "warning"
          );
        }
      } catch (err) {
        Sentry.captureException(err);
        console.error("AT events: recording processing failed", err);
      }
    }

    // Retrieve and clear call state
    const state = await clearCallState(sessionId);
    if (!state || !state.messages.length || !state.studentId) {
      return NextResponse.json({ ok: true });
    }

    const supabase = getSupabase();

    // Get current student data
    const { data: studentBefore } = await supabase
      .from("sabi_students")
      .select("*")
      .eq("id", state.studentId)
      .maybeSingle();

    const currentModule = studentBefore?.current_module ?? 0;

    // Build conversation text for analysis
    const conversationText = state.messages
      .map((m) => `${m.role === "user" ? "Child" : "Sabi"}: ${m.content}`)
      .join("\n");

    // Analyze conversation with Claude
    const analysis = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      messages: [
        {
          role: "user",
          content: `Analyze this voice tutoring conversation between Sabi (AI tutor) and a child. The student is currently on module ${currentModule}. Return ONLY valid JSON.

Conversation:
${conversationText}

Return this exact JSON structure:
{
  "summary": "one sentence summary of what the child learned and how they did",
  "correct_count": <number of questions answered correctly>,
  "wrong_count": <number of questions answered incorrectly>,
  "current_level": "beginner or intermediate or advanced",
  "topics_covered": ["list", "of", "topics"],
  "recommended_module": <number 0-7>,
  "should_advance": <true if student demonstrated mastery>,
  "skills": {"counting": 0.0-1.0, "addition": 0.0-1.0, etc},
  "practice_question": "a follow-up practice question to SMS the child",
  "practice_answer": "the expected answer to the practice question",
  "child_name": "the child's name if mentioned in conversation, or null"
}

Only include skills that were actually tested. Use 0.0-1.0 scale.`,
        },
      ],
    });

    let stats = {
      summary: "Session completed",
      correct_count: 0,
      wrong_count: 0,
      current_level: "beginner",
      topics_covered: [] as string[],
      recommended_module: currentModule,
      should_advance: false,
      skills: {} as Record<string, number>,
      practice_question: "",
      practice_answer: "",
      child_name: null as string | null,
    };

    try {
      const text =
        analysis.content[0].type === "text" ? analysis.content[0].text : "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        stats = { ...stats, ...JSON.parse(jsonMatch[0]) };
      }
    } catch {
      console.error("Failed to parse voice session analysis");
    }

    // Save session to sabi_sessions
    await supabase.from("sabi_sessions").insert({
      student_id: state.studentId,
      messages: state.messages,
      summary: stats.summary,
      correct_count: stats.correct_count,
      wrong_count: stats.wrong_count,
      duration_seconds: duration,
      topics_covered: stats.topics_covered || [],
      recommended_module: stats.recommended_module,
      call_sid: sessionId,
      phone_number: state.phoneNumber,
      channel: "voice_at",
    });

    // Update student stats
    const { data: student } = await supabase
      .from("sabi_students")
      .select("*")
      .eq("id", state.studentId)
      .maybeSingle();

    if (student) {
      // Merge skills
      const existingSkills = student.skills || {};
      const mergedSkills = { ...existingSkills };
      for (const [skill, score] of Object.entries(stats.skills || {})) {
        const existing = (mergedSkills[skill] as number) || 0;
        mergedSkills[skill] = Math.max(existing, score as number);
      }

      // Determine next module
      const nextModule = stats.should_advance
        ? Math.min((student.current_module || 0) + 1, 7)
        : stats.recommended_module ?? student.current_module ?? 0;

      // Update name if discovered during call
      const updatedName = stats.child_name || student.name;

      await supabase
        .from("sabi_students")
        .update({
          name: updatedName,
          total_sessions: (student.total_sessions || 0) + 1,
          total_correct:
            (student.total_correct || 0) + (stats.correct_count || 0),
          total_wrong: (student.total_wrong || 0) + (stats.wrong_count || 0),
          current_level: stats.current_level,
          current_module: nextModule,
          current_topic: MODULE_TOPICS[nextModule] || "diagnostic",
          skills: mergedSkills,
          last_session_summary: stats.summary,
          updated_at: new Date().toISOString(),
        })
        .eq("id", state.studentId);

      // Send SMS summary via AT
      const callbackNumber =
        process.env.AT_PHONE_NUMBER ||
        process.env.TWILIO_PHONE_NUMBER ||
        "the same number";
      await sendSessionSummary(
        state.phoneNumber,
        updatedName || "learner",
        stats.summary,
        stats.correct_count,
        stats.wrong_count,
        callbackNumber
      );

      // Send practice question SMS
      if (stats.practice_question && stats.practice_answer) {
        try {
          await sendPracticeQuestion(
            state.phoneNumber,
            state.studentId!,
            stats.practice_question,
            stats.practice_answer
          );
        } catch (err) {
          console.error("Failed to send practice SMS:", err);
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    Sentry.captureException(error);
    await Sentry.flush(2000);
    console.error(
      "AT events error:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json({ ok: true }); // Don't fail the webhook
  }
}
