/**
 * Sentry — Node.js server-side init.
 * Loaded by instrumentation.ts when NEXT_RUNTIME === "nodejs".
 *
 * Features enabled:
 *   - Error monitoring (auto via @sentry/nextjs)
 *   - Tracing — sampled at 20% in prod, 100% in dev
 *   - AI Monitoring — Anthropic token usage + cost estimates per LLM call
 *     (NOT prompts/completions — those are PII for Sabi's child data)
 *   - Logs — auto-forwards console.log/warn/error from API routes
 *     with PII scrubbing in beforeSendLog
 *
 * Privacy posture for Sabi (children's voice tutor):
 *   - sendDefaultPii: false  → no IP addresses, no request headers captured
 *   - recordInputs: false    → Claude prompts NOT sent to Sentry
 *   - recordOutputs: false   → Claude completions NOT sent to Sentry
 *   - beforeSend + beforeSendLog → phone numbers redacted from any leakage
 *
 * NDPA + COPPA compliant. Token counts + cost + latency still tracked
 * (no PII in those metrics).
 */
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  sendDefaultPii: false,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.2,
  includeLocalVariables: true,
  enableLogs: true,
  streamGenAiSpans: true,
  environment: process.env.VERCEL_ENV || "development",

  integrations: [
    // Anthropic auto-instrumentation: captures gen_ai.* span attributes
    // (model, token counts, cost estimate, latency) — but NO prompt/completion
    // text because recordInputs/recordOutputs are explicitly off below.
    Sentry.anthropicAIIntegration({
      recordInputs: false,
      recordOutputs: false,
    }),

    // Forward console.log / .warn / .error → Sentry log explorer.
    // We already have console.log lines in the AT routes; this turns them
    // into structured, searchable logs.
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

// Type matches Sentry's Log shape. Loose-typed to avoid importing internals.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function scrubLog(log: any): any {
  // Drop trace-level logs in production (too noisy)
  if (process.env.NODE_ENV === "production" && log.level === "trace") {
    return null;
  }
  // Mask phone numbers in the message body
  if (typeof log.body === "string") {
    log.body = log.body.replace(PHONE_RE, REDACTED);
  }
  // Mask phone numbers in attributes — but keep token counts, durations, etc.
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
