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
  // Filename extension must match actual format or Groq may reject it
  const ext = mimeType.includes("webm") ? "webm" : mimeType.includes("mp3") ? "mp3" : mimeType.includes("ogg") ? "ogg" : "wav";
  formData.append("file", blob, `audio.${ext}`);
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

  const text = (result.text || "").trim();

  // No text at all → definitely nothing intelligible.
  if (!text) {
    return { text: "", confidence: 0 };
  }

  // Derive a MEANINGFUL confidence from Whisper's per-segment diagnostics.
  // avg_logprob alone is nearly constant (~0.7-0.9) and never catches the
  // cases we care about (silence, hallucinated garbage), so combine three:
  //   avg_logprob       — avg log-prob of chosen tokens (≈ -0.1 good … -1.0+ poor)
  //   no_speech_prob    — P(segment is non-speech / silence)
  //   compression_ratio — high (>2.4) signals repetitive hallucinated garbage
  type Segment = {
    avg_logprob?: number;
    no_speech_prob?: number;
    compression_ratio?: number;
  };
  const segments: Segment[] = Array.isArray(result.segments)
    ? result.segments
    : [];

  if (segments.length === 0) {
    return { text, confidence: 0.6 };
  }

  const n = segments.length;
  const avgLogProb =
    segments.reduce((sum, s) => sum + (s.avg_logprob ?? -0.5), 0) / n;
  const avgNoSpeech =
    segments.reduce((sum, s) => sum + (s.no_speech_prob ?? 0), 0) / n;
  const maxCompression = segments.reduce(
    (max, s) => Math.max(max, s.compression_ratio ?? 0),
    0
  );

  // -1.2 → 0.0, -0.1 → 1.0 (matches Whisper's real-world usable range)
  const logProbScore = Math.max(0, Math.min(1, (avgLogProb + 1.2) / 1.1));
  let confidence = logProbScore;

  // Penalize probable silence / breathing / background noise.
  if (avgNoSpeech > 0.6) confidence *= 0.2;
  else if (avgNoSpeech > 0.4) confidence *= 0.6;

  // Penalize hallucinated repetition (Whisper invents loops on noise).
  if (maxCompression > 2.4) confidence *= 0.3;

  confidence = Math.max(0, Math.min(1, confidence));
  return { text, confidence };
}
