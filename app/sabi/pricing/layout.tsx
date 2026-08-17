import type { Metadata } from "next";
import { SABI_URL, sabiOpenGraph } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sabi API pricing — African voice AI from $0.06/min",
  description:
    "Usage-based pricing for the African voice AI pipeline behind Sabi. 1,000 minutes free every month, then $0.06/min with automatic volume discounts.",
  // The subdomain serves this page at /pricing (middleware rewrite).
  alternates: { canonical: `${SABI_URL}/pricing` },
  openGraph: sabiOpenGraph("/pricing"),
};

export default function SabiPricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
