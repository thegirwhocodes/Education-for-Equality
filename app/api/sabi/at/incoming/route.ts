import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import {
  parseATBody,
  xmlHeaders,
  createPlayAndRecordResponse,
  createRejectResponse,
  createSayAndRecordResponse,
  createSayAndHangupResponse,
} from "@/lib/voice/at-xml";
import { createCallState, getCallState } from "@/lib/voice/call-state";
import { addMessage } from "@/lib/voice/call-state";
import { findOrCreateStudentByPhone, callSabiVoiceFast } from "@/lib/voice/sabi-shared";
import { synthesizeSpeech } from "@/lib/voice/tts-client";
import { uploadAudio } from "@/lib/voice/audio-storage";

// AT voice pipeline: Groq STT + Claude Haiku + YarnGPT TTS (ElevenLabs fallback)
export const maxDuration = 60;

/**
 * POST /api/sabi/at/incoming
 *
 * Africa's Talking voice webhook — called when an inbound call arrives.
 * Also called again with isActive=0 when the call ends.
 *
 * Flow:
 *   1. Find or create student by callerNumber
 *   2. Generate greeting via Claude
 *   3. TTS via YarnGPT (or ElevenLabs fallback) → upload to Supabase Storage
 *   4. Return AT XML: <Play greeting> + <Record> with callback to /at/recording
 */
export async function POST(req: NextRequest) {
  try {
    const body = parseATBody(await req.text());

    const callerNumber = body.callerNumber || "";
    const sessionId = body.sessionId || "";
    const isActive = body.isActive || "1";
    const recordingUrl = body.recordingUrl || "";
    const durationInSeconds = body.durationInSeconds || "";

    // Log every incoming hit so we can see what AT actually sends.
    console.log(
      `[AT incoming] session=${sessionId} caller=${callerNumber} isActive=${isActive} ` +
        `recordingUrl=${recordingUrl ? "present" : "absent"} duration=${durationInSeconds}s ` +
        `bodyKeys=${Object.keys(body).join(",")}`
    );

    // Tag the trace so every call is searchable in Sentry by sessionId.
    // We hash the phone number for privacy — never store the raw number on the span.
    Sentry.setTags({
      "at.session_id": sessionId,
      "at.is_active": isActive,
      "at.has_recording": recordingUrl ? "yes" : "no",
      "at.route": "incoming",
    });
    Sentry.setContext("at_body_keys", { keys: Object.keys(body) });

    // AT POSTs back to the voice URL after <Record> completes. The
    // recordingUrl field is the signal that this is a recording callback,
    // not a new call — forward to /at/recording handler logic instead of
    // re-greeting. Look up student_id from the call state we saved on the
    // first POST of this session.
    if (recordingUrl) {
      const state = await getCallState(sessionId);
      const studentId = state?.studentId || "";
      if (!studentId) {
        console.error(
          `[AT incoming] recording POST but no call state for session=${sessionId}`
        );
      }
      const recordingForwardUrl = new URL(
        `/api/sabi/at/recording?session=${encodeURIComponent(sessionId)}&student=${encodeURIComponent(studentId)}`,
        req.url
      ).toString();
      const forwardBody = new URLSearchParams(body as Record<string, string>);
      const fwd = await fetch(recordingForwardUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: forwardBody.toString(),
      });
      const text = await fwd.text();
      return new NextResponse(text, { headers: xmlHeaders() });
    }

    // Call ended — reject and let the events route handle cleanup
    if (isActive === "0") {
      return new NextResponse(createRejectResponse(), {
        headers: xmlHeaders(),
      });
    }

    if (!callerNumber) {
      // Can't identify caller — play a message and hang up
      const audio = await synthesizeSpeech(
        "Hello! Welcome to Sabi. I could not identify your phone number. Please try again."
      );
      const audioUrl = await uploadAudio(
        audio,
        `error_${sessionId}.mp3`
      );
      return new NextResponse(
        `<?xml version="1.0" encoding="UTF-8"?><Response><Play url="${audioUrl}"/></Response>`,
        { headers: xmlHeaders() }
      );
    }

    // Find or create student
    const student = await findOrCreateStudentByPhone(callerNumber);

    // Initialize call state (using AT sessionId as the call identifier)
    await createCallState(sessionId, callerNumber, student.id);

    // Generate greeting via fast voice LLM (Cerebras → Groq → Claude fallback)
    const greeting = await callSabiVoiceFast([], student.id);

    // Save greeting to call state
    await addMessage(sessionId, "assistant", greeting);

    // Build callback URL for when the child finishes speaking
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://eduforequality.org";
    const callbackUrl = `${baseUrl}/api/sabi/at/recording?session=${encodeURIComponent(sessionId)}&student=${encodeURIComponent(student.id)}&module=${student.isNew ? 0 : "current"}`;

    // TTS — convert greeting to audio (YarnGPT → ElevenLabs → AT <Say>)
    try {
      const audioBuffer = await synthesizeSpeech(greeting);
      const audioUrl = await uploadAudio(
        audioBuffer,
        `greeting_${sessionId}.mp3`
      );

      // Return XML: play greeting, then record child's response
      return new NextResponse(
        createPlayAndRecordResponse(audioUrl, callbackUrl),
        { headers: xmlHeaders() }
      );
    } catch {
      // TTS failed — fall back to AT's <Say> (Google TTS)
      console.warn("All TTS providers failed, using AT <Say> fallback");
      return new NextResponse(
        createSayAndRecordResponse(greeting, callbackUrl),
        { headers: xmlHeaders() }
      );
    }
  } catch (error) {
    Sentry.captureException(error);
    await Sentry.flush(2000);
    console.error(
      "AT incoming error:",
      error instanceof Error ? error.message : error
    );

    // Try to play an error message via TTS
    try {
      const audio = await synthesizeSpeech(
        "I'm sorry, something went wrong. Please try calling again in a moment."
      );
      const audioUrl = await uploadAudio(audio, `error_${Date.now()}.mp3`);
      return new NextResponse(
        `<?xml version="1.0" encoding="UTF-8"?><Response><Play url="${audioUrl}"/></Response>`,
        { headers: xmlHeaders() }
      );
    } catch {
      // Last resort — use AT's built-in <Say> (Google TTS, free)
      return new NextResponse(
        createSayAndHangupResponse(
          "I'm sorry, something went wrong. Please try calling again in a moment."
        ),
        { headers: xmlHeaders() }
      );
    }
  }
}
