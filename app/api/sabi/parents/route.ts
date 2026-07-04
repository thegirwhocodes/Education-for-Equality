import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import {
  buildMessage,
  deriveCaregiverStatus,
  SABI_LINE,
  type CaregiverContext,
} from "@/lib/parent-sms";
import { sendSMSResult, smsProviderStatus } from "@/lib/voice/sms";

export const runtime = "nodejs";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, { status });
}

function normalizePhone(phone: string) {
  return (phone || "").replace(/[^\d+]/g, "");
}

function phoneKey(phone: string) {
  const digits = (phone || "").replace(/\D/g, "");
  return digits.slice(-10);
}

type CaregiverRow = {
  id: string;
  student_id: string | null;
  child_code: string;
  display_name: string;
  phone_number: string;
  caregiver_name: string | null;
  caregiver_phone: string | null;
  network: string | null;
  preferred_call_window: string | null;
  consent_status: string | null;
};

type SmsLogRow = {
  phone_number: string;
  direction: string;
  message: string;
  sms_type: string | null;
  channel: string | null;
  created_at: string;
};

/**
 * GET /api/sabi/parents
 * Returns the caregiver roster (from pre-pilot participants), each merged with
 * their SMS history and derived contact status, plus provider readiness.
 */
export async function GET() {
  const provider = smsProviderStatus();
  let participants: CaregiverRow[] = [];
  let smsLog: SmsLogRow[] = [];
  let setupNeeded = false;

  try {
    const supabase = getSupabase();
    const participantsResult = await supabase
      .from("sabi_prepilot_participants")
      .select(
        "id, student_id, child_code, display_name, phone_number, caregiver_name, caregiver_phone, network, preferred_call_window, consent_status",
      )
      .order("created_at", { ascending: true });
    if (participantsResult.error) {
      // Table not migrated yet — surface a helpful setup state instead of 500.
      setupNeeded = true;
    } else {
      participants = (participantsResult.data as CaregiverRow[]) || [];
    }

    const logResult = await supabase
      .from("sabi_sms_log")
      .select("phone_number, direction, message, sms_type, channel, created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (!logResult.error) {
      smsLog = (logResult.data as SmsLogRow[]) || [];
    }
  } catch {
    setupNeeded = true;
  }

  const historyByPhone = new Map<string, SmsLogRow[]>();
  for (const row of smsLog) {
    const key = phoneKey(row.phone_number);
    if (!key) continue;
    if (!historyByPhone.has(key)) historyByPhone.set(key, []);
    historyByPhone.get(key)!.push(row);
  }

  const caregivers = participants
    .filter((p) => p.caregiver_phone || p.phone_number)
    .map((p) => {
      const contactPhone = normalizePhone(p.caregiver_phone || p.phone_number);
      const history = historyByPhone.get(phoneKey(contactPhone)) || [];
      const lastOutbound = history.find((h) => h.direction === "outbound") || null;
      const lastInbound = history.find((h) => h.direction === "inbound") || null;
      return {
        id: p.id,
        studentId: p.student_id,
        childCode: p.child_code,
        childName: p.display_name || p.child_code,
        caregiverName: p.caregiver_name,
        caregiverPhone: contactPhone,
        network: p.network,
        callWindow: p.preferred_call_window,
        consentStatus: p.consent_status,
        status: deriveCaregiverStatus(lastOutbound?.created_at, lastInbound?.created_at),
        lastOutboundAt: lastOutbound?.created_at || null,
        lastInboundAt: lastInbound?.created_at || null,
        history: history.slice(0, 12).map((h) => ({
          direction: h.direction,
          message: h.message,
          smsType: h.sms_type,
          channel: h.channel,
          createdAt: h.created_at,
        })),
      };
    });

  return jsonResponse({
    provider,
    sabiLine: SABI_LINE,
    setupNeeded,
    caregivers,
  });
}

type SendBody = {
  action?: "preview" | "send";
  caregiverId?: string;
  to?: string;
  templateId?: string;
  message?: string;
  studentId?: string | null;
  confirmSend?: boolean;
  context?: CaregiverContext;
};

/**
 * POST /api/sabi/parents
 * action "preview" returns the built message text; action "send" delivers it
 * (requires confirmSend=true, mirroring the advisor-board send gate).
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as SendBody;
  const action = body.action || "preview";

  if (action === "preview") {
    const message =
      body.message && body.message.trim().length
        ? body.message
        : buildMessage(body.templateId || "custom", body.context || { childName: "your child" });
    return jsonResponse({ message });
  }

  if (action === "send") {
    const to = normalizePhone(body.to || "");
    const message = String(body.message || "").trim();
    if (!to || !message) {
      return jsonResponse({ error: "A recipient phone number and a message are both required." }, 400);
    }
    if (!body.confirmSend) {
      return jsonResponse({ error: "Sending a real SMS requires confirmSend=true." }, 400);
    }
    const result = await sendSMSResult(to, message, {
      smsType: body.templateId ? `caregiver_${body.templateId}` : "caregiver_custom",
      studentId: body.studentId ?? null,
    });
    if (!result.ok) {
      return jsonResponse({ ok: false, error: result.error || "SMS send failed." }, 502);
    }
    return jsonResponse({ ok: true, provider: result.provider, live: result.live, to });
  }

  return jsonResponse({ error: "Unknown action." }, 400);
}
