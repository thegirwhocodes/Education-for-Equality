/**
 * Server-side instrumentation hook.
 * Next.js calls register() once at startup for each runtime.
 */
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Auto-capture unhandled server-side request errors (requires @sentry/nextjs >= 8.28.0)
export const onRequestError = Sentry.captureRequestError;
