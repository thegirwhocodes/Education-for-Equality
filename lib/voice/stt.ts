/**
 * Groq Whisper STT client.
 * Free tier: 28,800 audio seconds/day (~480 minutes, ~240 calls).
 * Model: whisper-large-v3
 */

export interface STTResult {
  text: string;
  confidence: number;
}

/**
 * Transcribe audio using Groq's Whisper API.
 * Accepts audio buffer (WAV, MP3, etc.) and returns text + confidence.
 */
export async function transcribeAudio(
  audioBuffer: Buffer,
  mimeType: string = "audio/wav"
): Promise<STTResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not configured");

  const formData = new FormData();
  const blob = new Blob([new Uint8Array(audioBuffer)], { type: mimeType });
  formData.append("file", blob, "audio.wav");
  formData.append("model", "whisper-large-v3");
  formData.append("language", "en");
  formData.append("response_format", "verbose_json");

  const response = await fetch(
    "https://api.groq.com/openai/v1/audio/transcriptions",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Groq STT error:", response.status, errorText);
    throw new Error(`STT failed: ${response.status}`);
  }

  const result = await response.json();

  // Derive confidence from Whisper's avg_logprob in segments
  let confidence = 0.0;
  if (result.text && result.text.trim()) {
    if (result.segments && result.segments.length > 0) {
      const avgLogProb =
        result.segments.reduce(
          (sum: number, s: { avg_logprob: number }) => sum + s.avg_logprob,
          0
        ) / result.segments.length;
      // Map log prob to 0-1 range: -1.0 → 0.0, 0.0 → 1.0
      confidence = Math.max(0, Math.min(1, 1 + avgLogProb));
    } else {
      confidence = 0.8; // Default when segments aren't returned
    }
  }

  return { text: result.text || "", confidence };
}
