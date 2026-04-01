import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sabi — Voice AI for Africa",
  description:
    "The only voice AI platform built for African accents, languages, and infrastructure. For developers and organizations. From $0.04/min.",
};

export default function SabiPricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
