import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { getDefaultFromEmail, getResendClient } from "@/lib/email/resend";

export const runtime = "nodejs";

/**
 * Normalise a Nigerian number to E.164.
 *
 * Volunteers type `0803...`, `234803...`, `+234 803 ...` and every spacing in
 * between. The scheduler dials whatever is stored, so this has to collapse to
 * one canonical form or the same person gets called twice.
 */
export function normalizeNigerianPhone(raw: string): string | null {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed || !/^[+\d\s().-]+$/.test(trimmed)) return null;

  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return null;

  if (digits.startsWith("0") && digits.length === 11) return `+234${digits.slice(1)}`;
  if (digits.startsWith("234") && digits.length === 13) return `+${digits}`;
  if (trimmed.startsWith("+") && digits.length >= 8 && digits.length <= 15) return `+${digits}`;
  return null;
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  if (!name) {
    return NextResponse.json(
      { error: "invalid_name", message: "Please tell us your name." },
      { status: 400 }
    );
  }

  const phone = normalizeNigerianPhone(String(body.phone_number ?? ""));
  if (!phone) {
    return NextResponse.json(
      {
        error: "invalid_phone",
        message: "Please enter your number as 0803 123 4567 or +234 803 123 4567.",
      },
      { status: 400 }
    );
  }

  const rawEmail = String(body.email ?? "").trim();
  if (rawEmail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(rawEmail)) {
    return NextResponse.json(
      { error: "invalid_email", message: "That email address does not look right." },
      { status: 400 }
    );
  }

  const preferredCallTime = String(body.preferred_call_time ?? "").trim();
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(preferredCallTime)) {
    return NextResponse.json(
      {
        error: "invalid_call_time",
        message: "Please choose the time Sabi should call you.",
      },
      { status: 400 }
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error("tester-signup: Supabase env missing; signup not stored", { phone });
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const supabase = createClient(url, serviceKey);
  const { error: storageError } = await supabase.from("sabi_tester_signups").upsert(
    {
      name,
      phone_number: phone,
      email: rawEmail || null,
      notes: `Preferred call time: ${preferredCallTime} Africa/Lagos`,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "phone_number" }
  );

  if (storageError) {
    console.error("tester-signup: insert failed; using email delivery", {
      phone,
      message: storageError.message,
    });
  }

  try {
    const { error: emailError } = await getResendClient().emails.send({
      from: getDefaultFromEmail(),
      to: ["nivie@wesleyan.edu"],
      subject: `New Sabi adult tester: ${name}`,
      text: [
        "A volunteer joined the five-day Sabi adult test.",
        "",
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Preferred call time: ${preferredCallTime} Lagos time`,
        rawEmail ? `Email: ${rawEmail}` : "Email: not provided",
      ].join("\n"),
    });
    if (emailError) throw new Error(emailError.message);
  } catch (emailError) {
    console.error("tester-signup: email delivery failed", {
      phone,
      message: emailError instanceof Error ? emailError.message : String(emailError),
    });
    if (storageError) {
      return NextResponse.json({ error: "save_failed" }, { status: 500 });
    }
  }

  return NextResponse.json({
    ok: true,
    phone_number: phone,
    stored: !storageError,
  });
}
