import { NextRequest, NextResponse } from "next/server";
import { callSabi } from "@/lib/voice/sabi-shared";

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
    return NextResponse.json(
      { error: "Failed to get response from Sabi" },
      { status: 500 }
    );
  }
}
