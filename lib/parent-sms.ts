/**
 * Parent / caregiver texting helper for the Sabi pre-pilot.
 *
 * Pure logic only (no I/O) so it can be unit-tested: message templates,
 * personalization, SMS segment counting, and caregiver status derivation.
 * The API route (app/api/sabi/parents/route.ts) does the Supabase + send work.
 *
 * Voice: warm, plain, Nigerian-friendly. Aligned with the signed consent form
 * (Sabi calls the child back; never asks for money/passwords; call windows).
 */

export const SABI_LINE = process.env.NEXT_PUBLIC_SABI_LINE || "+234 201 700 1459";

export type CaregiverMessageStatus =
  | "not_contacted"
  | "sent"
  | "replied"
  | "follow_up_due";

export type ParentTemplateId =
  | "welcome"
  | "reminder"
  | "missed_call"
  | "feedback"
  | "reschedule"
  | "custom";

export interface CaregiverContext {
  childName: string;
  caregiverName?: string;
  callWindow?: string;
  sabiLine?: string;
}

export interface ParentTemplate {
  id: ParentTemplateId;
  label: string;
  description: string;
  smsType: string;
  build: (ctx: CaregiverContext) => string;
}

function firstName(name?: string): string {
  const cleaned = String(name || "").trim();
  if (!cleaned) return "";
  return cleaned.split(/\s+/)[0];
}

function child(ctx: CaregiverContext): string {
  return firstName(ctx.childName) || "your child";
}

function line(ctx: CaregiverContext): string {
  return ctx.sabiLine || SABI_LINE;
}

function windowPhrase(ctx: CaregiverContext): string {
  const w = String(ctx.callWindow || "").trim();
  return w ? ` during your chosen time (${w})` : "";
}

/**
 * Templates. Each returns a single SMS body (kept short — most sit in 1-2
 * segments). Personalized with the child's first name and call window.
 */
export const PARENT_TEMPLATES: ParentTemplate[] = [
  {
    id: "welcome",
    label: "Welcome & how it works",
    description: "Introduce Sabi and how the free lesson call works.",
    smsType: "caregiver_welcome",
    build: (ctx) =>
      `Hello${ctx.caregiverName ? ` ${firstName(ctx.caregiverName)}` : ""}, this is the Education for Equality team. ` +
      `${child(ctx)} can now learn reading and maths with Sabi, our free phone tutor. ` +
      `Just flash ${line(ctx)}${windowPhrase(ctx)} and Sabi will call back for a short lesson. ` +
      `The call is free. Sabi will never ask for money or personal details.`,
  },
  {
    id: "reminder",
    label: "Lesson reminder",
    description: "Nudge for today's lesson call.",
    smsType: "caregiver_reminder",
    build: (ctx) =>
      `Hi${ctx.caregiverName ? ` ${firstName(ctx.caregiverName)}` : ""}! It is time for ${child(ctx)}'s Sabi lesson today. ` +
      `Please flash ${line(ctx)}${windowPhrase(ctx)} and Sabi will call back. It only takes about 10 minutes.`,
  },
  {
    id: "missed_call",
    label: "Missed-call follow-up",
    description: "Gentle nudge when a child missed their window.",
    smsType: "caregiver_missed_call",
    build: (ctx) =>
      `Hello, we missed ${child(ctx)} for today's Sabi lesson. No problem at all. ` +
      `Whenever you are ready, flash ${line(ctx)} and Sabi will call back. We are cheering ${child(ctx)} on!`,
  },
  {
    id: "feedback",
    label: "Ask for feedback",
    description: "Ask how the calls are going.",
    smsType: "caregiver_feedback",
    build: (ctx) =>
      `Hi${ctx.caregiverName ? ` ${firstName(ctx.caregiverName)}` : ""}, thank you for letting ${child(ctx)} learn with Sabi. ` +
      `How are the calls going? Please reply to this message with anything that felt good, confusing, or broken. ` +
      `Your feedback helps us make Sabi better.`,
  },
  {
    id: "reschedule",
    label: "Reschedule the call window",
    description: "Offer to change the daily call time.",
    smsType: "caregiver_reschedule",
    build: (ctx) =>
      `Hello, we want ${child(ctx)}'s Sabi lessons to fit your day. ` +
      `If${ctx.callWindow ? ` ${ctx.callWindow}` : " the current time"} is not convenient, reply with a better time and we will adjust.`,
  },
  {
    id: "custom",
    label: "Write your own",
    description: "Blank message you write yourself.",
    smsType: "caregiver_custom",
    build: () => "",
  },
];

export function templateById(id: string): ParentTemplate | undefined {
  return PARENT_TEMPLATES.find((t) => t.id === id);
}

export function buildMessage(id: string, ctx: CaregiverContext): string {
  const template = templateById(id);
  return template ? template.build(ctx) : "";
}

/**
 * GSM-7 SMS segment counting (good enough for board planning). Messages with
 * non-GSM characters use UCS-2 (70/67 per segment); plain text uses 160/153.
 */
export function smsSegments(message: string): { chars: number; segments: number; encoding: "GSM-7" | "UCS-2" } {
  const text = String(message || "");
  const chars = [...text].length;
  const gsmExtended = "^{}\\[~]|€";
  const gsmBasic =
    "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà";
  let isGsm = true;
  for (const ch of text) {
    if (!gsmBasic.includes(ch) && !gsmExtended.includes(ch)) {
      isGsm = false;
      break;
    }
  }
  if (isGsm) {
    const single = 160;
    const multi = 153;
    const segments = chars === 0 ? 0 : chars <= single ? 1 : Math.ceil(chars / multi);
    return { chars, segments, encoding: "GSM-7" };
  }
  const single = 70;
  const multi = 67;
  const segments = chars === 0 ? 0 : chars <= single ? 1 : Math.ceil(chars / multi);
  return { chars, segments, encoding: "UCS-2" };
}

/**
 * Derive a caregiver's contact status from their outbound/inbound SMS history.
 * `follow_up_due` = we sent a message more than `followUpAfterHours` ago and
 * they have not replied since.
 */
export function deriveCaregiverStatus(
  lastOutboundAt: string | null | undefined,
  lastInboundAt: string | null | undefined,
  now: number = Date.now(),
  followUpAfterHours = 72,
): CaregiverMessageStatus {
  const out = lastOutboundAt ? new Date(lastOutboundAt).getTime() : 0;
  const inn = lastInboundAt ? new Date(lastInboundAt).getTime() : 0;
  if (!out && !inn) return "not_contacted";
  if (inn && inn >= out) return "replied";
  if (out && now - out > followUpAfterHours * 3600 * 1000) return "follow_up_due";
  return "sent";
}

export const CAREGIVER_STATUS_LABELS: Record<CaregiverMessageStatus, string> = {
  not_contacted: "Not contacted",
  sent: "Message sent",
  replied: "They replied",
  follow_up_due: "Follow-up due",
};
