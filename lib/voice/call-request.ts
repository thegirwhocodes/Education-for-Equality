import { createClient } from "@supabase/supabase-js";
import { logSMS } from "@/lib/voice/sms";

/**
 * "Text Sabi and she rings you back."
 *
 * A tester or caregiver sends a keyword by SMS; this asks the Sabi voice server
 * to originate an outbound lesson call to them. It exists because the Twilio
 * inbound leg answers immediately — a Nigerian caller dialling the US line pays
 * international rates — and because the Asterisk flash-callback route is only
 * wired into the Africa's Talking context, which voice no longer uses.
 *
 * Every accepted request spends real money on an international call, so the
 * guards here fail CLOSED: an unset allowlist authorises nobody.
 */

const DISPATCH_LOG_TYPE = "call_request_dispatched";

export type CallRequestOutcome =
  | { status: "queued"; phone: string }
  | { status: "not_allowed"; phone: string }
  | { status: "cooldown"; phone: string; waitSeconds: number }
  | { status: "daily_limit"; phone: string; limit: number }
  | { status: "not_configured"; phone: string }
  | { status: "failed"; phone: string; reason: string };

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/** Last 10 digits — tolerates 0801…, 234801…, +234801… for the same handset. */
function phoneKey(phoneNumber: string): string {
  return String(phoneNumber || "").replace(/\D/g, "").slice(-10);
}

/**
 * Normalise to E.164 so Asterisk can dial it.
 *
 * Nigerian handsets and gateways present the same number at least three ways.
 * An 11-digit local number beginning 0 is Nigerian; anything already carrying a
 * country code is left alone so US and other testers still work.
 */
export function toE164(rawPhone: string): string {
  const raw = String(rawPhone || "").trim();
  if (!raw) return "";

  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";

  if (raw.startsWith("+")) return `+${digits}`;
  if (digits.startsWith("234")) return `+${digits}`;
  if (digits.startsWith("0") && digits.length === 11) return `+234${digits.slice(1)}`;
  if (digits.length === 10) return `+234${digits}`;
  return `+${digits}`;
}

function allowlist(): string[] {
  return String(process.env.SABI_CALL_REQUEST_ALLOWLIST || "")
    .split(/[,\s;]+/)
    .map((entry) => phoneKey(entry))
    .filter(Boolean);
}

function isAllowed(phone: string): boolean {
  const permitted = allowlist();
  if (!permitted.length) return false; // fail closed: no allowlist, no calls
  return permitted.includes(phoneKey(phone));
}

function cooldownSeconds(): number {
  const parsed = Number(process.env.SABI_CALL_REQUEST_COOLDOWN_SECONDS);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 180;
}

function dailyLimit(): number {
  const parsed = Number(process.env.SABI_CALL_REQUEST_DAILY_LIMIT);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 8;
}

/**
 * Recent dispatch timestamps for this handset, newest first.
 *
 * Read from `sabi_sms_log` rather than process memory because the webhook runs
 * on serverless instances that do not share state — an in-memory cooldown would
 * let two rapid texts each land on a cold instance and place two calls.
 */
async function recentDispatches(phone: string): Promise<Date[]> {
  try {
    const supabase = getSupabase();
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from("sabi_sms_log")
      .select("phone_number, created_at")
      .eq("sms_type", DISPATCH_LOG_TYPE)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("[call-request] dispatch history lookup failed", error);
      return [];
    }

    const key = phoneKey(phone);
    return (data || [])
      .filter((row) => phoneKey(row.phone_number) === key)
      .map((row) => new Date(row.created_at))
      .filter((date) => !Number.isNaN(date.getTime()));
  } catch (error) {
    console.error("[call-request] dispatch history lookup failed", error);
    return [];
  }
}

/**
 * Ask the Sabi voice server to call this number into a lesson.
 *
 * Returns an outcome rather than throwing: the caller is an SMS webhook that
 * must always answer the provider quickly, whatever happened here.
 */
export async function requestSabiCall(rawPhone: string): Promise<CallRequestOutcome> {
  const phone = toE164(rawPhone);
  if (!phone || phone.replace(/\D/g, "").length < 8) {
    return { status: "failed", phone, reason: "unusable_phone" };
  }

  const serverUrl = String(process.env.SABI_SERVER_URL || "").trim().replace(/\/+$/, "");
  const apiKey = String(process.env.SABI_API_KEY || "").trim();
  if (!serverUrl || !apiKey) {
    return { status: "not_configured", phone };
  }

  if (!isAllowed(phone)) {
    return { status: "not_allowed", phone };
  }

  const history = await recentDispatches(phone);

  const cooldown = cooldownSeconds();
  if (history.length && cooldown > 0) {
    const elapsedSeconds = (Date.now() - history[0].getTime()) / 1000;
    if (elapsedSeconds < cooldown) {
      return {
        status: "cooldown",
        phone,
        waitSeconds: Math.max(1, Math.ceil(cooldown - elapsedSeconds)),
      };
    }
  }

  const limit = dailyLimit();
  if (history.length >= limit) {
    return { status: "daily_limit", phone, limit };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(`${serverUrl}/admin/asterisk/direct-call`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-API-Key": apiKey,
      },
      body: new URLSearchParams({ phone }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const detail = (await response.text().catch(() => "")).slice(0, 200);
      console.error("[call-request] voice server refused", response.status, detail);
      return { status: "failed", phone, reason: `voice_server_${response.status}` };
    }

    // Logged only after the server accepts, so a refused request does not burn
    // the caller's cooldown or their daily allowance.
    await logSMS({
      phone_number: phone,
      direction: "outbound",
      message: "Sabi lesson call requested by SMS",
      sms_type: DISPATCH_LOG_TYPE,
      channel: "at",
    });

    return { status: "queued", phone };
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    console.error("[call-request] voice server unreachable", error);
    return { status: "failed", phone, reason: aborted ? "voice_server_timeout" : "voice_server_unreachable" };
  } finally {
    clearTimeout(timeout);
  }
}

/** The SMS Sabi texts back, in the tester's own terms. */
export function callRequestReply(outcome: CallRequestOutcome): string {
  switch (outcome.status) {
    case "queued":
      return "Sabi is calling you now. Pick up when the phone rings — the call is free, you are not charged. If it does not arrive in 2 minutes, text CALL again.";
    case "cooldown":
      return `Sabi is already calling you. Give it about ${outcome.waitSeconds} seconds. If no call arrives, text CALL again after that.`;
    case "daily_limit":
      return `You have had ${outcome.limit} Sabi calls today, which is the daily limit. Text CALL again tomorrow, or message Naomi if you need more.`;
    case "not_allowed":
      return "This number is not on the Sabi test list yet. Send Naomi your number on WhatsApp (+1 860 436 7048) and she will add you.";
    default:
      return "Sabi could not start the call just now. Naomi has been notified — please text CALL again in a few minutes.";
  }
}
