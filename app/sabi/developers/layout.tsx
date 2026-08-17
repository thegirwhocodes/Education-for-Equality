import type { Metadata } from "next";
import { SABI_URL, sabiOpenGraph } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sabi for developers — African voice AI API",
  description:
    "Request early access to Sabi's African voice AI API for Nigerian English, Pidgin, noisy phone audio, and feature-phone workflows.",
  // The subdomain serves this page at /developers (middleware rewrite).
  alternates: { canonical: `${SABI_URL}/developers` },
  openGraph: sabiOpenGraph("/developers"),
};

export default function SabiDevelopersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
