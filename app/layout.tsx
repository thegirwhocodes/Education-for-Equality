import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PendingLearnerProfileSync from "@/components/auth/PendingLearnerProfileSync";
import {
  SITE_URL,
  founderNode,
  jsonLdGraph,
  organizationNode,
  sabiProductNode,
} from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Sabi — the AI tutor a child reaches by phone call | Education for Equality",
    template: "%s | Sabi",
  },
  description:
    "Sabi is an AI tutor children reach by calling an ordinary phone number — no smartphone, no internet, no data. Built by Education for Equality to teach foundational literacy and numeracy across Nigeria and Africa.",
  applicationName: "Sabi",
  category: "education",
  authors: [{ name: "Education for Equality", url: SITE_URL }],
  creator: "Naomi Ivie",
  publisher: "Education for Equality",
  // Google ignores meta keywords entirely; kept short for the few engines that
  // still read them, rather than as a keyword dump.
  keywords: [
    "Sabi",
    "Sabi AI",
    "Sabi AI tutor",
    "AI tutor over the phone",
    "voice AI tutor",
    "learn without internet",
    "AI education Nigeria",
    "Education for Equality",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Sabi — Education for Equality",
    locale: "en_NG",
    title: "Sabi — the AI tutor a child reaches by phone call",
    description:
      "No internet. No smartphone. Just a phone call. Sabi is a voice AI tutor teaching foundational literacy and numeracy to children across Nigeria and Africa.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sabi — the AI tutor a child reaches by phone call",
    description:
      "A voice AI tutor that teaches children over an ordinary phone call — no internet or smartphone needed. By Education for Equality.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
  },
};

// Entity graph for the whole site. Individual pages declare their own canonical
// URL — deliberately *not* set here, because a canonical in the root layout is
// inherited by every route and collapses the entire site onto one URL.
const jsonLd = jsonLdGraph([
  organizationNode,
  founderNode,
  sabiProductNode,
  {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "Education for Equality",
    description:
      "Education for Equality is the nonprofit behind Sabi, an AI tutor children reach by phone call.",
    publisher: { "@id": organizationNode["@id"] },
    inLanguage: "en",
  },
]);

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
        <PendingLearnerProfileSync />
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
