import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sabi for Developers",
  description:
    "Request early access to Sabi's African voice AI API for Nigerian English, Pidgin, noisy phone audio, and feature-phone workflows.",
};

export default function SabiDevelopersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
