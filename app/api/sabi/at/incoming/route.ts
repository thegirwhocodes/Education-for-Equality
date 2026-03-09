import { NextRequest, NextResponse } from "next/server";
import {
  parseATBody,
  xmlHeaders,
  createPlayAndRecordResponse,
  createRejectResponse,
} from "@/lib/voice/at-xml";
import { createCallState } from "@/lib/voice/call-state";
import { addMessage } from "@/lib/voice/call-state";
import { findOrCreateStudentByPhone, callSabi } from "@/lib/voice/sabi-shared";
import { synthesizeSpeech } from "@/lib/voice/tts-client";
import { uploadAudio } from "@/lib/voice/audio-storage";

// AT recording download + Groq STT + Claude + ElevenLabs TTS + Supabase upload
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
 *   3. TTS via ElevenLabs → upload to Supabase Storage
 *   4. Return AT XML: <Play greeting> + <Record> with callback to /at/recording
 */
export async function POST(req: NextRequest) {
  try {
    const body = parseATBody(await req.text());

    const callerNumber = body.callerNumber || "";
    const sessionId = body.sessionId || "";
    const isActive = body.isActive || "1";

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

    // Generate greeting via Claude
    const greeting = await callSabi([], student.id, true);

    // Save greeting to call state
    await addMessage(sessionId, "assistant", greeting);

    // TTS — convert greeting to audio
    const audioBuffer = await synthesizeSpeech(greeting);
    const audioUrl = await uploadAudio(
      audioBuffer,
      `greeting_${sessionId}.mp3`
    );

    // Build callback URL for when the child finishes speaking
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://eduforequality.org";
    const callbackUrl = `${baseUrl}/api/sabi/at/recording?session=${encodeURIComponent(sessionId)}&student=${encodeURIComponent(student.id)}&module=${student.isNew ? 0 : "current"}`;

    // Return XML: play greeting, then record child's response
    return new NextResponse(
      createPlayAndRecordResponse(audioUrl, callbackUrl),
      { headers: xmlHeaders() }
    );
  } catch (error) {
    console.error(
      "AT incoming error:",
      error instanceof Error ? error.message : error
    );

    // Try to play an error message
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
      // Last resort — just reject
      return new NextResponse(createRejectResponse(), {
        headers: xmlHeaders(),
      });
    }
  }
}
