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
