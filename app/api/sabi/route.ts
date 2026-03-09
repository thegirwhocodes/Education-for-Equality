import { NextRequest, NextResponse } from "next/server";
import { callSabi } from "@/lib/voice/sabi-shared";

// Claude API call + optional RAG + Supabase lookup
export const maxDuration = 30;

/**
 * POST /api/sabi
 *
 * Web demo chat endpoint. Accepts messages + student_id,
 * returns Sabi's response via Claude with RAG curriculum context.
 */
export async function POST(req: NextRequest) {
  try {
    const { messages, student_id } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not configured" },
        { status: 500 }
      );
    }

    const response = await callSabi(
      messages || [],
      student_id || null,
      false
    );

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Sabi API error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Sabi error: ${msg}` },
      { status: 500 }
    );
  }
}
