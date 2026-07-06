import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sabi API — Pricing",
  description:
    "Usage-based pricing for the African voice AI pipeline. 1,000 minutes free every month, then $0.06/min with automatic volume discounts.",
};

export default function SabiPricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
