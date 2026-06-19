/**
 * Sabi guardrails stress test / red-team harness.
 *
 *   npx tsx scripts/guardrails-stress.ts          (or: npm run stress:guardrails)
 *
 * Fires the adversarial corpus in lib/voice/guardrails.ts through the input and
 * output guards and asserts each lands on an acceptable action. Exits non-zero
 * if any case fails — wire into CI so a prompt/pattern change can't silently
 * weaken child-safety behavior.
 */

import {
  guardInput,
  guardOutput,
  RED_TEAM_CASES,
  OUTPUT_RED_TEAM_CASES,
  type GuardAction,
} from "../lib/voice/guardrails";

type Row = {
  id: string;
  group: string;
  pass: boolean;
  detail: string;
};

const rows: Row[] = [];
let pass = 0;
let fail = 0;

// ---- Input guard cases ----
for (const c of RED_TEAM_CASES) {
  const r = guardInput(c.input);
  const actionOk = c.expect.includes(r.action as GuardAction);
  const flagOk = c.expectFlag === undefined ? true : r.flagForSafeguarding === c.expectFlag;
  const ok = actionOk && flagOk;
  rows.push({
    id: c.id,
    group: c.group,
    pass: ok,
    detail: ok
      ? `${r.action}${c.expectFlag ? " +flag" : ""} (${r.category})`
      : `GOT action=${r.action} flag=${r.flagForSafeguarding} cat=${r.category} | WANT action∈[${c.expect.join(",")}]${c.expectFlag !== undefined ? ` flag=${c.expectFlag}` : ""}  «${c.input}»`,
  });
  ok ? pass++ : fail++;
}

// ---- Output guard cases ----
for (const c of OUTPUT_RED_TEAM_CASES) {
  const r = guardOutput(c.output);
  const ok = r.blocked === c.expectBlocked;
  rows.push({
    id: c.id,
    group: "output",
    pass: ok,
    detail: ok
      ? `${r.blocked ? "blocked" : "passed"}${r.reason ? ` (${r.reason})` : ""}`
      : `GOT blocked=${r.blocked} | WANT blocked=${c.expectBlocked}  «${c.output}»`,
  });
  ok ? pass++ : fail++;
}

// ---- Report ----
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

console.log("\nSabi Guardrails — Red-Team Stress Test");
console.log("=".repeat(72));
let lastGroup = "";
for (const r of rows) {
  if (r.group !== lastGroup) {
    console.log(`\n${DIM}── ${r.group} ──${RESET}`);
    lastGroup = r.group;
  }
  const mark = r.pass ? `${GREEN}PASS${RESET}` : `${RED}FAIL${RESET}`;
  console.log(`  ${mark}  ${r.id.padEnd(4)} ${r.detail}`);
}

console.log("\n" + "=".repeat(72));
const total = pass + fail;
const pct = ((pass / total) * 100).toFixed(1);
console.log(
  `${fail === 0 ? GREEN : RED}${pass}/${total} passed (${pct}%)${RESET}` +
    (fail ? `  ${RED}${fail} FAILED${RESET}` : "  — all clear"),
);

// Crisis cases are the highest-stakes: report them explicitly.
const crisisFails = rows.filter((r) => r.group === "crisis" && !r.pass);
if (crisisFails.length) {
  console.log(
    `\n${RED}⚠ ${crisisFails.length} CRISIS case(s) failed — these MUST pass before any pilot.${RESET}`,
  );
}

process.exit(fail === 0 ? 0 : 1);
