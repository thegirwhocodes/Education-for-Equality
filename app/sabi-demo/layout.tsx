import type { Metadata } from "next";
import SabiFrame from "@/components/sabi/SabiFrame";

export const metadata: Metadata = {
  title: { absolute: "Chat with Sabi | Sabi" },
  description: "Try a Sabi lesson by text and by voice side by side. Both channels share one memory of the learner.",
};

export default function SabiChatLayout({ children }: { children: React.ReactNode }) {
  return <SabiFrame>{children}</SabiFrame>;
}
