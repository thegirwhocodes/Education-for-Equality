/**
 * Detect when Sabi is closing a lesson ("next time we'll learn…") so we can
 * persist /api/sabi/session without requiring the learner to tap "End Lesson".
 *
 * Tune patterns here if LLM wording drifts — keep aligned with VOICE_SYSTEM_ADDENDUM.
 */

/** Avoid saving on greetings or very short stubs. */
export function transcriptEligibleForLessonCheckpoint(messages: unknown[]): boolean {
  if (!Array.isArray(messages) || messages.length < 4) return false;
  const userTurns = messages.filter(
    (m: { role?: string }) => m && m.role === "user"
  ).length;
  return userTurns >= 2;
}

/**
 * Strong signals that the assistant is handing off / closing the lesson slice.
 */
export function looksLikeLessonWrapUpAssistantMessage(raw: string): boolean {
  const t = raw.trim();
  if (t.length < 24) return false;

  const hasNextTime =
    /\bnext\s+time\b/i.test(t) ||
    /\bnext\s+(call|lesson|class)\b/i.test(t);

  const hasForwardLearn =
    /\b(learn|learning|study|studying|practice|practic(e|ing)|try|work\s+on|cover|talk\s+about|explore)\b/i.test(
      t
    );

  // "next time we will/will/shall … learn …"
  const nextTimeThenLearn =
    /\bnext\s+time\b.{0,140}\b(learn|learning|study|studying)\b/i.test(t) ||
    /\bnext\s+time\b.{0,40}\b(we'?ll|we\s+will|i'?ll|i\s+will|let'?s)\b.{0,100}\b(learn|study|try|practice|work\s+on)\b/i.test(
      t
    );

  const callbackFarewell =
    /\b(when\s+you\s+(call\s+)?(back|again)|call\s+(me\s+)?(back\s+)?(tomorrow|again))\b/i.test(
      t
    );

  const explicitClose =
    /\b(that'?s\s+all\s+for\s+(today|now|this\s+lesson))\b/i.test(t) ||
    /\b(great\s+work\s+today|you\s+did\s+(so\s+)?well\s+today)\b/i.test(t);

  if (nextTimeThenLearn || (hasNextTime && hasForwardLearn) || callbackFarewell)
    return true;

  return explicitClose;
}
