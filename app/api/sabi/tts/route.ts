import { NextRequest, NextResponse } from "next/server";
import { synthesizeSpeech } from "@/lib/voice/tts-client";

export const maxDuration = 30;

/**
 * POST /api/sabi/tts
 *
 * Converts text to speech via lib/voice/tts-client.ts:
 * ElevenLabs (default first) → Chatterbox → YarnGPT.
 * Set SABI_ELEVENLABS_TTS_ONLY=true to disable fallbacks while testing ElevenLabs.
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
