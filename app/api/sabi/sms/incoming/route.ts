import { NextRequest, NextResponse } from "next/server";
import { parseTwilioBody } from "@/lib/voice/twiml";
import { checkPracticeAnswer, logSMS, sendSMS } from "@/lib/voice/sms";

export const runtime = "nodejs";

type IncomingSmsProvider = "at" | "twilio" | "unknown";

type IncomingSms = {
  provider: IncomingSmsProvider;
  from: string;
  to: string;
  text: string;
  messageId: string | null;
  linkId: string | null;
  raw: Record<string, string>;
};

function recordFromJson(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const record: Record<string, string> = {};
  for (const [key, rawValue] of Object.entries(value)) {
    record[key] = rawValue == null ? "" : String(rawValue);
  }
  return record;
}

function parseWebhookBody(rawBody: string, contentType: string): Record<string, string> {
  const body = rawBody.trim();
  if (body && (contentType.includes("application/json") || body.startsWith("{"))) {
    try {
      const parsed = JSON.parse(body);
      return recordFromJson(parsed);
    } catch {
      // Fall through to form parsing; some providers send a loose content type.
    }
  }

  const params = new URLSearchParams(rawBody);
  const record: Record<string, string> = {};
  params.forEach((value, key) => {
    record[key] = value;
  });

  return Object.keys(record).length ? record : parseTwilioBody(rawBody);
}

function firstPresent(record: Record<string, string>, keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (value != null && String(value).trim()) return String(value).trim();
  }
  return "";
}

function detectProvider(record: Record<string, string>): IncomingSmsProvider {
  if (record.MessageSid || record.SmsSid || record.From || record.Body) return "twilio";
  if (record.linkId || record.text || record.date || record.id || record.from) return "at";
  return "unknown";
}

function parseIncomingSms(rawBody: string, contentType: string): IncomingSms {
  const raw = parseWebhookBody(rawBody, contentType);
  const provider = detectProvider(raw);
  return {
    provider,
    from: firstPresent(raw, ["From", "from", "sender", "phoneNumber", "msisdn"]),
    to: firstPresent(raw, ["To", "to", "recipient", "shortCode"]),
    text: firstPresent(raw, ["Body", "body", "text", "message", "Message"]),
    messageId: firstPresent(raw, ["MessageSid", "SmsSid", "messageId", "id"]) || null,
    linkId: firstPresent(raw, ["linkId", "LinkId"]) || null,
    raw,
  };
}

function webhookAuthorized(req: NextRequest): boolean {
  const secret = process.env.SABI_SMS_WEBHOOK_SECRET;
  if (!secret) return true;
  const supplied =
    req.nextUrl.searchParams.get("key") ||
    req.headers.get("x-sabi-sms-secret") ||
    "";
  return supplied === secret;
}

function callbackNumber(): string {
  return (
    process.env.NEXT_PUBLIC_SABI_LINE ||
    process.env.AT_SENDER_ID ||
    process.env.TWILIO_PHONE_NUMBER ||
    "+234 201 700 1459"
  );
}

function classifySms(text: string): "reply" | "help" | "opt_in" | "opt_out" {
  const normalized = text.trim().toUpperCase();
  if (/^(STOP|UNSUBSCRIBE|CANCEL|END|QUIT)\b/.test(normalized)) return "opt_out";
  if (/^(START|YES|Y)\b/.test(normalized)) return "opt_in";
  if (/^(HELP|INFO)\b/.test(normalized)) return "help";
  return "reply";
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function stripSharedShortcodeKeyword(text: string): string {
  const keyword = (process.env.SABI_SMS_KEYWORD || "").trim();
  if (!keyword) return text.trim();

  const withoutKeyword = text
    .trim()
    .replace(new RegExp(`^${escapeRegExp(keyword)}(?:\\b|[\\s:;,.\\-]+)`, "i"), "")
    .trim();

  return withoutKeyword || "HELP";
}

function emptyTwilioResponse() {
  return new NextResponse(
    '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
    { headers: { "Content-Type": "text/xml" } }
  );
}

function acceptedResponse(provider: IncomingSmsProvider) {
  if (provider === "twilio") return emptyTwilioResponse();
  return NextResponse.json({ ok: true });
}

/**
 * POST /api/sabi/sms/incoming
 *
 * SMS webhook for Twilio and Africa's Talking inbound messages.
 * Checks if the message is a reply to a practice question,
 * validates the answer, and sends feedback.
 */
export async function POST(req: NextRequest) {
  if (!webhookAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 403 });
  }

  try {
    const incoming = parseIncomingSms(
      await req.text(),
      req.headers.get("content-type") || ""
    );
    const phoneNumber = incoming.from;
    const rawMessageBody = incoming.text.trim();
    const messageBody = stripSharedShortcodeKeyword(rawMessageBody);

    if (!phoneNumber || !rawMessageBody) {
      return acceptedResponse(incoming.provider);
    }

    const smsType = classifySms(messageBody);
    await logSMS({
      phone_number: phoneNumber,
      direction: "inbound",
      message: rawMessageBody,
      sms_type: smsType,
      channel: incoming.provider,
    });

    if (smsType === "opt_out") {
      await sendSMS(
        phoneNumber,
        "We have noted your STOP request. The Education for Equality team will pause Sabi SMS for this number.",
        "opt_out_confirmation",
        { ignoreOptOut: true },
      );
      return acceptedResponse(incoming.provider);
    }

    if (smsType === "opt_in") {
      await sendSMS(
        phoneNumber,
        `Welcome back to Sabi SMS. Flash ${callbackNumber()} when you want Sabi to call back for a lesson. Reply STOP any time to pause SMS.`,
        "opt_in_confirmation",
        { ignoreOptOut: true },
      );
      return acceptedResponse(incoming.provider);
    }

    if (smsType === "help") {
      await sendSMS(
        phoneNumber,
        `Sabi is the free Education for Equality phone tutor. Flash ${callbackNumber()} and Sabi will call back. Sabi will never ask for money or passwords. Reply STOP to pause SMS.`,
        "help"
      );
      return acceptedResponse(incoming.provider);
    }

    // Check if this is an answer to a practice question
    const result = await checkPracticeAnswer(phoneNumber, messageBody);

    if (result) {
      // Send feedback
      await sendSMS(phoneNumber, result.feedback, "reply");
    } else {
      // No pending practice question — send a friendly response
      await sendSMS(
        phoneNumber,
        `Hi! To start a lesson with Sabi, flash ${callbackNumber()} and Sabi will call back. Sabi teaches reading and maths through short phone lessons.`,
        "general"
      );
    }

    return acceptedResponse(incoming.provider);
  } catch (error) {
    console.error("SMS incoming error:", error);
    return NextResponse.json({ ok: true });
  }
}
