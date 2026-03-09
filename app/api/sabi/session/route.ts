import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// POST /api/sabi/session — End session: save conversation, analyze, update student stats
export async function POST(req: NextRequest) {
  try {
    const { student_id, messages, duration_seconds } = await req.json();

    if (!student_id || !messages?.length) {
      return NextResponse.json(
        { error: "student_id and messages required" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    // Ask Claude to analyze the conversation
    const conversationText = messages
      .map(
        (m: { role: string; content: string }) =>
          `${m.role === "user" ? "Child" : "Sabi"}: ${m.content}`
      )
      .join("\n");

    // Get current student data for context
    const { data: studentBefore } = await supabase
      .from("sabi_students")
      .select("current_module, current_level, skills")
      .eq("id", student_id)
      .single();

    const currentModule = studentBefore?.current_module ?? 0;

    const analysis = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `Analyze this tutoring conversation between an AI tutor (Sabi) and a child. The student is currently on module ${currentModule}. Return ONLY valid JSON, no other text.

Conversation:
${conversationText}

Return this exact JSON structure:
{
  "summary": "one sentence summary of what the child learned and how they did",
  "correct_count": <number of questions answered correctly>,
  "wrong_count": <number of questions answered incorrectly>,
  "current_level": "beginner or intermediate or advanced",
  "topics_covered": ["list", "of", "topics"],
  "recommended_module": <number 0-7: which module should the student work on next? 0=diagnostic, 1=counting, 2=addition, 3=subtraction, 4=multiplication, 5=division, 6=word_problems, 7=completed>,
  "should_advance": <true if student demonstrated mastery of current module>,
  "skills": {"counting": 0.0-1.0, "addition": 0.0-1.0, "subtraction": 0.0-1.0, "multiplication": 0.0-1.0, "division": 0.0-1.0}
}

Only include skills that were actually tested in the conversation. Use 0.0-1.0 scale based on accuracy.`,
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
    };

    try {
      const text =
        analysis.content[0].type === "text" ? analysis.content[0].text : "";
      // Extract JSON from response (handle potential markdown wrapping)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        stats = JSON.parse(jsonMatch[0]);
      }
    } catch {
      console.error("Failed to parse session analysis");
    }

    // Save session
    const { error: sessionError } = await supabase
      .from("sabi_sessions")
      .insert({
        student_id,
        messages,
        summary: stats.summary,
        correct_count: stats.correct_count,
        wrong_count: stats.wrong_count,
        duration_seconds: duration_seconds || null,
        topics_covered: stats.topics_covered || [],
        recommended_module: stats.recommended_module,
      });

    if (sessionError) {
      console.error("Save session error:", sessionError);
    }

    // Update student stats
    const { data: student } = await supabase
      .from("sabi_students")
      .select("*")
      .eq("id", student_id)
      .single();

    if (student) {
      // Merge skills — keep highest score per skill
      const existingSkills = student.skills || {};
      const newSkills = stats.skills || {};
      const mergedSkills = { ...existingSkills };
      for (const [skill, score] of Object.entries(newSkills)) {
        const existing = (mergedSkills[skill] as number) || 0;
        mergedSkills[skill] = Math.max(existing, score as number);
      }

      // Determine next module
      const nextModule = stats.should_advance
        ? Math.min((student.current_module || 0) + 1, 7)
        : stats.recommended_module ?? student.current_module ?? 0;

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

      await supabase
        .from("sabi_students")
        .update({
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
        .eq("id", student_id);
    }

    return NextResponse.json({
      summary: stats.summary,
      correct_count: stats.correct_count,
      wrong_count: stats.wrong_count,
      current_level: stats.current_level,
      current_module: stats.recommended_module,
      topics_covered: stats.topics_covered,
      should_advance: stats.should_advance,
      total_sessions: (student?.total_sessions || 0) + 1,
      total_correct:
        (student?.total_correct || 0) + (stats.correct_count || 0),
      total_wrong: (student?.total_wrong || 0) + (stats.wrong_count || 0),
    });
  } catch (error) {
    console.error("Session save error:", error);
    return NextResponse.json(
      { error: "Failed to save session" },
      { status: 500 }
    );
  }
}
