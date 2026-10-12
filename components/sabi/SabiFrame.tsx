import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import SabiShell from "@/components/sabi/SabiShell";
import "@/app/sabi/sabi-shell.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--sabi-font-display",
  display: "swap",
});

const body = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--sabi-font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--sabi-font-mono",
  display: "swap",
});

export const sabiFontVariables = `${display.variable} ${body.variable} ${mono.variable}`;

/** Sabi nav, footer, fonts and design tokens. Wrap any route that should look like Sabi. */
export default function SabiFrame({ children }: { children: React.ReactNode }) {
  return <SabiShell className={sabiFontVariables}>{children}</SabiShell>;
}
