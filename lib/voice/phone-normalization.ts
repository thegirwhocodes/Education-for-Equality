export function normalizePhoneNumber(
  raw: string | null | undefined,
  defaultCountryCode = "234"
): string {
  if (!raw) return "unknown";
  const text = String(raw).trim();
  if (!text || /^(unknown|anonymous|restricted)$/i.test(text)) return "unknown";

  const hasPlus = text.startsWith("+");
  const digits = text.replace(/\D/g, "");
  if (!digits) return "unknown";

  if (digits.startsWith("0") && digits.length >= 10) {
    return `+${defaultCountryCode}${digits.slice(1)}`;
  }
  if (digits.startsWith(defaultCountryCode)) {
    return `+${digits}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }
  if (hasPlus) {
    return `+${digits}`;
  }
  return `+${digits}`;
}

export function phoneLookupVariants(raw: string | null | undefined): string[] {
  const normalized = normalizePhoneNumber(raw);
  const variants = [normalized, String(raw || "").trim()].filter(Boolean);

  if (normalized.startsWith("+234")) {
    variants.push(`0${normalized.slice(4)}`);
    variants.push(normalized.slice(1));
  }

  return [...new Set(variants)];
}

const NON_NAME_VALUES = new Set([
  "yes",
  "no",
  "okay",
  "ok",
  "hello",
  "hi",
  "thanks",
  "thank you",
  "sorry",
  "i'm sorry",
  "im sorry",
  "i am sorry",
  "i don't know",
  "i dont know",
  "not available",
  "currently unavailable",
  "unavailable",
  "not reachable",
  "line busy",
  "busy",
  "voicemail",
  "voice mail",
  "mailbox",
  "recording",
  "hang up",
]);

const PHONE_SYSTEM_TRANSCRIPT_RE =
  /\b(not available|currently unavailable|unavailable|not reachable|switched off|line busy|mailbox|voice ?mail|leave (?:a )?message|record (?:your )?message|finished recording|after the tone|try again later|hang up|number you (?:have )?dial(?:ed|led)|press (?:one|1))\b/i;

export function looksLikePhoneSystemTranscript(raw: string | null | undefined): boolean {
  return PHONE_SYSTEM_TRANSCRIPT_RE.test(String(raw || ""));
}

export function normalizeChildNameForIdentity(raw: string | null | undefined): string | null {
  if (!raw) return null;
  if (looksLikePhoneSystemTranscript(raw)) return null;
  const cleaned = String(raw)
    .toLowerCase()
    .replace(/[^a-z0-9' ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^'+|'+$/g, "");
  if (!cleaned) return null;
  if (NON_NAME_VALUES.has(cleaned)) return null;
  return cleaned;
}

export function sanitizeChildNameForStorage(raw: string | null | undefined): string | null {
  const key = normalizeChildNameForIdentity(raw);
  if (!key) return null;
  const cleaned = String(raw || "")
    .replace(/[^A-Za-z' -]+/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[ .,'-]+|[ .,'-]+$/g, "");
  if (!cleaned || cleaned.length > 40) return null;
  const words = cleaned.split(/\s+/);
  if (words.length > 2) return null;
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function learnerKeyFor(normalizedPhone: string, childName: string | null | undefined): string | null {
  const nameKey = normalizeChildNameForIdentity(childName);
  if (!normalizedPhone || normalizedPhone === "unknown" || !nameKey) return null;
  return `${normalizedPhone}::${nameKey}`;
}
