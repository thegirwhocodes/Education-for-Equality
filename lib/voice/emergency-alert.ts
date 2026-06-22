/**
 * Emergency alert dispatch — "it CANNOT fail, so I always see it."
 * ================================================================
 * When a CRITICAL safeguarding incident (risk 3: abuse / self-harm / emergency)
 * fires, push it to the Focal Point (Naomi) across EVERY available channel so it
 * cannot be missed:
 *   1. Google Calendar event with an immediate popup alarm  (the "on my calendar" ask)
 *   2. SMS to her phone (Africa's Talking, then Twilio)
 *   3. Webhook POST (point EMERGENCY_ALERT_WEBHOOK_URL at Kai / Slack / anything)
 *
 * "Cannot fail" is guaranteed two ways:
 *   - The incident is ALREADY durably recorded before dispatch runs — a Supabase
 *     row (safeguarding.ts) + a loud console.error (captured by Vercel/Sentry).
 *     Even if every push channel is down, the record is not lost.
 *   - Every channel here is attempted independently, RETRIED, and wrapped so it
 *     can never throw. A missing credential just skips that channel. One channel
 *     succeeding is enough.
 *
 * Config (set what you have; more channels = more redundancy):
 *   EMERGENCY_ALERT_PHONE              — Naomi's number (E.164, e.g. +234...)   [SMS]
 *   GOOGLE_OAUTH_CLIENT_ID/_SECRET/_REFRESH_TOKEN, GOOGLE_CALENDAR_ID(=primary) [Calendar]
 *   EMERGENCY_ALERT_WEBHOOK_URL        — Kai / Slack / custom                   [Webhook]
 *   AT_API_KEY/AT_USERNAME/AT_SENDER_ID  or  TWILIO_ACCOUNT_SID/_AUTH_TOKEN/_PHONE_NUMBER [SMS transport]
 */

export interface EmergencyAlert {
  category: string; // self_harm | abuse_disclosure | emergency
  riskLevel: number;
  reason: string;
  studentId: string | null;
  utteranceRedacted: string; // already PII-redacted by the caller
  channel?: string | null; // call channel (at/twilio/web)
  callId?: string | null;
}

type ChannelResult = { channel: string; ok: boolean; detail?: string };

async function withRetry<T>(fn: () => Promise<T>, attempts = 2): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 300 * (i + 1)));
    }
  }
  throw lastErr;
}

function alertTitle(a: EmergencyAlert): string {
  const label =
    a.category === "self_harm"
      ? "self-harm"
      : a.category === "abuse_disclosure"
        ? "abuse disclosure"
        : "emergency";
  return `🚨 SABI SAFEGUARDING — ${label} — review NOW`;
}

function alertBody(a: EmergencyAlert): string {
  return [
    `CRITICAL child-safeguarding alert from Sabi.`,
    `Category: ${a.category} (risk ${a.riskLevel})`,
    `Student: ${a.studentId ?? "unknown"}   Channel: ${a.channel ?? "?"}   Call: ${a.callId ?? "?"}`,
    `What the child said (PII-redacted): ${a.utteranceRedacted}`,
    ``,
    `Action: review the safeguarding queue and follow the Child Protection Policy.`,
    `The child has already received a supportive response. Do NOT delay.`,
  ].join("\n");
}

// --- Channel 1: Google Calendar (immediate popup alarm) -------------------
async function googleCalendarEvent(a: EmergencyAlert): Promise<ChannelResult> {
  const cid = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const secret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const refresh = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
  const calId = process.env.GOOGLE_CALENDAR_ID || "primary";
  if (!cid || !secret || !refresh) return { channel: "gcal", ok: false, detail: "unconfigured" };

  return withRetry(async () => {
    // refresh_token -> access_token
    const tokRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: cid,
        client_secret: secret,
        refresh_token: refresh,
        grant_type: "refresh_token",
      }),
    });
    if (!tokRes.ok) throw new Error(`token ${tokRes.status}`);
    const accessToken = (await tokRes.json()).access_token as string;

    const now = new Date();
    const end = new Date(now.getTime() + 30 * 60 * 1000);
    const evRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calId)}/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: alertTitle(a),
          description: alertBody(a),
          start: { dateTime: now.toISOString() },
          end: { dateTime: end.toISOString() },
          // visual + audible: popup alarm at 0 minutes
          reminders: { useDefault: false, overrides: [{ method: "popup", minutes: 0 }] },
          colorId: "11", // red
        }),
      },
    );
    if (!evRes.ok) throw new Error(`event ${evRes.status}`);
    return { channel: "gcal", ok: true };
  }).catch((e) => ({ channel: "gcal", ok: false, detail: String(e) }));
}

// Recipients = Focal Point + Backup (always-cover). Comma-list supported.
function alertRecipients(): string[] {
  const raw = [
    ...(process.env.EMERGENCY_ALERT_PHONE || "").split(","),
    process.env.EMERGENCY_ALERT_PHONE_BACKUP || "",
  ];
  return [...new Set(raw.map((s) => s.trim()).filter(Boolean))];
}

// --- Channel 2: SMS to Focal Point + Backup (Africa's Talking, then Twilio)
async function sendSms(a: EmergencyAlert): Promise<ChannelResult> {
  const recipients = alertRecipients();
  if (recipients.length === 0)
    return { channel: "sms", ok: false, detail: "no EMERGENCY_ALERT_PHONE[_BACKUP]" };
  const msg = `${alertTitle(a)}\n${a.category} (risk ${a.riskLevel}). Review the Sabi safeguarding queue now.`;

  // Africa's Talking accepts a comma-separated `to` (Focal Point + Backup in one send).
  if (process.env.AT_API_KEY && process.env.AT_USERNAME) {
    const r = await withRetry(async () => {
      const res = await fetch("https://api.africastalking.com/version1/messaging", {
        method: "POST",
        headers: {
          apiKey: process.env.AT_API_KEY!,
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: new URLSearchParams({
          username: process.env.AT_USERNAME!,
          to: recipients.join(","),
          message: msg,
          ...(process.env.AT_SENDER_ID ? { from: process.env.AT_SENDER_ID } : {}),
        }),
      });
      if (!res.ok) throw new Error(`AT ${res.status}`);
      return { channel: "sms:at", ok: true } as ChannelResult;
    }).catch((e) => ({ channel: "sms:at", ok: false, detail: String(e) }) as ChannelResult);
    if (r.ok) return r;
  }

  // Twilio fallback — one request per recipient; ok if at least one sends.
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const tok = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (sid && tok && from) {
    const sent = await Promise.all(
      recipients.map((to) =>
        withRetry(async () => {
          const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
            method: "POST",
            headers: {
              Authorization: "Basic " + Buffer.from(`${sid}:${tok}`).toString("base64"),
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({ To: to, From: from, Body: msg }),
          });
          if (!res.ok) throw new Error(`Twilio ${res.status}`);
          return true;
        }).catch(() => false),
      ),
    );
    if (sent.some(Boolean)) return { channel: "sms:twilio", ok: true };
  }

  return { channel: "sms", ok: false, detail: "no SMS transport configured" };
}

// --- Channel 3: Webhook (Kai reminder / Slack / anything) ------------------
async function postWebhook(a: EmergencyAlert): Promise<ChannelResult> {
  const url = process.env.EMERGENCY_ALERT_WEBHOOK_URL;
  if (!url) return { channel: "webhook", ok: false, detail: "unconfigured" };
  return withRetry(async () => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "sabi_safeguarding_critical",
        title: alertTitle(a),
        text: alertBody(a),
        category: a.category,
        risk_level: a.riskLevel,
        student_id: a.studentId,
        call_id: a.callId,
      }),
    });
    if (!res.ok) throw new Error(`webhook ${res.status}`);
    return { channel: "webhook", ok: true } as ChannelResult;
  }).catch((e) => ({ channel: "webhook", ok: false, detail: String(e) }) as ChannelResult);
}

/**
 * Fire all channels in parallel. Never throws. Returns per-channel results.
 * The durable record (Supabase row + console.error) is written by the caller
 * BEFORE this runs, so the alert is never lost even if all pushes fail.
 */
export async function dispatchEmergencyAlert(a: EmergencyAlert): Promise<ChannelResult[]> {
  const results = await Promise.all([
    googleCalendarEvent(a),
    sendSms(a),
    postWebhook(a),
  ]);
  const ok = results.filter((r) => r.ok).map((r) => r.channel);
  const failed = results.filter((r) => !r.ok);
  if (ok.length === 0) {
    console.error(
      `[EMERGENCY-ALERT] ⚠️ ALL PUSH CHANNELS FAILED for ${a.category} — incident is still durable in Supabase + logs. ` +
        `Configure EMERGENCY_ALERT_PHONE / GOOGLE_OAUTH_* / EMERGENCY_ALERT_WEBHOOK_URL. ` +
        `Failures: ${failed.map((f) => `${f.channel}:${f.detail}`).join("; ")}`,
    );
  } else {
    console.error(`[EMERGENCY-ALERT] delivered via [${ok.join(", ")}] for ${a.category}`);
  }
  return results;
}
