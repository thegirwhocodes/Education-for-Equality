/**
 * Put currency amounts BEFORE "naira" so TTS reads naturally ("thirty naira")
 * instead of "naira thirty" (from `₦30` → naive `naira 30`).
 */

const NAIRA_then_DIGITS = /\bnaira\s+(\d[\d,]*(?:\.\d+)?)\b/gi;

/** e.g. naira forty → forty naira; naira forty-five → forty-five naira */
const NAIRA_then_TENS_COMPOUND =
  /\bnaira\s+((?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)(?:-(?:one|two|three|four|five|six|seven|eight|nine))?)\b/gi;

const NAIRA_then_TEENS = /\bnaira\s+(ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen)\b/gi;

/** single-digit amounts only ("five naira") — not "naira nine hundred" */
const NAIRA_then_SINGLE = /\bnaira\s+(one|two|three|four|five|six|seven|eight|nine)\b(?!\s+hundred)(?!\s+thousand)/gi;

export function normalizeMoneyForSpeech(raw: string): string {
  let s = raw;
  // ₦30, ₦1,500 → "30 naira", "1500 naira"
  s = s.replace(/₦\s*(\d[\d,]*(?:\.\d+)?)\b/g, (_, num: string) => `${num.replace(/,/g, "")} naira`);
  s = s.replace(/₦/g, "naira");

  s = s.replace(NAIRA_then_DIGITS, (_, num: string) => `${num.replace(/,/g, "")} naira`);
  s = s.replace(NAIRA_then_TENS_COMPOUND, (_, amt: string) => `${amt} naira`);
  s = s.replace(NAIRA_then_TEENS, (_, w: string) => `${w} naira`);
  s = s.replace(NAIRA_then_SINGLE, (_, w: string) => `${w} naira`);

  return s.replace(/\s{2,}/g, " ");
}
