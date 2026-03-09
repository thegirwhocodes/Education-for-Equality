import { NextRequest, NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/voice/stt";

export const maxDuration = 30;

/**
 * POST /api/sabi/stt
 *
 * Transcribes audio using Groq Whisper (free tier: 28,800 sec/day).
 * Accepts multipart form data with an "audio" field (webm/wav/mp3).
 * Returns { text, confidence }.
 */
export async function POST(req: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY not configured" },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio") as Blob | null;

    if (!audioFile || audioFile.size === 0) {
      return NextResponse.json({ error: "audio required" }, { status: 400 });
    }

    const buffer = Buffer.from(await audioFile.arrayBuffer());
    const result = await transcribeAudio(
      buffer,
      audioFile.type || "audio/webm"
    );

    return NextResponse.json({
      text: result.text.trim(),
      confidence: result.confidence,
    });
  } catch (error) {
    console.error("STT error:", error);
    return NextResponse.json(
      { error: "Transcription failed" },
      { status: 500 }
    );
  }
}
