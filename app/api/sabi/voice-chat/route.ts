import { NextRequest, NextResponse } from "next/server";
import { callSabi } from "@/lib/voice/sabi-shared";
import { transcribeAudio } from "@/lib/voice/stt";
import { synthesizeSpeech } from "@/lib/voice/tts-client";
import { normalizeNumberMishears } from "@/lib/voice/answer-matcher";

/**
 * POST /api/sabi/voice-chat
 *
 * Full voice pipeline for browser testing — mirrors what happens on a real phone call.
 * Pipeline: Groq Whisper STT → Claude Haiku → YarnGPT/ElevenLabs TTS
 *
 * Accepts FormData:
 *   - audio: audio blob from MediaRecorder (webm/ogg)
 *   - messages: JSON string of conversation history
 *   - student_id: student UUID
 *
 * Returns JSON:
 *   - transcript: what the user said (STT result)
 *   - response: Sabi's reply text
 *   - audio: base64-encoded audio/mpeg (TTS result)
 */
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as Blob | null;
    const messagesJson = formData.get("messages") as string | null;
    const studentId = formData.get("student_id") as string | null;

    // Parse conversation history
    const messages: { role: "user" | "assistant"; content: string }[] =
      messagesJson ? JSON.parse(messagesJson) : [];

    // If no audio, this is an init request — just get Sabi's greeting
    if (!audioFile) {
      const response = await callSabi(messages, studentId || null, true);
      const audioBuffer = await synthesizeSpeech(response);
      const audioBase64 = audioBuffer.toString("base64");

      return NextResponse.json({
        transcript: "",
        response,
        audio: audioBase64,
      });
    }

    // 1. STT — transcribe user's audio via Groq Whisper
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = audioFile.type || "audio/webm";
    const sttResult = await transcribeAudio(buffer, mimeType);

    // Handle empty/low-confidence speech
    if (!sttResult.text.trim() || sttResult.confidence < 0.3) {
      const retryText = "I didn't quite hear that. Can you say it again?";
      const audioBuffer = await synthesizeSpeech(retryText);
      const audioBase64 = audioBuffer.toString("base64");

      return NextResponse.json({
        transcript: sttResult.text || "(unclear)",
        response: retryText,
        audio: audioBase64,
      });
    }

    const cleaned = normalizeNumberMishears(sttResult.text);
    const childText = cleaned.text;

    // 2. Add user message to history
    const updatedMessages = [
      ...messages,
      { role: "user" as const, content: childText },
    ];

    // 3. LLM — get Sabi's response from Claude
    const response = await callSabi(updatedMessages, studentId || null, true);

    // 4. TTS — convert to audio via YarnGPT (or ElevenLabs fallback)
    const audioBuffer = await synthesizeSpeech(response);
    const audioBase64 = audioBuffer.toString("base64");

    return NextResponse.json({
      transcript: childText,
      raw_transcript: sttResult.text,
      substitutions: cleaned.substitutions,
      response,
      audio: audioBase64,
    });
  } catch (error) {
    console.error(
      "Voice chat error:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "Voice chat pipeline failed" },
      { status: 500 }
    );
  }
}
