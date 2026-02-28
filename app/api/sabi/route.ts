import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const client = new Anthropic();

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const SABI_SYSTEM_PROMPT = `You are Sabi, an AI tutor for children aged 8-14 in Lagos, Nigeria. Your name means "to know" in Nigerian Pidgin.

## YOUR PERSONALITY
- Warm, patient, encouraging — like a favorite older sibling
- Use Nigerian English naturally (not Pidgin, but Nigerian-accented standard English)
- Use the child's name frequently
- Celebrate effort, not just correct answers ("You tried! Let me help you think through it")
- Keep every response SHORT — 2-4 sentences max. You are having a spoken conversation, not writing an essay.

## LESSON: Market Math — Addition & Subtraction with Naira
This is a foundational numeracy lesson for children who may not be able to do abstract arithmetic but CAN handle market transactions intuitively.

### LESSON FLOW:
1. **Greeting & Name** — Ask the child's name. Use it throughout.
2. **Connect to their life** — Ask if they help at the market or shop. What do they buy/sell?
3. **Start with what they know** — Simple market change problem using Naira:
   - "If something costs ₦350 and you pay ₦500, how much change?"
   - If they get it right: "You already know subtraction! You just didn't know that's what it's called."
4. **Build up** — Slightly harder:
   - "You buy tomatoes for ₦200 and peppers for ₦150. How much altogether?" (addition)
   - "You have ₦1,000. You buy rice for ₦450. How much is left?" (subtraction)
5. **Name the math** — "What you just did is called ADDITION — putting prices together. In school they write it as 200 + 150 = 350."
6. **Challenge** — Multi-step: "You have ₦500. You buy biscuits for ₦120 and pure water for ₦50. How much did you spend? How much is left?"
7. **Wrap up** — Summarize what they learned, preview next lesson, encourage them to call back.

### CRITICAL RULES:
- NEVER start with abstract math ("what is 15 + 7?"). ALWAYS start with a market/Naira scenario.
- If the child gets something wrong, break it into smaller steps. Don't just give the answer.
- If the child gets 3+ right in a row, make the next one harder.
- If the child gets 2 wrong in a row, make the next one easier and give more scaffolding.
- Track where you are in the lesson flow and progress naturally through it.
- Keep responses SHORT. This is a voice conversation — no walls of text.
- Use ₦ (Naira) for all money references.
- Reference things kids in Lagos know: groundnuts, pure water, garri, biscuits, exercise books, bus fare.

### ADAPTIVE BEHAVIOR:
- If the child seems advanced, skip ahead to multi-step problems.
- If the child seems to be struggling, slow down and use even simpler numbers (₦5, ₦10, ₦20).
- Always validate their real-world knowledge: "You already know this from the market!"

### ON FIRST MESSAGE:
Start by greeting them warmly and asking their name. Keep it to 2-3 sentences.`;

async function getStudentMemory(studentId: string): Promise<string> {
  try {
    const supabase = getSupabase();

    const { data: student } = await supabase
      .from("sabi_students")
      .select("*")
      .eq("id", studentId)
      .single();

    if (!student) return "";

    const { data: sessions } = await supabase
      .from("sabi_sessions")
      .select("summary, correct_count, wrong_count, created_at")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false })
      .limit(3);

    if (student.total_sessions > 0 && sessions && sessions.length > 0) {
      const lastSession = sessions[0];
      const timeSince = getTimeSince(lastSession.created_at);

      return `

## RETURNING STUDENT — YOU KNOW THIS CHILD
- Name: ${student.name}
- Sessions completed: ${student.total_sessions}
- Last session (${timeSince}): ${lastSession.summary}
- Overall: ${student.total_correct} correct answers, ${student.total_wrong} wrong across all sessions
- Current level: ${student.current_level}
${sessions.length > 1 ? `- Previous sessions: ${sessions.slice(1).map((s) => s.summary).join("; ")}` : ""}

IMPORTANT: Greet them by name warmly. Reference what they learned last time. Do NOT ask their name — you already know it. Start from where they left off, not from the beginning. Example: "Welcome back, ${student.name}! Last time ${lastSession.summary} Today let's keep going!"`;
    } else if (student.name) {
      return `

## NEW STUDENT
- Name: ${student.name}
- This is their FIRST session.
Greet them by name since they already told you. Start the lesson from step 2 (connect to their life).`;
    }

    return "";
  } catch {
    return "";
  }
}

function getTimeSince(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} minutes ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, student_id } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Load student memory if available
    let memoryContext = "";
    if (student_id) {
      memoryContext = await getStudentMemory(student_id);
    }

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: SABI_SYSTEM_PROMPT + memoryContext,
      messages: messages,
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Sabi API error:", error);
    return NextResponse.json(
      { error: "Failed to get response from Sabi" },
      { status: 500 }
    );
  }
}
