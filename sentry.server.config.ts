// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
//
// Custom config preserves the wizard's defaults but layers on:
//   - PII scrubbing (NDPA + COPPA — kids' data must NOT leave our servers)
//   - Anthropic AI Monitoring with prompts/outputs DISABLED
//   - Console logging integration with phone-number redaction
//
// Do not regress sendDefaultPii to true without re-evaluating compliance.

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://6547e4a617f6e78f4b9d9bff83cd0575@o4511531743444992.ingest.us.sentry.io/4511531746852864",

  // Tracing — 100% in dev, 20% in prod
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.2,

  // Privacy posture for child voice data — DO NOT enable
  sendDefaultPii: false,

  // Logs flow to Sentry's log explorer
  enableLogs: true,

  // Capture local variables in stack traces
  includeLocalVariables: true,

  // Stream gen-ai spans during the LLM call (latency visibility)
  streamGenAiSpans: true,

  integrations: [
    // Anthropic auto-instrumentation: tokens + latency + cost, NEVER prompts
    Sentry.anthropicAIIntegration({
      recordInputs: false,
      recordOutputs: false,
    }),
    // Forward console.log/.info/.warn/.error to Sentry's log explorer
    Sentry.consoleLoggingIntegration({
      levels: ["log", "info", "warn", "error"],
    }),
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
