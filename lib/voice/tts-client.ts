/**
 * TTS client for the website demo and Vercel voice routes.
 *
 * Order: Chatterbox (self-hosted, Naomi) → ElevenLabs → YarnGPT.
 * Set SABI_ELEVENLABS_TTS_ONLY=true to force ElevenLabs only (fail fast).
 *
 * All downstream code imports `synthesizeSpeech` from this file.
 */

import { synthesizeWithYarnGPT } from "./yarngpt-client";
import { normalizeMoneyForSpeech } from "./normalize-money-for-speech";

const ELEVENLABS_VOICE_ID =
  process.env.ELEVENLABS_VOICE_ID || "oC2pCZZWEDRe6lmZpaaw";
/** Flash family — aligns with ConvAI dashboard "Flash / Fastest". */
const ELEVENLABS_MODEL_ID =
  process.env.ELEVENLABS_MODEL_ID?.trim() || "eleven_flash_v2_5";

const CHATTERBOX_URL =
  process.env.SABI_CHATTERBOX_URL?.trim() ||
  "https://api.eduforequality.org/afro-tts/tts";
const CHATTERBOX_SPEAKER =
  process.env.SABI_CHATTERBOX_SPEAKER?.trim() || "naomi";
const CHATTERBOX_TIMEOUT_MS = Number(
  process.env.SABI_CHATTERBOX_TIMEOUT_MS || "12000"
);

/**
 * Convert text to speech.
 * Returns audio buffer (audio/mpeg).
 */
export async function synthesizeSpeech(text: string): Promise<Buffer> {
  const t = normalizeMoneyForSpeech(text);
  const elevenLabsOnly = process.env.SABI_ELEVENLABS_TTS_ONLY === "true";

  if (elevenLabsOnly) {
    if (!process.env.ELEVENLABS_API_KEY) {
      throw new Error(
        "SABI_ELEVENLABS_TTS_ONLY=true but ELEVENLABS_API_KEY is not set"
      );
    }
    return synthesizeWithElevenLabs(t);
  }

  // Primary: self-hosted Chatterbox (Naomi voice clone on GPU)
  try {
    return await synthesizeWithChatterbox(t);
  } catch (error) {
    console.warn(
      "Chatterbox TTS failed, trying ElevenLabs:",
      error instanceof Error ? error.message : error
    );
  }

  // Secondary: ElevenLabs (Impact / paid — Bukola library voice needs a paid plan)
  if (process.env.ELEVENLABS_API_KEY) {
    try {
      return await synthesizeWithElevenLabs(t);
    } catch (error) {
      console.warn(
        "ElevenLabs TTS failed, trying YarnGPT:",
        error instanceof Error ? error.message : error
      );
    }
  }

  // Fallback: YarnGPT Wura (slower cloud Nigerian voice)
  if (process.env.YARNGPT_API_KEY) {
    try {
      return await synthesizeWithYarnGPT(t);
    } catch (error) {
      console.warn(
        "YarnGPT also failed:",
        error instanceof Error ? error.message : error
      );
    }
  }

  throw new Error("All TTS providers failed");
}

async function synthesizeWithChatterbox(text: string): Promise<Buffer> {
  const response = await fetch(CHATTERBOX_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: text.slice(0, 2000),
      speaker_name: CHATTERBOX_SPEAKER,
      format: "mp3",
    }),
    signal: AbortSignal.timeout(
      Number.isFinite(CHATTERBOX_TIMEOUT_MS) ? CHATTERBOX_TIMEOUT_MS : 12000
    ),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `Chatterbox TTS failed: ${response.status}${errorText ? ` ${errorText.slice(0, 120)}` : ""}`
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  if (arrayBuffer.byteLength < 1024) {
    throw new Error(
      `Chatterbox TTS returned suspiciously small audio (${arrayBuffer.byteLength} bytes)`
    );
  }

  return Buffer.from(arrayBuffer);
}

async function synthesizeWithElevenLabs(text: string): Promise<Buffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY not configured");
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: ELEVENLABS_MODEL_ID,
        voice_settings: {
          stability: 0.28,
          similarity_boost: 0.7,
          speed: 1,
          use_speaker_boost: true,
        },
      }),
      signal: AbortSignal.timeout(15000),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("ElevenLabs error:", response.status, errorText);
    throw new Error(`ElevenLabs TTS failed: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * ElevenLabs streaming TTS — returns a ReadableStream of audio bytes.
 * Use for browser-based voice where you can pipe audio directly to MediaSource.
 * TTFA drops from ~300ms (full buffer) to ~80ms (first chunk).
 */
export async function synthesizeSpeechStream(
  text: string
): Promise<ReadableStream<Uint8Array> | null> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return null;

  const t = normalizeMoneyForSpeech(text);

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}/stream`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text: t,
        model_id: ELEVENLABS_MODEL_ID,
        voice_settings: {
          stability: 0.28,
          similarity_boost: 0.7,
          speed: 1,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!response.ok || !response.body) return null;
  return response.body;
}
