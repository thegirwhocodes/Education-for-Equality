import type { ReactNode } from "react";
import { Container, type SectionTone } from "@/components/sabi/marketing/Section";

/** The opening band of every Sabi subpage. */
export default function PageHeader({
  eyebrow,
  title,
  lede,
  tone = "paper",
  aside,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  tone?: SectionTone;
  /** Rendered in the right-hand column on large screens. */
  aside?: ReactNode;
  /** Rendered under the lede (CTAs, meta). */
  children?: ReactNode;
}) {
  return (
    <header className={`sabi-page-header sabi-tone-${tone}`}>
      <Container className="pt-16 pb-16 md:pt-24 md:pb-24 grid lg:grid-cols-12 gap-12 lg:gap-8 items-end">
        <div className={aside ? "lg:col-span-7" : "lg:col-span-10"}>
          <p className="sabi-eyebrow sabi-page-eyebrow">{eyebrow}</p>
          <h1 className="sabi-display sabi-page-title mt-6">{title}</h1>
          {lede && <p className="sabi-page-lede mt-7 max-w-2xl">{lede}</p>}
          {children && <div className="mt-9">{children}</div>}
        </div>
        {aside && <div className="lg:col-span-5">{aside}</div>}
      </Container>
    </header>
  );
}
