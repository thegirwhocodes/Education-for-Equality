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
import { callSabiVoiceFast } from "@/lib/voice/sabi-shared";
import { transcribeAudio } from "@/lib/voice/stt";
import { normalizeNumberMishears } from "@/lib/voice/answer-matcher";
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
  const startedAt = Date.now();

  Sentry.setTags({
    "at.session_id": sessionId,
    "at.student_id": studentId,
    "at.route": "recording",
  });

  try {
    const body = parseATBody(await req.text());
    const recordingUrl = body.recordingUrl || "";

    console.log(
      `[AT recording] start session=${sessionId} student=${studentId} ` +
        `recordingUrl=${recordingUrl ? "present" : "absent"} ` +
        `bodyKeys=${Object.keys(body).join(",")}`
    );
    Sentry.setContext("at_recording_body_keys", { keys: Object.keys(body) });

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
    console.log(
      `[AT recording] downloaded session=${sessionId} bytes=${audioBuffer.length} elapsed=${Date.now() - startedAt}ms`
    );

    // 2. STT via Groq Whisper
    const sttResult = await transcribeAudio(audioBuffer);
    console.log(
      `[AT recording] stt session=${sessionId} text="${sttResult.text.slice(0, 80)}" ` +
        `confidence=${sttResult.confidence.toFixed(2)} elapsed=${Date.now() - startedAt}ms`
    );

    // 3. Handle empty speech. We DO NOT gate on confidence here — Whisper's
    // confidence on compressed VoIP audio (Yolla, Skype, AT PSTN) is almost
    // always low even when the transcript is usable. Trust the text and let
    // Claude handle noisy input — it's robust to dropped phonemes.
    if (!sttResult.text.trim()) {
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

    // 3b. Normalize Nigerian-English numeral mishears before the LLM sees it
    const cleaned = normalizeNumberMishears(sttResult.text);
    if (cleaned.changed) {
      console.log(
        `[answer-matcher] "${sttResult.text}" -> "${cleaned.text}"`,
        cleaned.substitutions
      );
    }
    const childText = cleaned.text;

    // 4. Get conversation history and add child's speech
    const state = await getCallState(sessionId);
    const updatedState = await addMessage(sessionId, "user", childText);

    const messages = (
      updatedState?.messages ||
      state?.messages || [{ role: "user" as const, content: childText }]
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
      sabiResponse = await callSabiVoiceFast(wrapUpMessages, studentId);
    } else {
      sabiResponse = await callSabiVoiceFast(messages, studentId);
    }
    console.log(
      `[AT recording] llm session=${sessionId} chars=${sabiResponse.length} elapsed=${Date.now() - startedAt}ms`
    );

    // 7. Save Sabi's response to call state
    await addMessage(sessionId, "assistant", sabiResponse);

    // 8. Check for wrap-up signals
    const isWrappingUp =
      shouldWrapUp ||
      WRAP_UP_PATTERNS.some((pattern) => pattern.test(sabiResponse));

    // 9. Reliability-first phone loop: use AT <Say> for post-recording turns.
    // Generating/uploading custom MP3 on every turn adds another external
    // network hop after STT + LLM; on real calls that feels like dead air.
    // Keep the first greeting polished, then prioritize a sustained loop.
    if (isWrappingUp) {
      return new NextResponse(createSayAndHangupResponse(sabiResponse), {
        headers: xmlHeaders(),
      });
    }
    return new NextResponse(
      createSayAndRecordResponse(sabiResponse, callbackUrl),
      { headers: xmlHeaders() }
    );
  } catch (error) {
    Sentry.captureException(error);
    await Sentry.flush(2000);
    console.error(
      "AT recording error:",
      error instanceof Error ? error.message : error
    );

    // Soft degrade: let the child try again in-call instead of hanging up.
    const retryText =
      "Hmm, I didn't catch that — my fault. Let's try once more. Go ahead.";
    const retryCallback = `${
      process.env.NEXT_PUBLIC_APP_URL || "https://eduforequality.org"
    }/api/sabi/at/recording?session=${encodeURIComponent(
      sessionId
    )}&student=${encodeURIComponent(studentId)}`;
    try {
      const audio = await synthesizeSpeech(retryText);
      const audioUrl = await uploadAudio(audio, `error_${Date.now()}.mp3`);
      return new NextResponse(
        createPlayAndRecordResponse(audioUrl, retryCallback),
        { headers: xmlHeaders() }
      );
    } catch {
      // Last resort — AT's built-in <Say> (Google TTS, free), still re-recording
      return new NextResponse(
        createSayAndRecordResponse(retryText, retryCallback),
        { headers: xmlHeaders() }
      );
    }
  }
}
