import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import {
  parseATBody,
  xmlHeaders,
  createPlayAndRecordResponse,
  createPlayAndHangupResponse,
  createSayAndRecordResponse,
  createSayAndHangupResponse,
} from "@/lib/voice/at-xml";
import { getCallState, addMessage } from "@/lib/voice/call-state";
import { callSabi } from "@/lib/voice/sabi-shared";
import { transcribeAudio } from "@/lib/voice/stt";
import { synthesizeSpeech } from "@/lib/voice/tts-client";
import { uploadAudio, downloadAudio } from "@/lib/voice/audio-storage";

// Full pipeline: download recording + STT + Claude + TTS + upload
export const maxDuration = 60;

// Patterns that indicate Sabi is wrapping up
const WRAP_UP_PATTERNS = [
  /call me back/i,
  /bye bye/i,
  /see you next time/i,
  /until next time/i,
  /talk soon/i,
  /well done today/i,
  /great job today/i,
  /that's all for today/i,
  /our time is up/i,
  /let's stop here/i,
];

/**
 * POST /api/sabi/at/recording
 *
 * Africa's Talking recording callback — called after <Record> captures speech.
 *
 * Pipeline:
 *   1. Download recording from AT's URL
 *   2. Transcribe via Groq Whisper (free)
 *   3. Get Sabi's response from Claude
 *   4. Convert response to audio via YarnGPT (or ElevenLabs fallback)
 *   5. Upload audio to Supabase Storage
 *   6. Return AT XML: <Play response> + <Record> (or just <Play> to end)
 */
export async function POST(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session") || "";
  const studentId = req.nextUrl.searchParams.get("student") || "";

  Sentry.setTags({
    "at.session_id": sessionId,
    "at.student_id": studentId,
    "at.route": "recording",
  });

  try {
    const body = parseATBody(await req.text());
    const recordingUrl = body.recordingUrl || "";

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://eduforequality.org";
    const callbackUrl = `${baseUrl}/api/sabi/at/recording?session=${encodeURIComponent(sessionId)}&student=${encodeURIComponent(studentId)}`;

    // No recording URL — ask child to repeat
    if (!recordingUrl) {
      const repeatText = "I didn't quite hear that. Can you say it again?";
      try {
        const audio = await synthesizeSpeech(repeatText);
        const audioUrl = await uploadAudio(
          audio,
          `repeat_${sessionId}_${Date.now()}.mp3`
        );
        return new NextResponse(
          createPlayAndRecordResponse(audioUrl, callbackUrl),
          { headers: xmlHeaders() }
        );
      } catch {
        return new NextResponse(
          createSayAndRecordResponse(repeatText, callbackUrl),
          { headers: xmlHeaders() }
        );
      }
    }

    // 1. Download recording from Africa's Talking
    const audioBuffer = await downloadAudio(recordingUrl);

    // 2. STT via Groq Whisper
    const sttResult = await transcribeAudio(audioBuffer);

    // 3. Handle low confidence / empty speech
    if (!sttResult.text.trim() || sttResult.confidence < 0.3) {
      const repeatText = "I didn't quite hear that. Can you say it again?";
      try {
        const audio = await synthesizeSpeech(repeatText);
        const audioUrl = await uploadAudio(
          audio,
          `repeat_${sessionId}_${Date.now()}.mp3`
        );
        return new NextResponse(
          createPlayAndRecordResponse(audioUrl, callbackUrl),
          { headers: xmlHeaders() }
        );
      } catch {
        return new NextResponse(
          createSayAndRecordResponse(repeatText, callbackUrl),
          { headers: xmlHeaders() }
        );
      }
    }

    // 4. Get conversation history and add child's speech
    const state = await getCallState(sessionId);
    const updatedState = await addMessage(sessionId, "user", sttResult.text);

    const messages = (
      updatedState?.messages ||
      state?.messages || [{ role: "user" as const, content: sttResult.text }]
    ).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    // 5. Check if we should wrap up (~12 exchanges)
    const userTurns = messages.filter((m) => m.role === "user").length;
    const shouldWrapUp = userTurns >= 12;

    // 6. Get Sabi's response from Claude
    let sabiResponse: string;
    if (shouldWrapUp) {
      const wrapUpMessages = [
        ...messages,
        {
          role: "user" as const,
          content:
            "[SYSTEM: This call has been going for a while. Please wrap up the lesson now with a summary and encouragement to call back tomorrow.]",
        },
      ];
      sabiResponse = await callSabi(wrapUpMessages, studentId, true);
    } else {
      sabiResponse = await callSabi(messages, studentId, true);
    }

    // 7. Save Sabi's response to call state
    await addMessage(sessionId, "assistant", sabiResponse);

    // 8. Check for wrap-up signals
    const isWrappingUp =
      shouldWrapUp ||
      WRAP_UP_PATTERNS.some((pattern) => pattern.test(sabiResponse));

    // 9. TTS — convert response to audio (YarnGPT → ElevenLabs → AT <Say>)
    try {
      const responseAudio = await synthesizeSpeech(sabiResponse);
      const responseUrl = await uploadAudio(
        responseAudio,
        `response_${sessionId}_${Date.now()}.mp3`
      );

      if (isWrappingUp) {
        return new NextResponse(createPlayAndHangupResponse(responseUrl), {
          headers: xmlHeaders(),
        });
      }

      // 10. Continue conversation — play response and record next input
      return new NextResponse(
        createPlayAndRecordResponse(responseUrl, callbackUrl),
        { headers: xmlHeaders() }
      );
    } catch {
      // TTS failed — fall back to AT's <Say> (Google TTS)
      console.warn("All TTS providers failed, using AT <Say> fallback");
      if (isWrappingUp) {
        return new NextResponse(
          createSayAndHangupResponse(sabiResponse),
          { headers: xmlHeaders() }
        );
      }
      return new NextResponse(
        createSayAndRecordResponse(sabiResponse, callbackUrl),
        { headers: xmlHeaders() }
      );
    }
  } catch (error) {
    console.error(
      "AT recording error:",
      error instanceof Error ? error.message : error
    );

    // Try TTS error message, fall back to AT's <Say> (Google TTS)
    try {
      const audio = await synthesizeSpeech(
        "I'm sorry, something went wrong. Please call back and we can continue where we left off."
      );
      const audioUrl = await uploadAudio(audio, `error_${Date.now()}.mp3`);
      return new NextResponse(createPlayAndHangupResponse(audioUrl), {
        headers: xmlHeaders(),
      });
    } catch {
      // Last resort — AT's built-in <Say> (Google TTS, free)
      return new NextResponse(
        createSayAndHangupResponse(
          "I'm sorry, something went wrong. Please call back and we can continue where we left off."
        ),
        { headers: xmlHeaders() }
      );
    }
  }
}
