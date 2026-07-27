import type { MetadataRoute } from "next";

const SITE_URL = "https://eduforequality.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", priority: 1, freq: "weekly" as const },
    { path: "sabi", priority: 0.9, freq: "weekly" as const },
    { path: "sabi-voice", priority: 0.9, freq: "monthly" as const },
    { path: "sabi-demo", priority: 0.8, freq: "monthly" as const },
    { path: "about", priority: 0.7, freq: "monthly" as const },
    { path: "curriculum", priority: 0.7, freq: "monthly" as const },
    { path: "subjects", priority: 0.6, freq: "monthly" as const },
    { path: "reading", priority: 0.6, freq: "monthly" as const },
  ];
  return routes.map((r) => ({
    url: r.path ? `${SITE_URL}/${r.path}` : SITE_URL,
    changeFrequency: r.freq,
    priority: r.priority,
  }));
}
