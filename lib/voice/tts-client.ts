/**
 * TTS client — routes to Afro-TTS (primary, self-hosted) → YarnGPT → ElevenLabs.
 *
 * Afro-TTS: Self-hosted on Hetzner GPU, African-accented English, no limits.
 * YarnGPT: Free beta, 16 Nigerian voices.
 * ElevenLabs: Paid, Nigerian voice "Bukola".
 *
 * All downstream code imports `synthesizeSpeech` from this file.
 */

import { synthesizeWithYarnGPT } from "./yarngpt-client";

// Afro-TTS server (self-hosted on Hetzner, proxied via nginx)
const AFRO_TTS_URL =
  process.env.AFRO_TTS_URL || "https://sabi.eduforequality.org/afro-tts";

// ElevenLabs — Bukola (African Female, Nigerian Accent)
const ELEVENLABS_VOICE_ID = "oC2pCZZWEDRe6lmZpaaw";

/**
 * Convert text to speech via Afro-TTS (self-hosted).
 * Returns audio buffer (audio/mpeg).
 */
async function synthesizeWithAfroTTS(text: string): Promise<Buffer> {
  const spokenText = text.replace(/₦/g, "naira ");

  const response = await fetch(`${AFRO_TTS_URL}/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: spokenText.slice(0, 2000),
      format: "mp3",
      speaker_name: "default",
      temperature: 0.85,
      speed: 1.0,
    }),
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Afro-TTS failed: ${response.status} ${errorText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Convert text to speech. Tries Afro-TTS first, then YarnGPT, then ElevenLabs.
 * Returns audio buffer (audio/mpeg).
 */
export async function synthesizeSpeech(text: string): Promise<Buffer> {
  // Try Afro-TTS first (self-hosted, no limits, African-accented)
  try {
    return await synthesizeWithAfroTTS(text);
  } catch (error) {
    console.warn(
      "Afro-TTS failed, trying YarnGPT:",
      error instanceof Error ? error.message : error
    );
  }

  // Fallback 1: YarnGPT (free, Nigerian voices)
  if (process.env.YARNGPT_API_KEY) {
    try {
      return await synthesizeWithYarnGPT(text);
    } catch (error) {
      console.warn(
        "YarnGPT failed, falling back to ElevenLabs:",
        error instanceof Error ? error.message : error
      );
    }
  }

  // Fallback 2: ElevenLabs
  return synthesizeWithElevenLabs(text);
}

/**
 * ElevenLabs TTS — last-resort fallback.
 */
async function synthesizeWithElevenLabs(text: string): Promise<Buffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey)
    throw new Error(
      "No TTS provider available (Afro-TTS down, no YARNGPT_API_KEY or ELEVENLABS_API_KEY)"
    );

  const spokenText = text.replace(/₦/g, "naira ");

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text: spokenText,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.3,
          similarity_boost: 0.7,
          style: 0.5,
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
