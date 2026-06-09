/**
 * Nigerian-English numeral mishear normalizer for Whisper STT output.
 *
 * PROBLEM: Groq Whisper mis-transcribes Nigerian children's spoken numbers
 * ("three" -> "tree", "seven" -> "heaven", "four" -> "for/fo"). The raw
 * transcript is then sent to the LLM, which judges the math answer directly,
 * so a mishear corrupts the lesson.
 *
 * APPROACH: a small, CONTEXT-GATED cleanup pass that runs on the transcript
 * BEFORE it is appended to the conversation and sent to the LLM. It only
 * rewrites a token to its intended number-word when the token sits in a
 * numeric context, so legitimate words ("I want to count", "for me") are
 * never touched. Ported/adapted from sabi-server/answer_matcher.py.
 */

// Canonical number words Whisper gets right — used as "numeric context" anchors.
const REAL_NUMBER_WORDS = new Set<string>([
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight",
  "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
  "sixteen", "seventeen", "eighteen", "nineteen", "twenty", "thirty",
  "forty", "fifty", "sixty", "seventy", "eighty", "ninety", "hundred",
  "thousand",
]);

// Tokens that signal a math/number context (besides actual numbers).
const NUMERIC_CONTEXT_WORDS = new Set<string>([
  "naira", "kobo", "plus", "minus", "add", "added", "take", "times",
  "equals", "equal", "is", "make", "makes", "left", "change", "altogether",
  "total", "and",
]);

// SAFE mishears: NOT valid English words, so substituting can't corrupt a
// legitimate sentence. Replaced unconditionally.
const UNCONDITIONAL_MISHEARS: Record<string, string> = {
  wan: "one", tu: "two", tri: "three", fo: "four", fife: "five", fi: "five",
  sik: "six", sevin: "seven", ait: "eight", nain: "nine", elevin: "eleven",
  twelf: "twelve", tirteen: "thirteen", forteen: "fourteen", fiftin: "fifteen",
  sixtin: "sixteen", seventin: "seventeen", eightin: "eighteen", nintin: "nineteen",
  twenti: "twenty", tweny: "twenty", tirty: "thirty", foty: "forty", fifti: "fifty",
};

// AMBIGUOUS mishears: each is ALSO a real English word. Only substitute in a
// numeric context.
const CONDITIONAL_MISHEARS: Record<string, string> = {
  tree: "three", for: "four", to: "two", too: "two", heaven: "seven",
  ate: "eight", sick: "six", won: "one", tin: "ten", oh: "zero",
};

const PUNCT = /[^\w\s]/g;

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(PUNCT, " ").split(/\s+/).filter(Boolean);
}

function isNumberLike(tok: string): boolean {
  if (/^\d+$/.test(tok)) return true;
  return REAL_NUMBER_WORDS.has(tok);
}

function isNumericContext(tokens: string[], i: number, total: number): boolean {
  if (total <= 3) return true;
  for (const neighbor of [tokens[i - 1], tokens[i + 1]]) {
    if (!neighbor) continue;
    if (isNumberLike(neighbor)) return true;
    if (NUMERIC_CONTEXT_WORDS.has(neighbor)) return true;
  }
  return false;
}

export interface NormalizeResult {
  text: string;
  changed: boolean;
  substitutions: Array<[string, string]>;
}

/**
 * Normalize likely Nigerian-numeral mishears in an STT transcript.
 * Conservative: rewrites ambiguous homophones only in numeric contexts;
 * non-word mishears unconditionally. Returns the original string untouched
 * if nothing matched.
 */
export function normalizeNumberMishears(raw: string): NormalizeResult {
  if (!raw || !raw.trim()) {
    return { text: raw, changed: false, substitutions: [] };
  }

  const lowerTokens = tokenize(raw);
  const total = lowerTokens.length;
  const subs: Array<[string, string]> = [];

  const out = lowerTokens.map((tok, i) => {
    if (Object.prototype.hasOwnProperty.call(UNCONDITIONAL_MISHEARS, tok)) {
      const rep = UNCONDITIONAL_MISHEARS[tok];
      if (rep !== tok) subs.push([tok, rep]);
      return rep;
    }
    if (Object.prototype.hasOwnProperty.call(CONDITIONAL_MISHEARS, tok)) {
      if (tok === "oh") {
        const prev = lowerTokens[i - 1];
        const next = lowerTokens[i + 1];
        const adjNumber = (prev && isNumberLike(prev)) || (next && isNumberLike(next));
        if (adjNumber) {
          subs.push([tok, CONDITIONAL_MISHEARS[tok]]);
          return CONDITIONAL_MISHEARS[tok];
        }
        return tok;
      }
      if (isNumericContext(lowerTokens, i, total)) {
        subs.push([tok, CONDITIONAL_MISHEARS[tok]]);
        return CONDITIONAL_MISHEARS[tok];
      }
    }
    return tok;
  });

  const text = out.join(" ");
  return {
    text: subs.length ? text : raw,
    changed: subs.length > 0,
    substitutions: subs,
  };
}
