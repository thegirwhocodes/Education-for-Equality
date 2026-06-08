/**
 * Sentry — Edge runtime init.
 * Loaded by instrumentation.ts when NEXT_RUNTIME === "edge".
 *
 * Note: AI Monitoring integration NOT auto-enabled on Edge — Anthropic SDK
 * calls happen in Node runtime (API routes) so we don't need it here.
 * This config is for middleware + edge-rendered pages.
 */
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  sendDefaultPii: false,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.2,
  enableLogs: true,
  environment: process.env.VERCEL_ENV || "development",

  integrations: [
    Sentry.consoleLoggingIntegration({ levels: ["log", "info", "warn", "error"] }),
  ],

  beforeSend(event) {
    return scrubPII(event);
  },

  beforeSendLog(log) {
    return scrubLog(log);
  },
});

const PHONE_RE = /\+?\d{10,15}/g;
const REDACTED = "[PHONE_REDACTED]";

function scrubPII(event: Sentry.ErrorEvent): Sentry.ErrorEvent {
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
  if (event.request?.headers) {
    delete event.request.headers.cookie;
    delete event.request.headers.authorization;
    delete event.request.headers["x-api-key"];
  }
  return event;
}

// Type matches Sentry's Log shape. Loose-typed to avoid importing internals.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function scrubLog(log: any): any {
  if (process.env.NODE_ENV === "production" && log.level === "trace") {
    return null;
  }
  if (typeof log.body === "string") {
    log.body = log.body.replace(PHONE_RE, REDACTED);
  }
  if (log.attributes) {
    for (const k of Object.keys(log.attributes)) {
      const v = log.attributes[k];
      if (typeof v === "string" && PHONE_RE.test(v)) {
        log.attributes[k] = v.replace(PHONE_RE, REDACTED);
      }
    }
  }
  return log;
}
