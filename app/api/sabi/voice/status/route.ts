import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { parseTwilioBody, isTwilioRequest } from "@/lib/voice/twiml";
import { clearCallState } from "@/lib/voice/call-state";
import { sendSessionSummary, sendPracticeQuestion } from "@/lib/voice/sms";

// Allow up to 30 seconds for Claude analysis + SMS sends
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
 * POST /api/sabi/voice/status
 *
 * Twilio status callback — called when a call ends.
 * Saves the full conversation, analyzes it with Claude,
 * updates student stats, and sends SMS summary + practice question.
 */
export async function POST(req: NextRequest) {
  try {
    const body = parseTwilioBody(await req.text());

    if (!isTwilioRequest(req, body)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const callSid = body.CallSid || "";
    const callStatus = body.CallStatus || "";
    const callDuration = parseInt(body.CallDuration || "0", 10);

    // Clean up call state for failed/canceled calls too
    if (callStatus === "failed" || callStatus === "canceled") {
      await clearCallState(callSid);
      return NextResponse.json({ ok: true });
    }

    // Only do full processing for completed calls
    if (callStatus !== "completed" && callStatus !== "busy" && callStatus !== "no-answer") {
      return NextResponse.json({ ok: true });
    }

    // Retrieve and clear call state
    const state = await clearCallState(callSid);
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
      duration_seconds: callDuration,
      topics_covered: stats.topics_covered || [],
      recommended_module: stats.recommended_module,
      call_sid: callSid,
      phone_number: state.phoneNumber,
      channel: "voice",
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
          total_correct: (student.total_correct || 0) + (stats.correct_count || 0),
          total_wrong: (student.total_wrong || 0) + (stats.wrong_count || 0),
          current_level: stats.current_level,
          current_module: nextModule,
          current_topic: MODULE_TOPICS[nextModule] || "diagnostic",
          skills: mergedSkills,
          last_session_summary: stats.summary,
          updated_at: new Date().toISOString(),
        })
        .eq("id", state.studentId);

      // Send SMS summary
      const callbackNumber = process.env.TWILIO_PHONE_NUMBER || "the same number";
      await sendSessionSummary(
        state.phoneNumber,
        updatedName || "learner",
        stats.summary,
        stats.correct_count,
        stats.wrong_count,
        callbackNumber
      );

      // Send practice question SMS immediately (setTimeout doesn't work on serverless)
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
    console.error("Voice status callback error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ ok: true }); // Don't fail the webhook
  }
}
