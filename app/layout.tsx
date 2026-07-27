import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PendingLearnerProfileSync from "@/components/auth/PendingLearnerProfileSync";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://eduforequality.org";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Sabi — AI Education Agent & Phone-Call AI Tutor | Education for Equality",
    template: "%s | Sabi — Education for Equality",
  },
  description:
    "Sabi is an AI education agent that tutors children over an ordinary phone call — no internet, no smartphone, and no data needed. A voice AI tutor delivering foundational literacy and numeracy to underprivileged children across Nigeria and Africa. Built by Education for Equality.",
  applicationName: "Sabi",
  category: "education",
  authors: [{ name: "Education for Equality" }],
  creator: "Education for Equality",
  publisher: "Education for Equality",
  keywords: [
    // Product core
    "Sabi",
    "Sabi AI",
    "Sabi AI tutor",
    "AI education agent",
    "AI education agent for kids",
    "phone call AI",
    "phone-call AI tutor",
    "AI tutor over the phone",
    "AI teacher on the phone",
    "call to learn",
    "voice AI tutor",
    "voice-based tutoring",
    "conversational AI tutor",
    "spoken AI tutor",
    "AI phone tutor",
    "AI that teaches over a phone call",
    // No-internet / access
    "offline AI education",
    "no internet learning",
    "learn without internet",
    "works on any phone",
    "feature phone education",
    "basic phone learning",
    "AI tutor no smartphone",
    "AI tutor no data",
    "IVR education",
    "telephony AI tutor",
    // Subject / pedagogy
    "AI literacy tutor",
    "AI numeracy tutor",
    "AI phonics tutor",
    "foundational literacy AI",
    "foundational numeracy AI",
    "AI reading tutor for children",
    "AI math tutor for kids",
    // Geography / mission
    "AI education Africa",
    "AI tutor Nigeria",
    "AI education Nigeria",
    "EdTech Africa",
    "AI tutor for underprivileged children",
    "free AI tutor",
    "education for equality",
    "Education for Equality Nigeria",
    "AI education for out-of-school children",
    "AI tutor for rural children",
    "Cambridge-aligned AI tutor",
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Sabi — Education for Equality",
    title:
      "Sabi — The AI Education Agent That Tutors Children Over a Phone Call",
    description:
      "No internet. No smartphone. Just a phone call. Sabi is a voice AI tutor teaching foundational literacy and numeracy to children across Nigeria and Africa.",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Sabi — AI Education Agent & Phone-Call AI Tutor",
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
    },
  },
  icons: {
    icon: "/icon.svg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: "Education for Equality",
      url: SITE_URL,
      description:
        "Education for Equality builds Sabi, an AI education agent that tutors children over a phone call — reaching learners with no internet or smartphone.",
      areaServed: ["Nigeria", "Africa"],
      slogan: "Quality education for every child, over any phone.",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Sabi — Education for Equality",
      publisher: { "@id": `${SITE_URL}/#org` },
    },
    {
      "@type": "SoftwareApplication",
      name: "Sabi",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Any phone (voice call — no app, no internet)",
      url: SITE_URL,
      description:
        "Sabi is an AI education agent — a voice AI tutor that delivers foundational literacy and numeracy to children over an ordinary phone call, with no internet, smartphone, or data required.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@id": `${SITE_URL}/#org` },
    },
  ],
};

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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
