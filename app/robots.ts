import type { MetadataRoute } from "next";
import { SABI_URL, SITE_URL } from "@/lib/seo";

// Interactive routes that cost money per request or hold private data. Kept out
// of search results and away from AI crawlers, on both hosts — the sabi.
// subdomain serves the same pages at /demo and /chat via middleware rewrites.
const CRAWL_EXCLUDED = [
  "/dashboard",
  "/reset-password",
  "/api/",
  "/sentry-example-page",
  "/advisor-board",
  "/workspace",
  "/sabi/parents",
  "/sabi/demo",
  "/sabi-voice",
  "/sabi-demo",
  "/demo",
  "/chat",
];

// Blocked from the live demo only. Sabi's marketing and FAQ copy is left open to
// these crawlers on purpose: answer engines are where a brand query like "Sabi"
// increasingly gets resolved.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "anthropic-ai",
  "ClaudeBot",
  "Claude-Web",
  "PerplexityBot",
  "CCBot",
  "Google-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: CRAWL_EXCLUDED,
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: CRAWL_EXCLUDED,
      })),
    ],
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SABI_URL}/sitemap.xml`],
    host: SITE_URL,
  };
}
