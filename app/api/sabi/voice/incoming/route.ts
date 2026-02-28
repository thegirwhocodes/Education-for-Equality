import { NextRequest, NextResponse } from "next/server";
import {
  createGatherResponse,
  parseTwilioBody,
  twimlHeaders,
} from "@/lib/voice/twiml";
import { createCallState } from "@/lib/voice/call-state";
import {
  findOrCreateStudentByPhone,
  callSabi,
} from "@/lib/voice/sabi-shared";

/**
 * POST /api/sabi/voice/incoming
 *
 * Twilio webhook — called when an inbound voice call arrives.
 * Looks up (or creates) the student by phone number,
 * generates a greeting via Claude, and returns TwiML to
 * speak + gather the child's first response.
 */
export async function POST(req: NextRequest) {
  try {
    const body = parseTwilioBody(await req.text());
    const phoneNumber = body.From || body.Caller || "";
    const callSid = body.CallSid || "";

    if (!phoneNumber) {
      return new NextResponse(
        createGatherResponse(
          "Hello! Welcome to Sabi. I could not identify your phone number. Please try again.",
          "/api/sabi/voice/incoming"
        ),
        { headers: twimlHeaders() }
      );
    }

    // Find or create student by phone number
    const student = await findOrCreateStudentByPhone(phoneNumber);

    // Initialize call state in DB
    await createCallState(callSid, phoneNumber, student.id);

    // Generate greeting via Claude
    const greeting = await callSabi([], student.id, true);

    // Store the assistant's greeting in call state
    const { addMessage } = await import("@/lib/voice/call-state");
    await addMessage(callSid, "assistant", greeting);

    // Build the action URL with the call SID for state tracking
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://curriculum-app-eta.vercel.app";
    const actionUrl = `${baseUrl}/api/sabi/voice/respond?callSid=${encodeURIComponent(callSid)}`;

    const twiml = createGatherResponse(greeting, actionUrl, {
      timeout: 8,
    });

    return new NextResponse(twiml, { headers: twimlHeaders() });
  } catch (error) {
    console.error("Voice incoming error:", error);

    // Return a friendly error message via TwiML
    const { createEndCallResponse } = await import("@/lib/voice/twiml");
    return new NextResponse(
      createEndCallResponse(
        "I'm sorry, something went wrong. Please try calling again in a moment."
      ),
      { headers: twimlHeaders() }
    );
  }
}
