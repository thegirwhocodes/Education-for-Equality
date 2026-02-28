import { NextRequest, NextResponse } from "next/server";
import {
  createGatherResponse,
  createEndCallResponse,
  parseTwilioBody,
  twimlHeaders,
  isTwilioRequest,
} from "@/lib/voice/twiml";
import { getCallState, addMessage } from "@/lib/voice/call-state";
import { callSabi } from "@/lib/voice/sabi-shared";

// Patterns that indicate Sabi is wrapping up the lesson
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
 * POST /api/sabi/voice/respond
 *
 * Twilio action URL — called after <Gather> captures the child's speech.
 * Processes the transcribed speech, sends to Claude, returns next TwiML turn.
 */
export async function POST(req: NextRequest) {
  try {
    const body = parseTwilioBody(await req.text());

    if (!isTwilioRequest(req, body)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const callSid =
      req.nextUrl.searchParams.get("callSid") || body.CallSid || "";
    const speechResult = body.SpeechResult || "";
    const confidence = parseFloat(body.Confidence || "0");

    // Get current call state
    const state = await getCallState(callSid);
    if (!state) {
      return new NextResponse(
        createEndCallResponse(
          "I'm sorry, I lost track of our conversation. Please call back and we can start again."
        ),
        { headers: twimlHeaders() }
      );
    }

    // If no speech detected or very low confidence, ask to repeat
    if (!speechResult || confidence < 0.3) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://curriculum-app-eta.vercel.app";
      const actionUrl = `${baseUrl}/api/sabi/voice/respond?callSid=${encodeURIComponent(callSid)}`;

      return new NextResponse(
        createGatherResponse(
          "I didn't quite hear that. Can you say it again?",
          actionUrl,
          { timeout: 8 }
        ),
        { headers: twimlHeaders() }
      );
    }

    // Add child's speech to conversation
    await addMessage(callSid, "user", speechResult);

    // Build messages array for Claude from call state
    const updatedState = await getCallState(callSid);
    const messages = (updatedState?.messages || []).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    // Check if we've had too many turns (auto wrap-up after ~12 exchanges)
    const turnCount = messages.filter((m) => m.role === "user").length;
    const shouldWrapUp = turnCount >= 12;

    // Get Sabi's response from Claude
    let sabiResponse: string;
    if (shouldWrapUp) {
      // Force wrap-up by adding context
      const wrapUpMessages = [
        ...messages,
        {
          role: "user" as const,
          content:
            "[SYSTEM: This call has been going for a while. Please wrap up the lesson now with a summary and encouragement to call back tomorrow.]",
        },
      ];
      // Remove the system message from the actual messages, just use it for this call
      sabiResponse = await callSabi(wrapUpMessages, state.studentId, true);
    } else {
      sabiResponse = await callSabi(messages, state.studentId, true);
    }

    // Store Sabi's response in call state
    await addMessage(callSid, "assistant", sabiResponse);

    // Check if Sabi is wrapping up
    const isWrappingUp =
      shouldWrapUp ||
      WRAP_UP_PATTERNS.some((pattern) => pattern.test(sabiResponse));

    if (isWrappingUp) {
      // End the call after the goodbye
      return new NextResponse(createEndCallResponse(sabiResponse), {
        headers: twimlHeaders(),
      });
    }

    // Continue the conversation — speak and gather next input
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://curriculum-app-eta.vercel.app";
    const actionUrl = `${baseUrl}/api/sabi/voice/respond?callSid=${encodeURIComponent(callSid)}`;

    const twiml = createGatherResponse(sabiResponse, actionUrl, {
      timeout: 8,
    });

    return new NextResponse(twiml, { headers: twimlHeaders() });
  } catch (error) {
    console.error("Voice respond error:", error);

    return new NextResponse(
      createEndCallResponse(
        "I'm sorry, something went wrong. Please call back and we can continue where we left off."
      ),
      { headers: twimlHeaders() }
    );
  }
}
