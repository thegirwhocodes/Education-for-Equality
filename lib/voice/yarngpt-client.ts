/**
 * YarnGPT TTS client — Nigerian voices, free (beta).
 *
 * API: POST https://yarngpt.ai/api/v1/tts
 * Voices: 16 Nigerian voices (Chinenye, Wura, Adaora, Idera recommended for Sabi)
 * Limit: 2,000 chars per request
 * Output: mp3/wav/opus/flac
 * Auth: Bearer token
 */

// Best voices for a children's tutor (warm, engaging, Nigerian accent)
export const YARNGPT_VOICES = {
  chinenye: "chinenye", // Engaging, warm — primary
  wura: "wura", // Young, sweet
  adaora: "adaora", // Warm, engaging
  idera: "idera", // Melodic, gentle
} as const;

const DEFAULT_VOICE = YARNGPT_VOICES.chinenye;

/**
 * Convert text to speech using YarnGPT API.
 * Returns audio buffer (audio/mpeg).
 */
export async function synthesizeWithYarnGPT(
  text: string,
  voice: string = DEFAULT_VOICE
): Promise<Buffer> {
  const apiKey = process.env.YARNGPT_API_KEY;
  if (!apiKey) throw new Error("YARNGPT_API_KEY not configured");

  // Replace symbols with spoken words for natural pronunciation
  const spokenText = text.replace(/₦/g, "naira ");

  if (spokenText.length > 2000) {
    console.warn(
      `YarnGPT: text exceeds 2000 char limit (${spokenText.length}), truncating`
    );
  }

  const response = await fetch("https://yarngpt.ai/api/v1/tts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      text: spokenText.slice(0, 2000),
      voice,
      format: "mp3",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("YarnGPT error:", response.status, errorText);
    throw new Error(`YarnGPT TTS failed: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
