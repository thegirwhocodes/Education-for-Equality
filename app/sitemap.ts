import type { MetadataRoute } from "next";
import { SABI_URL, SITE_URL } from "@/lib/seo";

/**
 * One sitemap listing the canonical URL of every indexable page, across both
 * hosts. Sabi product pages live on the sabi. subdomain, organisation pages on
 * the apex — these must match the `alternates.canonical` each page declares, or
 * the sitemap and the page contradict each other.
 *
 * Because it spans a subdomain, verify eduforequality.org at the domain level
 * in Search Console (not just the URL prefix) so both hosts are covered.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-17");

  const routes: { url: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    // Sabi — the product, and the pages that should win the brand query.
    { url: SABI_URL, priority: 1, freq: "weekly" },
    { url: `${SABI_URL}/how-it-works`, priority: 0.8, freq: "monthly" },
    { url: `${SABI_URL}/families`, priority: 0.8, freq: "monthly" },
    { url: `${SABI_URL}/evidence`, priority: 0.7, freq: "monthly" },
    { url: `${SABI_URL}/partners`, priority: 0.7, freq: "monthly" },
    { url: `${SABI_URL}/about`, priority: 0.6, freq: "monthly" },
    { url: `${SABI_URL}/pricing`, priority: 0.7, freq: "monthly" },
    { url: `${SABI_URL}/developers`, priority: 0.7, freq: "monthly" },

    // Education for Equality — the organisation.
    { url: SITE_URL, priority: 0.9, freq: "weekly" },
    { url: `${SITE_URL}/about`, priority: 0.7, freq: "monthly" },
    { url: `${SITE_URL}/curriculum`, priority: 0.6, freq: "monthly" },
    { url: `${SITE_URL}/subjects`, priority: 0.6, freq: "monthly" },
    { url: `${SITE_URL}/reading`, priority: 0.5, freq: "monthly" },
  ];

  return routes.map((r) => ({
    url: r.url,
    lastModified,
    changeFrequency: r.freq,
    priority: r.priority,
  }));
}
