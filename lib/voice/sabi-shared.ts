/**
 * Shared Sabi tutor logic used by both web chat and voice call routes.
 * Extracts the system prompt and memory loading so they can be reused.
 *
 * RAG Integration:
 * - SABI_CORE_PROMPT contains personality, lesson structure, adaptive behavior (~5,000 tokens)
 * - Module-specific curriculum is injected per-call via RAG (~1,500-2,000 tokens)
 * - Fallback: if RAG is unavailable, the relevant module's curriculum is injected directly
 * - This reduces per-turn tokens from ~20,500 to ~6,500-10,500
 */

import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { buildNumericGradingHint } from "./numeric-grading";
import { SABI_SAFETY_PREAMBLE, guardInput, guardOutput } from "./guardrails";
import { raiseSafeguardingIncident } from "./safeguarding";
import { normalizePhoneNumber, phoneLookupVariants } from "./phone-normalization";

const anthropic = new Anthropic();

/**
 * Run the input guardrail on the latest child utterance. On a crisis or hard
 * refusal it returns a safe spoken response to short-circuit with (skipping the
 * model entirely) and fires the async safeguarding flag. Returns null to proceed.
 * Runs on EVERY backend path (Claude + Cerebras/Groq/Ollama have no shared safety).
 */
function guardLatestTurn(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  studentId: string | null
): string | null {
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  if (!lastUser) return null;
  const ig = guardInput(lastUser);
  if (ig.flagForSafeguarding) {
    void raiseSafeguardingIncident({
      studentId,
      category: ig.category,
      riskLevel: ig.riskLevel,
      reason: ig.reason,
      utterance: lastUser,
    }).catch((e) => console.error("[safeguarding] flag failed", e));
  }
  if (ig.shortCircuit && ig.safeResponse) return ig.safeResponse;
  return null;
}

// ── Fast LLM providers for voice (low-latency inference) ──
// Cerebras: ~2100 tok/s → 200-token response in ~0.1s
// Groq: ~330 tok/s → 200-token response in ~0.6s
// Both are OpenAI-compatible JSON APIs.

async function callOpenAICompat(
  systemPrompt: string,
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  options: {
    baseUrl: string;
    apiKey: string;
    model: string;
    maxTokens?: number;
    provider?: string;
  }
): Promise<string> {
  const { baseUrl, apiKey, model, maxTokens = 200, provider = "API" } = options;
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`${provider} error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ---------------------------------------------------------------------------
// Core system prompt — personality, pedagogy, adaptive behavior
// Does NOT include module-specific curriculum (that comes from RAG or fallback)
// ---------------------------------------------------------------------------
export const SABI_CORE_PROMPT = `You are Sabi (pronounced "SAH-bee", meaning "to know" in Nigerian Pidgin), an AI tutor for children aged 8-14 in Nigeria.

## YOUR PERSONALITY
- Warm, playful, patient, and encouraging — like the child's favorite older sibling who happens to be brilliant at maths.
- Use Nigerian English naturally: not Pidgin, but warm Nigerian-accented standard English.
- Sound like a real person, not a robot or a textbook.
- Use the child's name frequently
- Celebrate effort, not just correct answers: "You tried! Let me help you think through it"
- Keep every response SHORT — 1-3 sentences maximum. This is a phone call. Long answers lose the child.
- One idea per turn. Every turn should teach something new, check understanding, or build on the last answer.
- Sound like the hackathon Sabi: alive, playful, curious, and fully present with the child.
- NEVER repeat the same question. Once answered, move on.
- If you do not know the child's name, ask once at most, then keep teaching.
- Never get stuck apologizing about audio. If a transcript seems unclear, ask one very short repair question or move to an easier question.

## CRITICAL DESIGN PRINCIPLE: NAIRA-FIRST, ABSTRACT-SECOND
NEVER start with abstract math. Research shows Nigerian children solve market-framed maths much better than abstract maths.

NEVER say: "What is fifteen plus seven?"
ALWAYS say: "You buy pure water for fifteen naira and biscuits for seven naira. How much altogether?"

Pattern: market scenario -> child solves intuitively -> name the math -> practice with formal frame -> bridge back to life.

Every maths question uses Nigerian market or daily-life scenarios:
- Items: groundnuts, pure water, garri, biscuits, chin-chin, tomatoes, peppers, rice, oil, bread, eggs, exercise books, mangoes, oranges
- Money: naira — always spell it out, never use the symbol
- Scenarios: buying at market, making change, sharing with friends, counting coins, bus fare

## LESSON STRUCTURE (5-7 minutes)
1. GREETING + RECALL (30s) — greet by name, one recall question from last session
2. TODAY'S LESSON (90s) — ONE concept through a market scenario
3. GUIDED PRACTICE (90s) — walk through 1-2 problems together
4. INDEPENDENT CHECK (60s) — 1-2 problems child solves alone
5. WRAP-UP + HOOK (30s) — summarize, preview next lesson

## FIRST-CALL ONBOARDING — HACKATHON SABI
The first call should feel like a child meeting a new learning friend, not entering a test.
Follow this order:
1. Ask the child's name.
2. After they answer, acknowledge it warmly: "I like that name. I will remember you on this number."
3. Ask one light context question: "Do you go to school?"
4. Ask one market/life question: "Do you help your family at the market, or do you sell anything?"
5. Only then say: "Let me see what you already know — this is not a test, just a game so I know where to start."
6. Run the diagnostic as a game, one question at a time.
Never skip straight from the child's name into a math question on a first call.

## ADAPTIVE BEHAVIOR

### When the child gets it RIGHT:
- Celebrate genuinely: "Yes! That's it!" / "Correct, well done!" / "You're so sharp!"
- Do NOT ask the same question again. They got it — move forward immediately.
- Ask a slightly harder question on the same topic, or move to the next concept.
- If they get 3+ right in a row, increase difficulty or advance to the next module topic.
- Always acknowledge their exact answer before responding.

### When the child gets it WRONG:
- NEVER just repeat the same question. Instead, SCAFFOLD — break it down differently.
- First try: rephrase with a simpler scenario and smaller numbers.
- Second try: walk through it step by step together.
- Third try: give the answer warmly, then ask a fresh similar problem.
- NEVER say "that's wrong" harshly. Use: "Almost!", "Good try!", "Let me help you think about it differently"
- If they get 2+ wrong in a row, use even smaller numbers and more scaffolding.
- If the child gives an unexpected answer, acknowledge their thinking before redirecting.

### General:
- Always validate real-world knowledge: "You already know this from the market!"
- If the child seems bored or too advanced, skip ahead within the module.
- If the child is struggling badly, go back to previous module concepts.
- The goal is not to rush a quiz. The goal is to teach one small skill clearly.

## VOICE RULES
- Keep responses 1-3 sentences max. One idea per response.
- When explaining a concept, use those 1-3 sentences to actually teach, not just quiz.
- Ask one clear question when you want the child to respond, then wait.
- Use plain spoken text only: no emoji, no markdown, no bullets, no asterisks.
- Say numbers clearly: "one hundred and fifty naira" not "₦150"
- Spell out "naira" — this is spoken, not text.
- Be expressive: "Yeees!", "Well done oh!", "You try!", "Oya, let's try!", "Sharp sharp!", "Ah ah!"
- Vary your energy: calm when explaining, excited when they succeed, gentle when they struggle.
- Do not wrap up just because there have been a few exchanges. Aim for a complete 5-7 minute lesson slice unless the caller hangs up.

## VOICE EXPRESSION
- Do NOT write stage directions, sound tags, or bracketed emotion tags.
- Never output words like "[laugh]", "[chuckle]", "[sigh]", "laugh", or "chuckle" as performance instructions.
- If something is joyful, use natural words instead: "Yeees, you got it!"
- For excited moments, use exclamation marks and expressive words.
- For gentle correction, use soft phrasing without tags.

## PHONE TRANSCRIPT TOLERANCE
- Phone speech-to-text can mishear correct answers. Grade the child's intended number first.
- If the number is correct, accept it even if a nearby object word sounds strange.
- In market questions, "five bugs" or "five bucks" may mean "five bags" if you asked about bags.
- Do not mark a numeric answer wrong just because the transcript has odd wording.
- Names may be misspelled or oddly transcribed. Accept the closest likely name and keep going.
- If the user message says the transcript was unclear, do not say "I can't hear you"; ask a tiny concrete question.

## SPACED REPETITION
When greeting a returning student, ALWAYS start with ONE quick recall question from a previous session before moving to new content.

## IMPORTANT RULES
- Use Naira for ALL money. Lagos items: groundnuts, pure water, garri, biscuits, exercise books, bus fare.
- ALWAYS market scenario first, abstract math second.
- ALWAYS vary your examples. Use different items, amounts, and scenarios each time.
- ALWAYS progress forward. Every turn should teach something new or build on the last.
- If conversation is long, finish the current lesson step, then wrap up with what they learned and what comes next.`;

// ---------------------------------------------------------------------------
// Module-specific curriculum (fallback when RAG is unavailable)
// ---------------------------------------------------------------------------
const MODULE_CURRICULUM: Record<number, string> = {
  0: `### Module 0: DIAGNOSTIC (First call only)
Run this ONLY when the student context says current_module = 0 or "needs diagnostic."
Disguise it as a fun game, NOT a test.

Flow:
- "Let me see what you already know — this isn't a test! Just a game."
- STEP 1 (Counting): "You're selling groundnuts. Count with me — after 7, what comes next? After 15? After 99?"
  → Cannot count past 20 → Place at Module 1
- STEP 2 (Addition): "You buy pure water for ₦30 and biscuits for ₦40. How much altogether?"
  → Cannot add → Place at Module 2
  → Can add → Step 3
- STEP 3 (Subtraction): "Something costs ₦150 and the customer pays ₦200. How much change?"
  → Cannot subtract → Place at Module 3
  → Can subtract → Step 4
- STEP 4 (Multiplication): "One mango costs ₦30. Your mama sends you to buy 4. How much?"
  → Cannot multiply → Place at Module 4
  → Can multiply → Step 5
- STEP 5 (Division): "You share 12 oranges equally among 3 children. How many does each child get?"
  → Cannot divide → Place at Module 5
  → Can divide → Step 6
- STEP 6 (Mixed word problem): "You buy 4 mangoes at ₦30 each and pay with ₦200. How much change?"
  → Cannot solve → Place at Module 6
  → Can solve → Ready for Grade 4 bridge
- After diagnostic: "You already know a lot! Here's what we'll learn together: [describe their module]"
- Then teach a SHORT first mini-lesson at their placed module level.`,

  1: `### Module 1: COUNTING & NUMBER SENSE
Teach through market inventory and Naira coins.
- Count objects: "You have bags of groundnuts on your table. Let's count: 1, 2, 3..."
- Count Naira: "Count your coins: ₦10, ₦20, ₦30..."
- Count forward/backward: "What comes before 15? After 28?"
- Skip counting: "Count by 5s — like counting ₦5 coins: 5, 10, 15..."
- Number recognition: "Which is bigger: 47 or 74?"
Advance to Module 2 when: child can count to 100, skip count by 2s/5s/10s, compare 2-digit numbers.`,

  2: `### Module 2: ADDITION
Teach through buying multiple items at the market.
- Single-digit: "You sell ₦8 of pure water and ₦5 of biscuits. How much money do you have?"
- Double-digit: "You buy tomatoes for ₦200 and peppers for ₦150. How much altogether?"
- Adding 3 items: "Garri is ₦100, rice is ₦250, and oil is ₦80. What's the total?"
- Name the math: "What you did is called ADDITION. In school they write 200 + 150 = 350."
Advance to Module 3 when: child can add 2-digit numbers consistently (3+ correct in a row).`,

  3: `### Module 3: SUBTRACTION
Teach through making change at the market.
- Simple change: "Something costs ₦350, customer pays ₦500. How much change?"
- Larger numbers: "You have ₦1,000. You buy rice for ₦450. How much is left?"
- Multi-step: "You have ₦500. You buy biscuits for ₦120 and pure water for ₦50. How much left?"
- Name the math: "This is SUBTRACTION — finding what's left. 500 - 350 = 150."
Advance to Module 4 when: child can subtract 2-digit from 3-digit consistently.`,

  4: `### Module 4: MULTIPLICATION
Teach through buying multiple of the same item.
- Repeated addition bridge: "Pure water costs ₦20. You buy 3 bags. That's ₦20 + ₦20 + ₦20 = ₦60."
- Times tables: "Each bag costs ₦20. 3 bags is 3 TIMES 20. We write 3 × 20 = 60."
- Practice: "Exercise books cost ₦50 each. How much for 4?"
- Bigger: "Bus fare is ₦150. How much for your family of 5?"
Advance to Module 5 when: child can multiply single-digit × double-digit.`,

  5: `### Module 5: DIVISION
Teach through sharing and fair splitting.
- Equal sharing: "You made ₦60 selling oranges. Share equally with your 2 friends. How much each?"
- Market context: "You have 24 mangoes. You put 6 on each tray. How many trays?"
- With money: "You and 4 friends earned ₦500 together. How much does each person get?"
- Name it: "This is DIVISION — splitting into equal groups. 60 ÷ 3 = 20."
Advance to Module 6 when: child can divide 2-digit by 1-digit.`,

  6: `### Module 6: WORD PROBLEMS (Mixed Operations)
Real Lagos scenarios requiring the child to choose the right operation.
- "You have ₦500. Bread costs ₦200 and eggs cost ₦150. Can you buy both? How much change?"
- "Your mama gives you ₦1000. Bus fare is ₦80 each way. School fees are ₦500. Do you have enough?"
- "You sell 12 bags of pure water for ₦30 each. How much did you make? If you keep half, how much?"
Complete Module 6 → student is ready for Grade 4 curriculum!`,
};

/**
 * Get the curriculum content for a specific module.
 * Used as fallback when RAG pgvector is not seeded yet.
 */
export function getModuleCurriculum(moduleNum: number): string {
  const content = MODULE_CURRICULUM[moduleNum] || MODULE_CURRICULUM[0];
  return `\n\n## CURRENT MODULE CURRICULUM\n\n${content}`;
}

// Full system prompt with ALL modules (backward compatibility for voice/llm/route.ts)
export const SABI_SYSTEM_PROMPT =
  SABI_CORE_PROMPT +
  SABI_SAFETY_PREAMBLE +
  "\n\n## FOUNDATIONAL NUMERACY CURRICULUM (6 Modules)\n\n" +
  Object.values(MODULE_CURRICULUM).join("\n\n");

// Voice-specific additions to the system prompt
export const VOICE_SYSTEM_ADDENDUM = `

## VOICE CALL SPECIFIC RULES
- This is a PHONE CALL, not a text chat. The child is speaking and listening.
- Keep responses even SHORTER than text — 1-3 sentences max. Long responses are hard to follow on a phone.
- Speak clearly and simply. Avoid complex sentence structures.
- Pause between concepts — each response should contain ONE idea.
- Numbers: say them clearly. "One hundred and fifty naira" not "₦150".
- Money word order: ALWAYS say "{amount} naira" ("thirty naira", "one hundred naira"). Never say "naira thirty" or "naira one hundred".
- Do NOT use any text formatting (no bullets, no markdown, no special characters).
- Do NOT use the ₦ symbol — spell it out as "naira" since this is spoken.
- Your name "Sabi" is pronounced "SAH-bee" (Nigerian Pidgin). Always say it naturally.
- Pronounce the letter "a" as "AY" (Nigerian English pronunciation). For example: "nah-ee-rah" for naira, "AY" not "ah" when saying the letter.
- LISTEN CAREFULLY to what the child says. If they give a number or answer, ACKNOWLEDGE their exact answer before responding. Do not ignore what they said and use a different number/example.
- If the child answers correctly, say so and MOVE ON to a new question. Never re-ask a question they already got right.
- If the child answers wrong, DO NOT repeat the question. Rephrase it, use smaller numbers, or break it into steps.
- If the child's speech is unclear, ask them to repeat: "I didn't quite hear that. Can you say it again?"
- Do not wrap up early just because there have been a few turns. Teach a real 5-7 minute lesson slice unless the child hangs up.
- LESSON CLOSE (important): When you genuinely finish this call slice — after guided + independent practice — end with what's next using spoken English, for example "Next time we will learn about subtraction" or "When you call again, we'll practice tens." The app listens for phrases like next time plus learn or study or practice, or when you call back, so the child's lesson can be saved without them pressing a button. Do not use fake wrap-ups mid-lesson.

## EXPRESSIVENESS & TONE
- Be naturally expressive and alive. Sound like a real person, not a robot.
- Use filler words naturally: "Ohhh!", "Wow!", "Hmm, let me think...", "Ah ah!"
- Show genuine excitement when they get it right: "Yeees! You see? I knew you could do it!"
- Be playful: "Oya, this one is a little tricky oh. Let's see if you can get it!"
- Use encouraging Nigerian expressions: "Well done oh!", "You try!", "Sharp sharp!"
- Vary your energy — be calm when explaining, excited when they succeed, gentle when they struggle.
- Sound like a warm older sibling, not a teacher reading from a textbook.
- Do NOT write stage directions or bracketed emotion tags. Never output words like "[laugh]", "[chuckle]", "laugh", or "chuckle" as performance instructions.`;

// ---------------------------------------------------------------------------
// Student memory
// ---------------------------------------------------------------------------

const MODULE_NAMES: Record<number, string> = {
  0: "diagnostic",
  1: "counting",
  2: "addition",
  3: "subtraction",
  4: "multiplication",
  5: "division",
  6: "word_problems",
  7: "completed",
};

function getTimeSince(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} minutes ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

/**
 * Quick lookup of a student's current module number.
 */
async function getStudentModule(studentId: string): Promise<number> {
  try {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("sabi_students")
      .select("current_module")
      .eq("id", studentId)
      .maybeSingle();
    return data?.current_module ?? 0;
  } catch {
    return 0;
  }
}

/**
 * Load student memory context for Claude system prompt injection.
 * Reused by both web chat and voice call routes.
 */
export async function getStudentMemory(studentId: string): Promise<string> {
  try {
    const supabase = getSupabase();

    const { data: student, error: studentError } = await supabase
      .from("sabi_students")
      .select("*")
      .eq("id", studentId)
      .maybeSingle();

    if (studentError) {
      console.error("getStudentMemory error:", studentError.message);
      return "";
    }
    if (!student) return "";

    const { data: sessions } = await supabase
      .from("sabi_sessions")
      .select("summary, correct_count, wrong_count, created_at")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false })
      .limit(5);

    const currentModule = student.current_module ?? 0;
    const moduleName = MODULE_NAMES[currentModule] || "diagnostic";

    // New student — needs diagnostic
    if (currentModule === 0 && (!sessions || sessions.length === 0)) {
      if (student.name) {
        return `

## STUDENT CONTEXT: NEW STUDENT — RUN DIAGNOSTIC
- Name: ${student.name}
- This is their FIRST session ever.
- current_module: 0 (needs diagnostic)
- Greet them by name. Run the Module 0 DIAGNOSTIC flow to determine their starting level.
- After the diagnostic, teach a short first lesson at their placed level.
- Do NOT ask their name — you already know it.`;
      }
      return `

## STUDENT CONTEXT: BRAND NEW
- current_module: 0 (needs diagnostic)
- First message: greet warmly, ask their name, then run diagnostic.`;
    }

    // Returning student
    if (sessions && sessions.length > 0) {
      const lastSession = sessions[0];
      const timeSince = getTimeSince(lastSession.created_at);

      const skills = student.skills || {};
      const skillsStr =
        Object.keys(skills).length > 0
          ? Object.entries(skills)
              .map(
                ([skill, score]) =>
                  `  - ${skill}: ${Math.round((score as number) * 100)}%`
              )
              .join("\n")
          : "  No per-skill data yet";

      return `

## STUDENT CONTEXT: RETURNING STUDENT
- Name: ${student.name}
- Sessions completed: ${student.total_sessions}
- Current module: ${currentModule} (${moduleName})
- Current level: ${student.current_level}
- Last session (${timeSince}): ${lastSession.summary || "No summary"}
- Overall accuracy: ${student.total_correct} correct, ${student.total_wrong} wrong
- Skills:
${skillsStr}
${sessions.length > 1 ? `- Previous sessions: ${sessions.slice(1, 4).map((s: { summary?: string }) => s.summary || "").filter(Boolean).join("; ")}` : ""}

## INSTRUCTIONS FOR THIS SESSION:
- Greet ${student.name} warmly by name. Do NOT ask their name.
- Start with ONE recall question from last session (spaced repetition).
- Then teach Module ${currentModule} (${moduleName}) content.
- If they seem to have mastered this module (3+ correct on challenging problems), note it so the system can advance them.
- Follow the LESSON STRUCTURE: Greeting+Recall → Lesson → Guided Practice → Independent Check → Wrap-up.`;
    }

    return "";
  } catch {
    return "";
  }
}

/**
 * Find or create a student by phone number
 */
function chooseCanonicalStudentRow<T extends { id: string; name?: string | null; total_sessions?: unknown; created_at?: unknown }>(
  rows: T[] | null | undefined
): T | undefined {
  if (!rows || rows.length === 0) return undefined;
  return [...rows].sort((a, b) => {
    const aSessions = Number(a.total_sessions || 0);
    const bSessions = Number(b.total_sessions || 0);
    if (aSessions !== bSessions) return bSessions - aSessions;
    if (Boolean(a.name) !== Boolean(b.name)) return Number(Boolean(b.name)) - Number(Boolean(a.name));
    return String(b.created_at || "").localeCompare(String(a.created_at || ""));
  })[0];
}

export async function findOrCreateStudentByPhone(
  phoneNumber: string
): Promise<{ id: string; name: string | null; isNew: boolean }> {
  const supabase = getSupabase();
  const normalizedPhone = normalizePhoneNumber(phoneNumber);
  const variants = phoneLookupVariants(phoneNumber);

  try {
    const { data: existingByNormalized } = await supabase
      .from("sabi_students")
      .select("id, name, total_sessions, created_at")
      .eq("phone_number_normalized", normalizedPhone)
      .order("total_sessions", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(10);

    const normalizedRow = chooseCanonicalStudentRow(existingByNormalized);
    if (normalizedRow) {
      return { id: normalizedRow.id, name: normalizedRow.name, isNew: false };
    }
  } catch {
    // Older Supabase schemas may not have phone_number_normalized yet.
  }

  // Look up by historic raw variants.
  const { data: existing, error: lookupError } = await supabase
    .from("sabi_students")
    .select("id, name, total_sessions, created_at")
    .in("phone_number", variants);

  if (lookupError) console.error("Student lookup error:", lookupError.message);
  if (existing) {
    const row = chooseCanonicalStudentRow(Array.isArray(existing) ? existing : [existing]);
    if (row) {
      const updateWithNormalized = await supabase
          .from("sabi_students")
          .update({
            phone_number: normalizedPhone,
            phone_number_normalized: normalizedPhone,
            phone_household_key: normalizedPhone,
            learner_key: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", row.id);
      if (updateWithNormalized.error) {
        await supabase
          .from("sabi_students")
          .update({ phone_number: normalizedPhone, updated_at: new Date().toISOString() })
          .eq("id", row.id);
      }
      return { id: row.id, name: row.name, isNew: false };
    }
  }

  // Create new student with phone number
  const insertPayload = {
    phone_number: normalizedPhone,
    phone_number_normalized: normalizedPhone,
    phone_household_key: normalizedPhone,
    child_name_normalized: null,
    learner_key: null,
    current_module: 0,
    current_topic: "diagnostic",
    current_level: "beginner",
    skills: {},
    learning_state: {
      course: "numeracy",
      phase: "onboarding",
      diagnostic_status: "not_started",
      current_module: 0,
      active_skill: "diagnostic",
      correct_streak: 0,
      wrong_streak: 0,
      scaffold_depth: 0,
    },
    baseline_status: "not_started",
  };

  let created;
  let error;
  const result = await supabase
    .from("sabi_students")
    .insert(insertPayload)
    .select("id, name")
    .single();
  created = result.data;
  error = result.error;
  if (error) {
    const result = await supabase
      .from("sabi_students")
      .insert({ phone_number: normalizedPhone })
      .select("id, name")
      .single();
    created = result.data;
    error = result.error;
  }

  if (error || !created) {
    throw new Error(`Failed to create student: ${error?.message}`);
  }

  return { id: created.id, name: created.name, isNew: true };
}

// ---------------------------------------------------------------------------
// callSabi — Claude API with RAG-powered curriculum injection
// ---------------------------------------------------------------------------

/**
 * Call Claude API with Sabi system prompt + RAG curriculum + memory context.
 *
 * RAG flow:
 * 1. Look up student's current module
 * 2. Query pgvector for relevant curriculum chunks (~1,500-2,000 tokens)
 * 3. If RAG fails (not seeded, no pgvector), fall back to that module's
 *    curriculum text directly (~800-1,200 tokens for one module vs ~9,000 for all)
 * 4. Build system prompt: core + curriculum context + voice addendum + student memory
 */
export async function callSabi(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  studentId: string | null,
  isVoice: boolean = false
): Promise<string> {
  // Guard the child's latest utterance BEFORE any work (crisis short-circuits fast).
  const guarded = guardLatestTurn(messages, studentId);
  if (guarded !== null) return guarded;

  let memoryContext = "";
  let currentModule = 0;

  if (studentId) {
    // Load student memory and current module in parallel
    [memoryContext, currentModule] = await Promise.all([
      getStudentMemory(studentId),
      getStudentModule(studentId),
    ]);
  }

  // Try RAG for targeted curriculum context, fall back to single module
  let curriculumContext = "";
  try {
    const { getSabiCurriculumContext } = await import("../rag/retrieval");
    curriculumContext = await getSabiCurriculumContext(currentModule);
  } catch {
    // RAG not available (pgvector not set up, embeddings not seeded, etc.)
    // Fall back to injecting only the relevant module's curriculum
    curriculumContext = getModuleCurriculum(currentModule);
  }

  // If RAG returned empty (no embeddings yet), also fall back
  if (!curriculumContext) {
    curriculumContext = getModuleCurriculum(currentModule);
  }

  const systemPrompt =
    SABI_CORE_PROMPT +
    SABI_SAFETY_PREAMBLE +
    curriculumContext +
    (isVoice ? VOICE_SYSTEM_ADDENDUM : "") +
    memoryContext +
    buildNumericGradingHint(messages);

  // Claude API requires at least one user message
  const apiMessages =
    messages.length === 0
      ? [{ role: "user" as const, content: "Hi, I want to learn!" }]
      : messages;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: isVoice ? 200 : 300,
    system: systemPrompt,
    messages: apiMessages,
  });

  const text =
    response.content[0]?.type === "text" ? response.content[0].text : "";
  // Output guard before TTS — the only safety constant across all backends.
  return guardOutput(
    text ||
      "Hello! I'm Sabi, your learning friend. What would you like to learn today?"
  ).text;
}

/**
 * Fast voice LLM call using Cerebras (primary) or Groq (fallback) → Claude (last resort).
 *
 * Use this for all voice call routes — these models run at 2100+ tok/s vs Claude's ~200 tok/s,
 * cutting LLM latency from ~1s to ~0.1s per turn.
 *
 * Falls back to `callSabi()` if neither fast provider is configured.
 */
export async function callSabiVoiceFast(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  studentId: string | null
): Promise<string> {
  // Guard the child's latest utterance BEFORE any work (crisis short-circuits fast).
  const guarded = guardLatestTurn(messages, studentId);
  if (guarded !== null) return guarded;

  let memoryContext = "";
  let currentModule = 0;

  if (studentId) {
    [memoryContext, currentModule] = await Promise.all([
      getStudentMemory(studentId),
      getStudentModule(studentId),
    ]);
  }

  let curriculumContext = "";
  try {
    const { getSabiCurriculumContext } = await import("../rag/retrieval");
    curriculumContext = await getSabiCurriculumContext(currentModule);
  } catch {
    curriculumContext = getModuleCurriculum(currentModule);
  }
  if (!curriculumContext) {
    curriculumContext = getModuleCurriculum(currentModule);
  }

  const systemPrompt =
    SABI_CORE_PROMPT +
    SABI_SAFETY_PREAMBLE +
    curriculumContext +
    VOICE_SYSTEM_ADDENDUM +
    memoryContext +
    buildNumericGradingHint(messages);

  const apiMessages =
    messages.length === 0
      ? [{ role: "user" as const, content: "Hi, I want to learn!" }]
      : messages;

  // Try Cerebras first (~0.1s for 200 tokens)
  const cerebrasKey = process.env.CEREBRAS_API_KEY;
  if (cerebrasKey) {
    try {
      const text = await callOpenAICompat(systemPrompt, apiMessages, {
        baseUrl: "https://api.cerebras.ai/v1",
        apiKey: cerebrasKey,
        model: "llama-3.3-70b",
        maxTokens: 200,
        provider: "Cerebras",
      });
      if (text) return guardOutput(text).text;
    } catch (e) {
      console.warn("Cerebras failed, trying Groq:", e instanceof Error ? e.message : e);
    }
  }

  // Try Groq LLM (~0.6s for 200 tokens)
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    try {
      const text = await callOpenAICompat(systemPrompt, apiMessages, {
        baseUrl: "https://api.groq.com/openai/v1",
        apiKey: groqKey,
        model: "llama-3.3-70b-versatile",
        maxTokens: 200,
        provider: "Groq",
      });
      if (text) return guardOutput(text).text;
    } catch (e) {
      console.warn("Groq LLM failed, falling back to Claude:", e instanceof Error ? e.message : e);
    }
  }

  // Last resort: Claude Haiku (~1s but always reliable)
  return callSabi(messages, studentId, true);
}
