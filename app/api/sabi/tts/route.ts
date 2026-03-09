import { NextRequest, NextResponse } from "next/server";
import { synthesizeSpeech } from "@/lib/voice/tts-client";

// TTS can take a few seconds per provider (YarnGPT → ElevenLabs fallback)
export const maxDuration = 30;

/**
 * POST /api/sabi/tts
 *
 * Converts text to speech via YarnGPT (primary, Nigerian voice) or ElevenLabs (fallback).
 * Returns audio/mpeg binary data.
 */
export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "text required" }, { status: 400 });
    }

    const audioBuffer = await synthesizeSpeech(text);

    return new NextResponse(new Uint8Array(audioBuffer), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json(
      { error: "TTS generation failed" },
      { status: 500 }
    );
  }
}
