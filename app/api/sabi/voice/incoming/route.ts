import { NextRequest, NextResponse } from "next/server";
import {
  parseTwilioBody,
  twimlHeaders,
  isTwilioRequest,
} from "@/lib/voice/twiml";
import {
  createTwilioAudioEndResponse,
  createTwilioAudioGatherResponse,
} from "@/lib/voice/twilio-audio";
import { createCallState } from "@/lib/voice/call-state";
import {
  findOrCreateStudentByPhone,
  callSabiVoiceFast,
} from "@/lib/voice/sabi-shared";

// Allow up to 30 seconds for Claude API + Supabase calls
export const maxDuration = 30;

/**
 * POST /api/sabi/voice/incoming
 *
 * Twilio webhook — called when an inbound voice call arrives.
 * Looks up (or creates) the student by phone number,
 * generates a greeting via Claude, and returns TwiML to
 * play Sabi TTS audio + gather the child's first response.
 */
export async function POST(req: NextRequest) {
  try {
    const body = parseTwilioBody(await req.text());

    // Verify request is from Twilio (prevents unauthorized API usage)
    if (!isTwilioRequest(req, body)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const phoneNumber = body.From || body.Caller || "";
    const callSid = body.CallSid || "";

    if (!phoneNumber) {
      return new NextResponse(
        await createTwilioAudioGatherResponse(
          "Hello! Welcome to Sabi. I could not identify your phone number. Please try again.",
          "/api/sabi/voice/incoming",
          { prefix: "missing_phone" }
        ),
        { headers: twimlHeaders() }
      );
    }

    // Find or create student by phone number
    const student = await findOrCreateStudentByPhone(phoneNumber);

    // Initialize call state in DB
    await createCallState(callSid, phoneNumber, student.id);

    // Generate greeting via fast LLM (Cerebras/Groq → Claude fallback)
    const greeting = await callSabiVoiceFast([], student.id);

    // Store the assistant's greeting in call state
    const { addMessage } = await import("@/lib/voice/call-state");
    await addMessage(callSid, "assistant", greeting);

    // Build the action URL with the call SID for state tracking
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://eduforequality.org";
    const actionUrl = `${baseUrl}/api/sabi/voice/respond?callSid=${encodeURIComponent(callSid)}`;

    const twiml = await createTwilioAudioGatherResponse(greeting, actionUrl, {
      callSid,
      prefix: "greeting",
      timeout: 5,
    });

    return new NextResponse(twiml, { headers: twimlHeaders() });
  } catch (error) {
    console.error("Voice incoming error:", error instanceof Error ? error.message : error);
    console.error("Voice incoming stack:", error instanceof Error ? error.stack : "no stack");

    // Return a friendly error message via TwiML
    return new NextResponse(
      await createTwilioAudioEndResponse(
        "I'm sorry, something went wrong. Please try calling again in a moment.",
        { prefix: "error" }
      ),
      { headers: twimlHeaders() }
    );
  }
}
