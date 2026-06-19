# Sabi Guardrails — Integration Guide

A standalone child-safety layer lives in [`guardrails.ts`](./guardrails.ts). It was built **additively** so it does not collide with active work in `sabi-shared.ts` / `sabi-server`. Wiring it in is three small edits, none of which rewrite the prompt or LLM logic.

## Why it exists (one paragraph)
Sabi talks to children (8–14). The research consensus: a *tutor that stays in role* avoids the entire companion-chatbot risk class (Character.AI, Snapchat My AI, FTC, CA SB 243), **safety must outrank scope** (a child disclosing abuse can't be met with "I'm just a tutor"), and because Sabi's LLM falls back across Cerebras→Claude→Groq→Ollama — and only Claude has real training-time safety — the **input/output guards are the only safety constant on every backend**. They must run on every turn.

## The defense-in-depth sandwich
```
child speech → STT → [guardInput] → hardened system prompt → model → [guardOutput] → TTS
                          │                                                  │
                          └── crisis → caring response + async safeguarding flag
```

## Three edits to wire it in

### 1. Harden the system prompt (1 line, in `sabi-shared.ts`)
```ts
import { SABI_SAFETY_PREAMBLE } from "./guardrails";
// wherever SABI_CORE_PROMPT is concatenated into the system prompt:
const systemPrompt = SABI_CORE_PROMPT + SABI_SAFETY_PREAMBLE + /* …existing… */;
```
This adds the child-safety rules block (tutor-not-companion, safety>scope, no PII, no prompt-leak, Nigeria crisis lines, age-appropriate tone). Per KIDBench, stating "the user is a child aged 8–14" in the prompt is worth +9–47% safety on its own.

### 2. Input guard (before calling the model, in each voice route / `callSabi`)
```ts
import { guardInput } from "../voice/guardrails";

const ig = guardInput(childTranscript);
if (ig.flagForSafeguarding) await raiseSafeguardingIncident(callId, ig); // see §Escalation
if (ig.doNotStore) markTurnNoStore(callId);                              // don't persist PII
if (ig.shortCircuit) {
  // crisis / hard refusal — speak the safe line, do NOT free-generate
  return ig.safeResponse;
}
// otherwise proceed to the model; if ig.action === "redirect", you may
// append ig.safeResponse as a gentle nudge to the prompt.
```

### 3. Output guard (after the model, before TTS — on EVERY backend)
```ts
import { guardOutput } from "../voice/guardrails";

const safe = guardOutput(modelText);
if (safe.blocked) logBlockedOutput(callId, safe.reason);
speak(safe.text); // never send unfiltered model output to TTS
```

## Escalation (the "no real-time human" answer)
There is no live human in the loop, so a crisis = **immediate caring response (handled by `guardInput`) + an ASYNC flag** to a named safeguarding focal point. You need to implement `raiseSafeguardingIncident()` to write a CRITICAL row to a **restricted, audit-logged incident queue** (minimal PII) that a designated human (e.g. the Lagos coordinator or a contracted child-protection officer) reviews on a defined SLA, per a written child-protection policy. This is required before any pilot (IASC Principle 5 / Keeping Children Safe).

## Optional second layer
`llmModerate()` is a Claude-Haiku classifier (Anthropic content-moderation pattern) for *ambiguous* inputs only. It adds a round-trip, so keep it **off the latency-critical voice hot path** — call it only when `guardInput` returns `safe` but you want a second opinion (e.g. async review), or on the text/chat surface where latency is looser. It fails open to the rule layer.

## Stress test (run before every pilot and after any prompt/pattern change)
```
npm run stress:guardrails      # or: npx tsx scripts/guardrails-stress.ts
```
40 adversarial input cases + 6 output cases across jailbreak, prompt-extraction, off-topic, crisis disclosure, inappropriate content, grooming/PII, injection, bias, and safe-passthrough. Exits non-zero on any failure — wire it into CI. The crisis cases (group `D`) are flagged as must-pass.

## Still TODO (not code — policy/ops, required before a real pilot)
- Mirror this module to `sabi-server/guardrails.py` (do it once Codex's in-flight `llm.py` changes are committed, to avoid clobbering them).
- Request **Anthropic's child-safety system prompt** and register Sabi as a minor-serving API use (you're contractually bound to age verification + moderation + monitoring + AI disclosure).
- Write the **child-protection / safeguarding policy** + name the focal point + define the incident-review SLA.
- Do **not store raw child audio; do not train on child data** without separate guardian consent; redact PII from transcripts; written retention policy (COPPA/NDPA/Children's Code).
- Verify the Nigeria crisis numbers are still live; localize per launch region.
