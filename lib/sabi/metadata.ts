import type { Metadata } from "next";
import { SABI_URL, sabiOpenGraph } from "@/lib/seo";

/**
 * Metadata for a Sabi subpage. `path` is the clean subdomain path (e.g.
 * "/evidence"), which is the canonical URL even though the page file lives at
 * app/sabi/evidence.
 */
export function sabiPageMetadata({
  path,
  title,
  description,
}: {
  path: `/${string}`;
  title: string;
  description: string;
}): Metadata {
  return {
    title: { absolute: `${title} | Sabi` },
    description,
    alternates: { canonical: `${SABI_URL}${path}` },
    openGraph: { ...sabiOpenGraph(path), title, description, siteName: "Sabi" },
    twitter: { title, description },
  };
}
