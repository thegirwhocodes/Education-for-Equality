/**
 * TTS client — routes to YarnGPT (primary) or ElevenLabs (fallback).
 *
 * YarnGPT: Free, 16 Nigerian voices, beta.
 * ElevenLabs: Paid (or free via Impact Program), Nigerian voice "Olufunmilola".
 *
 * All downstream code imports `synthesizeSpeech` from this file — no changes needed
 * in AT routes, Twilio routes, or TTS API route.
 */

import { synthesizeWithYarnGPT } from "./yarngpt-client";

// ElevenLabs — Olufunmilola (African Female, Nigerian Accent)
const ELEVENLABS_VOICE_ID = "9Dbo4hEvXQ5l7MXGZFQA";

/**
 * Convert text to speech. Tries YarnGPT first, falls back to ElevenLabs.
 * Returns audio buffer (audio/mpeg).
 */
export async function synthesizeSpeech(text: string): Promise<Buffer> {
  // Try YarnGPT first (free, Nigerian voices)
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

  // Fallback: ElevenLabs
  return synthesizeWithElevenLabs(text);
}

/**
 * ElevenLabs TTS — fallback provider.
 */
async function synthesizeWithElevenLabs(text: string): Promise<Buffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("No TTS provider configured (need YARNGPT_API_KEY or ELEVENLABS_API_KEY)");

  // Replace symbols with spoken words for natural pronunciation
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
