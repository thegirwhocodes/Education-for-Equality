import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/reset-password", "/api/", "/sentry-example-page"],
    },
    sitemap: "https://eduforequality.org/sitemap.xml",
  };
}
