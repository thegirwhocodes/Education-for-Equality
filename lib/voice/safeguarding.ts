/**
 * Sabi safeguarding — the async "no real-time human" escalation path + PII redaction.
 *
 * When guardInput() flags a CRITICAL disclosure (abuse / self-harm / emergency) or a
 * grooming signal, the child-facing response is immediate (handled in guardrails.ts);
 * THIS module writes the incident to a restricted, audit-logged queue that a named
 * human safeguarding focal point reviews on a defined SLA (see the Child Protection
 * Policy in `7. Legal & IP/`). The model call never blocks on this write.
 *
 * Table: `safeguarding_incidents` (migration: supabase-safeguarding.sql). RLS denies
 * all anon/authenticated access; only the service role (this server) and the focal
 * point's restricted view may read it.
 */

import { createClient } from "@supabase/supabase-js";
import { redactPII } from "./pii";

export interface SafeguardingIncident {
  studentId: string | null;
  category: string; // GuardCategory, e.g. "abuse_disclosure"
  riskLevel: 0 | 1 | 2 | 3;
  reason: string;
  utterance: string; // the child's words (the disclosure) — stored lightly redacted
  channel?: string; // e.g. "at" | "twilio" | "web"
  callId?: string | null;
}

function serviceClient() {
  // Mirrors lib/voice/call-state.ts. Returns null (not throws) if unconfigured,
  // so a missing env var can never break a child-facing voice turn.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

/**
 * Fire-and-forget: write a CRITICAL safeguarding incident. Never throws; on any
 * failure it logs loudly (a dropped child-safety flag must be visible in logs).
 * Callers should NOT await this on the latency path: `void raiseSafeguardingIncident(...)`.
 */
export async function raiseSafeguardingIncident(
  incident: SafeguardingIncident,
): Promise<void> {
  // Keep the disclosure meaning, but strip incidental contact PII the child may
  // have blurted (phone/email) so the queue isn't a PII honeypot.
  const safeUtterance = redactPII(incident.utterance).slice(0, 1000);

  // Always log — this is the backstop if the DB write fails.
  console.error(
    `[SAFEGUARDING:${incident.riskLevel === 3 ? "CRITICAL" : "REVIEW"}] ` +
      `category=${incident.category} reason=${incident.reason} ` +
      `student=${incident.studentId ?? "unknown"} channel=${incident.channel ?? "?"}`,
  );

  const client = serviceClient();
  if (!client) {
    console.error(
      "[SAFEGUARDING] Supabase not configured — incident logged to console only.",
    );
    return;
  }

  try {
    const { error } = await client.from("safeguarding_incidents").insert({
      student_id: incident.studentId,
      category: incident.category,
      risk_level: incident.riskLevel,
      reason: incident.reason,
      utterance_redacted: safeUtterance,
      channel: incident.channel ?? null,
      call_id: incident.callId ?? null,
      status: "open",
    });
    if (error) {
      console.error("[SAFEGUARDING] insert failed:", error.message, "— incident is in logs above.");
    }
  } catch (e) {
    console.error("[SAFEGUARDING] insert threw:", e instanceof Error ? e.message : e);
  }
}
