type Message = { role: string; content: string };

const SMALL_NUMBERS: Record<string, number> = {
  zero: 0,
  oh: 0,
  one: 1,
  wan: 1,
  two: 2,
  tu: 2,
  three: 3,
  tree: 3,
  tri: 3,
  four: 4,
  fo: 4,
  five: 5,
  fife: 5,
  fi: 5,
  six: 6,
  sick: 6,
  sik: 6,
  seven: 7,
  sevin: 7,
  eight: 8,
  ait: 8,
  nine: 9,
  nain: 9,
  ten: 10,
  tin: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
};

const TENS: Record<string, number> = {
  twenty: 20,
  twenti: 20,
  tweny: 20,
  thirty: 30,
  tirty: 30,
  forty: 40,
  foty: 40,
  fifty: 50,
  fifti: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
};

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[₦]/g, " ")
    .replace(/[-/]/g, " ")
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function extractNumbers(text: string): number[] {
  const numbers: number[] = [];
  const tokens = tokenize(text);
  let current = 0;
  let inNumber = false;

  const flush = () => {
    if (inNumber) numbers.push(current);
    current = 0;
    inNumber = false;
  };

  for (const token of tokens) {
    if (/^\d+(?:,\d{3})*$/.test(token)) {
      flush();
      numbers.push(Number(token.replace(/,/g, "")));
      continue;
    }
    if (Object.prototype.hasOwnProperty.call(SMALL_NUMBERS, token)) {
      current += SMALL_NUMBERS[token];
      inNumber = true;
      continue;
    }
    if (Object.prototype.hasOwnProperty.call(TENS, token)) {
      current += TENS[token];
      inNumber = true;
      continue;
    }
    if (token === "hundred") {
      current = (current || 1) * 100;
      inNumber = true;
      continue;
    }
    if (token === "thousand") {
      current = (current || 1) * 1000;
      inNumber = true;
      continue;
    }
    if (token === "and" && inNumber) continue;
    flush();
  }
  flush();

  return numbers.filter((value) => Number.isFinite(value));
}

function inferExpectedNumber(question: string): number | null {
  const lower = question.toLowerCase();
  const numbers = extractNumbers(question);
  if (!numbers.length) return null;

  const after = lower.match(/\bafter\s+(\d+|[a-z -]+)\b/i);
  if (after) {
    const parsed = extractNumbers(after[1]);
    if (parsed.length) return parsed[0] + 1;
  }

  const before = lower.match(/\bbefore\s+(\d+|[a-z -]+)\b/i);
  if (before) {
    const parsed = extractNumbers(before[1]);
    if (parsed.length) return parsed[0] - 1;
  }

  if (/\b(change|left|remain|remaining)\b/.test(lower)) {
    if (numbers.length === 2) return Math.abs(numbers[1] - numbers[0]);
    const max = Math.max(...numbers);
    const others = [...numbers];
    others.splice(others.indexOf(max), 1);
    return max - others.reduce((sum, value) => sum + value, 0);
  }

  if (/\b(altogether|total|together|plus|add|more|in all)\b/.test(lower)) {
    return numbers.reduce((sum, value) => sum + value, 0);
  }

  if (/\b(share|shared|equally|divide|divided)\b/.test(lower) && numbers.length >= 2) {
    const quotient = numbers[0] / numbers[1];
    return Number.isInteger(quotient) ? quotient : null;
  }

  if (
    /\b(times|multiply|each|every)\b/.test(lower) ||
    /\bbuy\b/.test(lower) ||
    /\bbought\b/.test(lower) ||
    /\bpurchase\b/.test(lower)
  ) {
    if (numbers.length >= 2) {
      const factors = numbers.slice(-2);
      return factors[0] * factors[1];
    }
  }

  return null;
}

export function buildNumericGradingHint(messages: Message[]): string {
  const lastUser = [...messages].reverse().find((message) => message.role === "user");
  if (!lastUser) return "";

  const lastAssistant = [...messages]
    .slice(0, messages.lastIndexOf(lastUser))
    .reverse()
    .find((message) => message.role === "assistant");
  if (!lastAssistant) return "";

  const expected = inferExpectedNumber(lastAssistant.content);
  if (expected === null) return "";

  const childNumbers = extractNumbers(lastUser.content);
  if (!childNumbers.includes(expected)) return "";

  return `

## LATEST NUMERIC ANSWER CHECK
For the latest Sabi question, a deterministic math check gives ${expected} as the expected answer.
The child's latest answer includes ${expected}. Treat that answer as correct, acknowledge it, and move on. Do not say it is wrong or almost.`;
}
