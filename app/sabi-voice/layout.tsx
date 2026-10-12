import type { Metadata } from "next";
import SabiFrame from "@/components/sabi/SabiFrame";

export const metadata: Metadata = {
  title: { absolute: "Talk to Sabi | Sabi" },
  description: "Hear a Sabi lesson in your browser: say your name and Sabi teaches a short market-maths scenario by voice.",
};

export default function SabiVoiceLayout({ children }: { children: React.ReactNode }) {
  return <SabiFrame>{children}</SabiFrame>;
}
