import SabiShell from "@/components/sabi/SabiShell";
import type { Metadata } from "next";
import "./sabi-shell.css";

export const metadata: Metadata = {
  title: "Sabi — AI tutor by phone",
  description:
    "An AI tutor any child can reach by calling a phone number. No smartphone. No internet. No cost.",
};

export default function SabiLayout({ children }: { children: React.ReactNode }) {
  return <SabiShell>{children}</SabiShell>;
}
