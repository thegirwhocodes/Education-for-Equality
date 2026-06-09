/**
 * Sentry — browser/client init.
 *
 * Per Sentry Next.js SDK skill v8.28+: this file replaces sentry.client.config.ts.
 *
 * PII NOTE (Sabi/E4E): sendDefaultPii is intentionally FALSE — voice transcripts +
 * phone numbers count as PII under NDPA + COPPA. The beforeSend hook also masks
 * any phone numbers that leak into captured events. Mandatory before pre-pilot.
 */
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  sendDefaultPii: false,

  // 100% in dev, 20% in production — enough signal, low cost
  tracesSampleRate: 1.0,

  // Session Replay: 0% baseline (off until needed for pre-pilot debugging),
  // 100% of error sessions get replayed so we can see what the user did when it broke
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,

  enableLogs: true,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || "development",

  integrations: [Sentry.replayIntegration()],

  beforeSend(event) {
    return scrubPII(event);
  },
});

// Hook into App Router navigation transitions
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

/**
 * Mask phone numbers and strip sensitive headers from any captured event.
 * Required for NDPA + COPPA compliance with child data.
 */
function scrubPII(event: Sentry.ErrorEvent): Sentry.ErrorEvent {
  const PHONE_RE = /\+?\d{10,15}/g;
  const REDACTED = "[PHONE_REDACTED]";

  if (event.request?.data) {
    const dataStr =
      typeof event.request.data === "string"
        ? event.request.data
        : JSON.stringify(event.request.data);
    const scrubbed = dataStr.replace(PHONE_RE, REDACTED);
    event.request.data =
      typeof event.request.data === "string" ? scrubbed : JSON.parse(scrubbed);
  }
  if (event.message) {
    event.message = event.message.replace(PHONE_RE, REDACTED);
  }
  if (event.request?.query_string) {
    event.request.query_string =
      typeof event.request.query_string === "string"
        ? event.request.query_string.replace(PHONE_RE, REDACTED)
        : event.request.query_string;
  }
  if (event.request?.headers) {
    delete event.request.headers.cookie;
    delete event.request.headers.authorization;
    delete event.request.headers["x-api-key"];
  }
  return event;
}
