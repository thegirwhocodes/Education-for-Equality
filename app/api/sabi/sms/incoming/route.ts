import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { parseTwilioBody } from "@/lib/voice/twiml";
import { checkPracticeAnswer, sendSMS } from "@/lib/voice/sms";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * POST /api/sabi/sms/incoming
 *
 * Twilio webhook — called when an inbound SMS arrives.
 * Checks if the message is a reply to a practice question,
 * validates the answer, and sends feedback.
 */
export async function POST(req: NextRequest) {
  try {
    const body = parseTwilioBody(await req.text());
    const phoneNumber = body.From || "";
    const messageBody = (body.Body || "").trim();

    if (!phoneNumber || !messageBody) {
      return NextResponse.json({ ok: true });
    }

    // Log inbound SMS
    const supabase = getSupabase();
    await supabase.from("sabi_sms_log").insert({
      phone_number: phoneNumber,
      direction: "inbound",
      message: messageBody,
      sms_type: "reply",
    });

    // Check if this is an answer to a practice question
    const result = await checkPracticeAnswer(phoneNumber, messageBody);

    if (result) {
      // Send feedback
      await sendSMS(phoneNumber, result.feedback, "reply");
    } else {
      // No pending practice question — send a friendly response
      const callbackNumber = process.env.TWILIO_PHONE_NUMBER || "";
      await sendSMS(
        phoneNumber,
        `Hi! To start a lesson with Sabi, call ${callbackNumber}. Sabi will teach you maths through fun market scenarios!`,
        "general"
      );
    }

    // Return TwiML response (empty — we handle via API, not TwiML messaging)
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      { headers: { "Content-Type": "text/xml" } }
    );
  } catch (error) {
    console.error("SMS incoming error:", error);
    return NextResponse.json({ ok: true });
  }
}
