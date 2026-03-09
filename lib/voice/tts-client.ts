/**
 * ElevenLabs TTS client — shared by both the /api/sabi/tts route
 * and the Africa's Talking voice pipeline.
 *
 * Returns raw audio buffer (audio/mpeg) for upload to Supabase Storage.
 */

// Olufunmilola — African Female with Nigerian Accent
const VOICE_ID = "9Dbo4hEvXQ5l7MXGZFQA";

/**
 * Convert text to speech using ElevenLabs.
 * Returns audio/mpeg buffer.
 */
export async function synthesizeSpeech(text: string): Promise<Buffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY not configured");

  // Replace symbols with spoken words for natural pronunciation
  const spokenText = text.replace(/₦/g, "naira ");

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
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
    throw new Error(`TTS generation failed: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
