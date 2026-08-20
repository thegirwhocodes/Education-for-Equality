/**
 * What a caregiver or tester meant by the message they just sent.
 *
 * Shared by the SMS webhook and the WhatsApp webhook so the two channels can
 * never drift into understanding "CALL" differently.
 */

export type InboundIntent = "reply" | "help" | "opt_in" | "opt_out" | "call_request";

export function classifyInbound(text: string): InboundIntent {
  const normalized = text.trim().toUpperCase();
  if (/^(STOP|UNSUBSCRIBE|CANCEL|END|QUIT)\b/.test(normalized)) return "opt_out";
  if (/^(START|YES|Y)\b/.test(normalized)) return "opt_in";
  // Checked before HELP so "CALL ME" never falls through to the info blurb.
  if (/^(CALL\s*ME|CALL|CALLME|RING\s*ME|RING|LESSON|TEACH\s*ME|TEACH)\b/.test(normalized)) {
    return "call_request";
  }
  if (/^(HELP|INFO)\b/.test(normalized)) return "help";
  return "reply";
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Remove a shared-shortcode keyword prefix.
 *
 * On a shared Africa's Talking shortcode every message arrives prefixed with the
 * account's keyword ("SABI CALL"), and without stripping it the command is never
 * recognised. Falls back to the configured keyword being absent, which is the
 * dedicated-shortcode and WhatsApp case.
 */
export function stripKeyword(text: string, keyword?: string): string {
  const prefix = String(keyword ?? process.env.SABI_SMS_KEYWORD ?? "").trim();
  if (!prefix) return text.trim();

  const stripped = text
    .trim()
    .replace(new RegExp(`^${escapeRegExp(prefix)}(?:\\b|[\\s:;,.\\-]+)`, "i"), "")
    .trim();

  return stripped || "HELP";
}
