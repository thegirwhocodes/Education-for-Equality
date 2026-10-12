import SabiShell from "@/components/sabi/SabiShell";
import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import {
  SABI_URL,
  jsonLdGraph,
  organizationNode,
  sabiFaqNode,
  sabiProductNode,
  sabiVideoNode,
} from "@/lib/seo";
import "./sabi-shell.css";

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

export const metadata: Metadata = {
  // `absolute` so the brand name isn't repeated by the "%s | Sabi" template.
  title: {
    absolute: "Sabi — the free AI tutor children reach by phone call",
  },
  description:
    'Sabi (/sah-bee/, "to know" in Nigerian Pidgin) is a free AI tutor a child reaches by calling a phone number. Foundational reading and maths in five-minute spoken lessons — no smartphone, no internet, no data. Built by Education for Equality.',
  // The Sabi pages are served on both eduforequality.org/sabi and the sabi.
  // subdomain; the subdomain is the one canonical home for the product.
  alternates: { canonical: SABI_URL },
  openGraph: {
    url: SABI_URL,
    siteName: "Sabi",
    title: "Sabi — the free AI tutor children reach by phone call",
    description:
      "An AI tutor any child can reach by calling a phone number. No smartphone. No internet. No cost.",
  },
  twitter: {
    title: "Sabi — the free AI tutor children reach by phone call",
    description:
      "An AI tutor any child can reach by calling a phone number. No smartphone. No internet. No cost.",
  },
};

const jsonLd = jsonLdGraph([
  organizationNode,
  sabiProductNode,
  sabiVideoNode,
  sabiFaqNode,
  {
    "@type": "WebSite",
    "@id": `${SABI_URL}/#website`,
    url: SABI_URL,
    name: "Sabi",
    alternateName: "Sabi — Education for Equality",
    description:
      "Sabi is a free AI tutor children reach by calling an ordinary phone number.",
    publisher: { "@id": organizationNode["@id"] },
    about: { "@id": sabiProductNode["@id"] },
    inLanguage: "en",
  },
]);

export default function SabiLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <SabiShell className={`${display.variable} ${body.variable} ${mono.variable}`}>{children}</SabiShell>
    </>
  );
}
