import * as Sentry from '@sentry/nextjs';

// Report a failure the USER was actually shown — not a crash, but the kind of
// "handled" error that ordinary crash-tracking never sees (e.g. "wrong
// password", "couldn't load tasks", a form that won't submit). This is the
// gap that let the login bug slip: nothing threw, so nothing was recorded.
//
// Call this everywhere the app shows a user an error banner. Every event is
// tagged `user_facing` + the flow, so the monitoring agent can alert on
// "N users hit an error in <flow>" instead of guessing.
export function reportUserFacingError(
  flow: string,
  message: string,
  extra?: Record<string, unknown>,
) {
  try {
    Sentry.captureMessage(`[user-facing] ${flow}: ${message}`, {
      level: 'warning',
      tags: { user_facing: 'true', flow },
      extra: extra ?? {},
    });
  } catch {
    // Never let monitoring break the actual UX.
  }
}
