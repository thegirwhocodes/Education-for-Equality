import { NextRequest, NextResponse } from "next/server";
import { callSabiVoiceFast } from "@/lib/voice/sabi-shared";

export const maxDuration = 30;

/**
 * POST /api/sabi
 *
 * Web demo endpoint (voice + chat). Cerebras → Groq → Claude.
 * Groq is the live path while Anthropic is out of credits and Cerebras is unpaid.
 */
export async function POST(req: NextRequest) {
  try {
    const { messages, student_id } = await req.json();

    const hasLlm =
      Boolean(process.env.GROQ_API_KEY?.trim()) ||
      Boolean(process.env.CEREBRAS_API_KEY?.trim()) ||
      Boolean(process.env.ANTHROPIC_API_KEY?.trim());

    if (!hasLlm) {
      return NextResponse.json(
        { error: "No LLM provider configured" },
        { status: 500 }
      );
    }

    const response = await callSabiVoiceFast(
      messages || [],
      student_id || null
    );

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Sabi API error:", error);
    return NextResponse.json(
      { error: "Failed to get response from Sabi" },
      { status: 500 }
    );
  }
}
