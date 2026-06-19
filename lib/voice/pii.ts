/**
 * PII redaction for child data.
 *
 * Applied before any child utterance is written to logs, transcripts, or the
 * safeguarding queue. Masks the high-risk identifiers a child might say on a
 * call: phone numbers, emails, and explicit "address/number" disclosures.
 *
 * NOTE: this is defence-in-depth, NOT a substitute for the policy decisions —
 * don't store raw audio; only data with separate guardian TRAINING consent
 * enters the training corpus (see the Data Retention & Child Privacy Policy).
 */

const PATTERNS: Array<[RegExp, string]> = [
  // Emails
  [/\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/gi, "[email]"],
  // Nigerian + international phone numbers (e.g. +234 801 234 5678, 08012345678)
  [/\b(?:\+?234|0)[\s-]?\d{3}[\s-]?\d{3}[\s-]?\d{3,4}\b/g, "[phone]"],
  // Any other long run of digits (>=7) that could be a number/ID
  [/\b\d[\d\s-]{6,}\d\b/g, "[number]"],
  // "my (home) address is …" up to end of clause
  [/\b(my (?:home |house )?address is|i live (?:at|on)|my house is (?:at|on|number))\b[^.?!,;\n]{0,60}/gi, "[address]"],
  // social handles
  [/\B@[a-z0-9_]{2,}\b/gi, "[handle]"],
];

export function redactPII(text: string): string {
  if (!text) return text;
  let out = text;
  for (const [re, repl] of PATTERNS) out = out.replace(re, repl);
  return out;
}

/** True if the text appears to contain contact PII (for "do not store" decisions). */
export function containsPII(text: string): boolean {
  return redactPII(text) !== text;
}
