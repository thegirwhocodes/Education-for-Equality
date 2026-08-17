import type { Metadata } from "next";
import { SITE_URL, orgOpenGraph } from "@/lib/seo";

// The page itself is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "Reading assessments — Cambridge-aligned comprehension practice",
  description:
    "Cambridge-aligned reading comprehension assessments from Education for Equality, the nonprofit behind Sabi.",
  alternates: { canonical: `${SITE_URL}/reading` },
  openGraph: orgOpenGraph("/reading"),
};

export default function ReadingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
