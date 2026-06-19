#!/usr/bin/env tsx

/**
 * Curriculum quality gate for Sabi's standards registry.
 *
 * This is not an accreditation check. It is the internal "do not ship chaos"
 * test: every production lesson must have a skill, standards refs, diagnostic
 * signals, mastery evidence, and a safe claim boundary.
 */

import fs from "node:fs";
import path from "node:path";

import {
  foundationalLiteracyLessonCrosswalk,
  foundationalLiteracyModuleCrosswalk,
  foundationalLiteracySkills,
  foundationalNumeracyLessonCrosswalk,
  foundationalNumeracyModuleCrosswalk,
  foundationalNumeracySkills,
  numeracyDiagnosticBlueprint,
  literacyDiagnosticBlueprint,
  priorityStandardsReviewQueue,
  type ExternalStandardRef,
  type SabiLessonAlignment,
  type SabiModuleAlignment,
  type SabiSkill,
} from "../lib/standards";

type GateRow = {
  group: string;
  id: string;
  level: "pass" | "warn" | "fail";
  detail: string;
};

const rows: GateRow[] = [];

const allSkills = [...foundationalNumeracySkills, ...foundationalLiteracySkills];
const allLessons = [
  ...foundationalNumeracyLessonCrosswalk,
  ...foundationalLiteracyLessonCrosswalk,
];
const allModules = [
  ...foundationalNumeracyModuleCrosswalk,
  ...foundationalLiteracyModuleCrosswalk,
];
const skillIds = new Set(allSkills.map((skill) => skill.id));

function add(row: GateRow) {
  rows.push(row);
}

function assertGate(group: string, id: string, condition: boolean, detail: string) {
  add({ group, id, level: condition ? "pass" : "fail", detail });
}

function warnGate(group: string, id: string, condition: boolean, detail: string) {
  add({ group, id, level: condition ? "pass" : "warn", detail });
}

function validateStandards(ownerType: string, ownerId: string, refs: ExternalStandardRef[]) {
  assertGate(ownerType, ownerId, refs.length > 0, "has at least one external standard reference");
  for (const ref of refs) {
    assertGate(ownerType, `${ownerId}:${ref.id}`, Boolean(ref.framework && ref.description), "standard ref has framework and description");
    assertGate(ownerType, `${ownerId}:${ref.id}:relation`, ["teaches", "supports", "assesses", "extends"].includes(ref.relation), "standard ref relation is valid");
    assertGate(ownerType, `${ownerId}:${ref.id}:verification`, ["verified_official", "working_crosswalk", "needs_official_review"].includes(ref.verificationStatus), "standard ref verification status is valid");
  }
}

function validateSkill(skill: SabiSkill) {
  assertGate("skill", skill.id, Boolean(skill.name && skill.description), "skill has name and description");
  assertGate("skill", `${skill.id}:mastery`, skill.masteryCriteria.length > 0, "skill has mastery criteria");
  for (const prereq of skill.prerequisiteSkillIds) {
    assertGate("skill", `${skill.id}:prereq:${prereq}`, skillIds.has(prereq), "prerequisite skill exists");
  }
  validateStandards("skill-standard", skill.id, skill.standardRefs);
}

function validateModule(module: SabiModuleAlignment) {
  assertGate("module", module.moduleId, Boolean(module.title && module.levelBand), "module has title and level band");
  assertGate("module", `${module.moduleId}:exit`, module.exitCriteria.length > 0, "module has exit criteria");
  for (const skillId of module.skillIds) {
    assertGate("module", `${module.moduleId}:skill:${skillId}`, skillIds.has(skillId), "module skill exists");
  }
  validateStandards("module-standard", module.moduleId, module.standardRefs);
}

function validateLesson(lesson: SabiLessonAlignment) {
  assertGate("lesson", lesson.lessonId, Boolean(lesson.title), "lesson has title");
  assertGate("lesson", `${lesson.lessonId}:skills`, lesson.skillIds.length > 0, "lesson has skill ids");
  for (const skillId of lesson.skillIds) {
    assertGate("lesson", `${lesson.lessonId}:skill:${skillId}`, skillIds.has(skillId), "lesson skill exists");
  }
  assertGate("lesson", `${lesson.lessonId}:diagnostic`, lesson.diagnosticSignals.length > 0, "lesson has diagnostic signals");
  assertGate("lesson", `${lesson.lessonId}:mastery`, lesson.masteryEvidence.length > 0, "lesson has mastery evidence");
  assertGate("lesson", `${lesson.lessonId}:delivery`, lesson.deliveryModes.length > 0, "lesson has delivery modes");
  if (lesson.voiceSuitability === "requires_visual_or_print") {
    assertGate("lesson", `${lesson.lessonId}:print-bridge`, lesson.deliveryModes.includes("print_bridge") || lesson.deliveryModes.includes("app"), "visual lesson has app or print bridge");
  }
  validateStandards("lesson-standard", lesson.lessonId, lesson.standardRefs);
}

for (const skill of allSkills) validateSkill(skill);
for (const module of allModules) validateModule(module);
for (const lesson of allLessons) validateLesson(lesson);

assertGate("coverage", "foundational-numeracy-lessons", foundationalNumeracyLessonCrosswalk.length === 95, "95 foundational numeracy lessons are registered: 64 markdown lessons plus app Module 5/6");
assertGate("coverage", "foundational-literacy-lessons", foundationalLiteracyLessonCrosswalk.length === 80, "80 Phase 1 foundational literacy lessons are registered");
assertGate("coverage", "diagnostic-numeracy", numeracyDiagnosticBlueprint.items.length >= 7, "numeracy diagnostic has a full ladder through division and word problems");
assertGate("coverage", "diagnostic-literacy", literacyDiagnosticBlueprint.items.length >= 5, "literacy diagnostic covers oral language, phonemic awareness, blending, comprehension, and grammar");

const numeracyPlacements = numeracyDiagnosticBlueprint.placementRules.map((rule) => rule.placement);
warnGate("source-of-truth", "module-5-6", numeracyPlacements.some((placement) => placement.includes("Module 5")) && numeracyPlacements.some((placement) => placement.includes("Module 6")), "diagnostic can place into Module 5/6; app lessons exist, markdown voice-script mirror is still a review-queue item");

const p0Open = priorityStandardsReviewQueue.filter((item) => item.status !== "done");
warnGate("review-queue", "p0-open-items", p0Open.length === 0, p0Open.length ? `open P0 review items: ${p0Open.map((item) => item.id).join(", ")}` : "no open P0 review items");

const repoRoot = path.resolve(process.cwd(), "..");
const runtimeSearchRoots = [
  path.join(repoRoot, "2. The Solution", "lesson-scripts"),
  path.join(process.cwd(), "lib"),
];
const tagPattern = /\[(laugh|chuckle|sigh|giggle)\]/i;
const tagHits: string[] = [];

function walkFiles(dir: string) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath);
    } else if (/\.(md|ts|tsx|json)$/.test(entry.name)) {
      const text = fs.readFileSync(fullPath, "utf8");
      if (tagPattern.test(text)) {
        tagHits.push(path.relative(repoRoot, fullPath));
      }
    }
  }
}

for (const root of runtimeSearchRoots) walkFiles(root);

warnGate(
  "voice-performance",
  "inline-affect-tags",
  tagHits.length === 0,
  tagHits.length
    ? `${tagHits.length} file(s) still contain bracketed affect tags; migrate to voice metadata before external review packets`
    : "no bracketed affect tags found in runtime/reviewer-facing text",
);

const failures = rows.filter((row) => row.level === "fail");
const warnings = rows.filter((row) => row.level === "warn");

const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

console.log("\nSabi Curriculum Quality Gate");
console.log("=".repeat(72));
let lastGroup = "";
for (const row of rows) {
  if (row.group !== lastGroup) {
    console.log(`\n${DIM}-- ${row.group} --${RESET}`);
    lastGroup = row.group;
  }
  const color = row.level === "pass" ? GREEN : row.level === "warn" ? YELLOW : RED;
  console.log(`  ${color}${row.level.toUpperCase().padEnd(4)}${RESET} ${row.id} - ${row.detail}`);
}

console.log("\n" + "=".repeat(72));
console.log(`${GREEN}${rows.length - failures.length - warnings.length}${RESET} pass, ${YELLOW}${warnings.length}${RESET} warn, ${RED}${failures.length}${RESET} fail`);

if (failures.length) {
  process.exit(1);
}
