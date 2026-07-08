/**
 * TTS client — routes to ElevenLabs (primary, Impact Program) → YarnGPT.
 * Set SABI_ELEVENLABS_TTS_ONLY=true to use only ElevenLabs (fail fast — for testing).
 * YarnGPT: Free beta, 16 Nigerian voices.
 *
 * All downstream code imports `synthesizeSpeech` from this file.
 */

import { synthesizeWithYarnGPT } from "./yarngpt-client";
import { normalizeMoneyForSpeech } from "./normalize-money-for-speech";

// ElevenLabs — Bukola (`oC2pCZZWEDRe6lmZpaaw`); overrides via env match ElevenLabs agent dashboard / website demo.
const ELEVENLABS_VOICE_ID =
  process.env.ELEVENLABS_VOICE_ID || "oC2pCZZWEDRe6lmZpaaw";
/** Flash family — aligns with ConvAI dashboard "Flash / Fastest" (see elevenlabs-agent-prompt.md). */
const ELEVENLABS_MODEL_ID =
  process.env.ELEVENLABS_MODEL_ID?.trim() || "eleven_flash_v2_5";

/**
 * Convert text to speech. Tries ElevenLabs first (Impact Program, fast cloud API),
 * then YarnGPT.
 * Returns audio buffer (audio/mpeg).
 */
export async function synthesizeSpeech(text: string): Promise<Buffer> {
  const t = normalizeMoneyForSpeech(text);
  const elevenLabsOnly = process.env.SABI_ELEVENLABS_TTS_ONLY === "true";

  // Primary: ElevenLabs (Impact Program — 100K credits/mo free, low-latency)
  if (process.env.ELEVENLABS_API_KEY) {
    try {
      return await synthesizeWithElevenLabs(t);
    } catch (error) {
      if (elevenLabsOnly) {
        throw error instanceof Error
          ? error
          : new Error("ElevenLabs TTS failed (SABI_ELEVENLABS_TTS_ONLY=true)");
      }
      console.warn(
        "ElevenLabs TTS failed, trying YarnGPT:",
        error instanceof Error ? error.message : error
      );
    }
  } else if (elevenLabsOnly) {
    throw new Error(
      "SABI_ELEVENLABS_TTS_ONLY=true but ELEVENLABS_API_KEY is not set"
    );
  }

  // Fallback: YarnGPT Wura (free, native Nigerian voice)
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

/**
 * ElevenLabs TTS — primary for website (Impact Program credits).
 */
async function synthesizeWithElevenLabs(text: string): Promise<Buffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey)
    throw new Error(
      "No TTS provider available (no YARNGPT_API_KEY or ELEVENLABS_API_KEY)"
    );

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
export async function synthesizeSpeechStream(text: string): Promise<ReadableStream<Uint8Array> | null> {
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
