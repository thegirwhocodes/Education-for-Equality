import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/",
        has: [{ type: "host", value: "sabi.eduforequality.org" }],
        destination: "/sabi",
      },
    ];
  },
  async headers() {
    const noindex = { key: "X-Robots-Tag", value: "noindex, nofollow" };
    // Header rules match the *incoming* path, so the sabi. subdomain's /demo
    // and /chat need their own entries — the middleware rewrite to
    // /sabi-voice and /sabi-demo happens too late for the rules below.
    return [
      "/sabi/demo/:path*",
      "/sabi-voice/:path*",
      "/sabi-demo/:path*",
      "/demo/:path*",
      "/chat/:path*",
    ].map((source) => ({ source, headers: [noindex] }));
  },
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "sabi-43",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
