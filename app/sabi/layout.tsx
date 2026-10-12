import SabiFrame from "@/components/sabi/SabiFrame";
import type { Metadata } from "next";
import {
  SABI_URL,
  jsonLdGraph,
  organizationNode,
  sabiFaqNode,
  sabiProductNode,
  sabiVideoNode,
} from "@/lib/seo";

export const metadata: Metadata = {
  // `absolute` so the brand name isn't repeated by the "%s | Sabi" template.
  title: {
    absolute: "Sabi — the AI tutor children reach by phone call",
  },
  description:
    'Sabi (/sah-bee/, "to know" in Nigerian Pidgin) is an AI tutor a child reaches by calling a phone number. Foundational reading and maths in five-minute spoken lessons — no smartphone, no internet, no data. An initiative of Education for Equality.',
  // The Sabi pages are served on both eduforequality.org/sabi and the sabi.
  // subdomain; the subdomain is the one canonical home for the product.
  alternates: { canonical: SABI_URL },
  openGraph: {
    url: SABI_URL,
    siteName: "Sabi",
    title: "Sabi — the AI tutor children reach by phone call",
    description:
      "An AI tutor any child can reach by calling a phone number. No smartphone. No internet.",
  },
  twitter: {
    title: "Sabi — the AI tutor children reach by phone call",
    description:
      "An AI tutor any child can reach by calling a phone number. No smartphone. No internet.",
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
      "Sabi is an AI tutor children reach by calling an ordinary phone number.",
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
      <SabiFrame>{children}</SabiFrame>
    </>
  );
}
