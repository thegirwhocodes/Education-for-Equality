/**
 * TTS client — routes to ElevenLabs (primary, Impact Program) → Chatterbox → YarnGPT.
 * Set SABI_ELEVENLABS_TTS_ONLY=true to use only ElevenLabs (fail fast — for testing).
 * Chatterbox Turbo: Self-hosted on Hetzner GPU, emotion-aware, voice-cloned Nigerian English.
 * YarnGPT: Free beta, 16 Nigerian voices.
 *
 * All downstream code imports `synthesizeSpeech` from this file.
 */

import { synthesizeWithYarnGPT } from "./yarngpt-client";

// Chatterbox Turbo TTS (self-hosted on Hetzner, proxied via nginx)
const CHATTERBOX_URL =
  process.env.CHATTERBOX_URL || "https://api.eduforequality.org/afro-tts";

// ElevenLabs — Bukola (custom Nigerian voice; see scripts/generate-bukola-audio.py)
// Override in env if ElevenLabs dashboard voice id changes.
const ELEVENLABS_VOICE_ID =
  process.env.ELEVENLABS_VOICE_ID || "oC2pCZZWEDRe6lmZpaaw";

/**
 * Detect emotion from LLM response text and return appropriate exaggeration level.
 * Higher exaggeration = more expressive voice.
 */
function detectExaggeration(text: string): number {
  // Celebration / praise markers
  if (/\[laugh\]|!\s*!|Well done|Correct|Yes!|Great|Excellent|Sharp sharp/i.test(text)) {
    return 0.75;
  }
  // Gentle correction / empathy markers
  if (/\[sigh\]|Almost|Good try|tricky|Let me help/i.test(text)) {
    return 0.35;
  }
  // Warm encouragement
  if (/\[chuckle\]|Oya|Let's try|ready/i.test(text)) {
    return 0.6;
  }
  // Default neutral
  return 0.5;
}

/**
 * Convert text to speech via Chatterbox Turbo (self-hosted).
 * Auto-detects emotion from text to set exaggeration level.
 * Returns audio buffer (audio/wav or audio/mpeg).
 */
async function synthesizeWithChatterbox(text: string): Promise<Buffer> {
  const spokenText = text.replace(/₦/g, "naira ");
  const exaggeration = detectExaggeration(spokenText);

  const response = await fetch(`${CHATTERBOX_URL}/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: spokenText.slice(0, 2000),
      format: "mp3",
      exaggeration,
    }),
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Chatterbox TTS failed: ${response.status} ${errorText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Convert text to speech. Tries ElevenLabs first (Impact Program, fast cloud API),
 * then Chatterbox (self-hosted), then YarnGPT.
 * Returns audio buffer (audio/mpeg).
 */
export async function synthesizeSpeech(text: string): Promise<Buffer> {
  const elevenLabsOnly = process.env.SABI_ELEVENLABS_TTS_ONLY === "true";

  // Primary: ElevenLabs (Impact Program — 100K credits/mo free, low-latency)
  if (process.env.ELEVENLABS_API_KEY) {
    try {
      return await synthesizeWithElevenLabs(text);
    } catch (error) {
      if (elevenLabsOnly) {
        throw error instanceof Error
          ? error
          : new Error("ElevenLabs TTS failed (SABI_ELEVENLABS_TTS_ONLY=true)");
      }
      console.warn(
        "ElevenLabs TTS failed, trying Chatterbox:",
        error instanceof Error ? error.message : error
      );
    }
  } else if (elevenLabsOnly) {
    throw new Error(
      "SABI_ELEVENLABS_TTS_ONLY=true but ELEVENLABS_API_KEY is not set"
    );
  }

  // Fallback 1: Chatterbox Turbo (self-hosted, emotion-aware)
  try {
    return await synthesizeWithChatterbox(text);
  } catch (error) {
    console.warn(
      "Chatterbox TTS failed, trying YarnGPT:",
      error instanceof Error ? error.message : error
    );
  }

  // Fallback 2: YarnGPT Wura (free, native Nigerian voice)
  if (process.env.YARNGPT_API_KEY) {
    try {
      return await synthesizeWithYarnGPT(text);
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
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.3,
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
