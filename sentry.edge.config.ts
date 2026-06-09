// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
//
// PII scrubbing matches sentry.server.config.ts — NDPA + COPPA compliant.

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://6547e4a617f6e78f4b9d9bff83cd0575@o4511531743444992.ingest.us.sentry.io/4511531746852864",

  tracesSampleRate: 1.0,

  // Privacy posture — do not regress
  sendDefaultPii: false,

  enableLogs: true,

  integrations: [
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
