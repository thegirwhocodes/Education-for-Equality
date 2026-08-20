import { NextRequest, NextResponse } from "next/server";
import { logSMS } from "@/lib/voice/sms";
import { callRequestReply, requestSabiCall } from "@/lib/voice/call-request";
import { classifyInbound, stripKeyword } from "@/lib/voice/inbound-intent";

export const runtime = "nodejs";

/**
 * POST /api/sabi/whatsapp/incoming
 *
 * Inbound WhatsApp webhook (Twilio). Same "text CALL and Sabi rings you"
 * behaviour as the SMS webhook, on a channel that works from outside Nigeria —
 * Nigerian Africa's Talking shortcodes are not reachable from an international
 * handset, so WhatsApp is the only trigger Naomi herself can use from the US.
 *
 * Replies with TwiML so Twilio sends the answer on the same WhatsApp thread;
 * that needs no second API call and works on the sandbox sender.
 */

function authorized(req: NextRequest): boolean {
  const secret = process.env.SABI_SMS_WEBHOOK_SECRET;
  if (!secret) return true;
  const supplied =
    req.nextUrl.searchParams.get("key") || req.headers.get("x-sabi-sms-secret") || "";
  return supplied === secret;
}

/** Twilio addresses WhatsApp endpoints as "whatsapp:+234…". */
function stripChannelPrefix(address: string): string {
  return String(address || "").trim().replace(/^whatsapp:/i, "").trim();
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function twiml(message?: string): NextResponse {
  const body = message
    ? `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(message)}</Message></Response>`
    : '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';
  return new NextResponse(body, { headers: { "Content-Type": "text/xml" } });
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 403 });
  }

  try {
    const form = new URLSearchParams(await req.text());
    const phoneNumber = stripChannelPrefix(form.get("From") || "");
    const rawBody = (form.get("Body") || "").trim();

    if (!phoneNumber || !rawBody) return twiml();

    const body = stripKeyword(rawBody);
    const intent = classifyInbound(body);

    await logSMS({
      phone_number: phoneNumber,
      direction: "inbound",
      message: rawBody,
      sms_type: intent,
      channel: "whatsapp",
    });

    if (intent === "opt_out") {
      return twiml(
        "Noted — Sabi will stop messaging this number. Reply START any time to turn it back on."
      );
    }

    if (intent === "opt_in") {
      return twiml(
        "Welcome back. Send CALL any time you want a lesson and Sabi will ring you — the call is free."
      );
    }

    if (intent === "call_request") {
      const outcome = await requestSabiCall(phoneNumber);
      console.log(
        `[whatsapp] call request from ${phoneNumber} -> ${outcome.status}`,
        outcome.status === "failed" ? outcome.reason : ""
      );
      await logSMS({
        phone_number: phoneNumber,
        direction: "outbound",
        message: callRequestReply(outcome),
        sms_type: `call_request_${outcome.status}`,
        channel: "whatsapp",
      });
      return twiml(callRequestReply(outcome));
    }

    if (intent === "help") {
      return twiml(
        "Sabi is the free Education for Equality phone tutor. Send CALL and Sabi will ring you for a short lesson — you are never charged. Sabi will never ask for money or passwords."
      );
    }

    return twiml("Send CALL and Sabi will ring you for a short maths lesson. The call is free.");
  } catch (error) {
    console.error("WhatsApp incoming error:", error);
    return twiml();
  }
}
