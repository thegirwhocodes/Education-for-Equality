/**
 * Sentry — Node.js server-side init.
 * Loaded by instrumentation.ts when NEXT_RUNTIME === "nodejs".
 *
 * PII: same NDPA/COPPA reasoning as instrumentation-client.ts —
 * sendDefaultPii=false + beforeSend phone-number scrub.
 */
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  sendDefaultPii: false,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.2,
  includeLocalVariables: true,
  enableLogs: true,
  environment: process.env.VERCEL_ENV || "development",

  beforeSend(event) {
    return scrubPII(event);
  },
});

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
