import type { ReactNode } from "react";

export type SectionTone = "paper" | "white" | "yellow" | "green" | "ink";

const TONE_CLASS: Record<SectionTone, string> = {
  paper: "sabi-tone-paper",
  white: "sabi-tone-white",
  yellow: "sabi-tone-yellow",
  green: "sabi-tone-green",
  ink: "sabi-tone-ink",
};

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`max-w-7xl mx-auto px-5 md:px-8 ${className}`}>{children}</div>;
}

export function Section({
  children,
  tone = "white",
  id,
  className = "",
  containerClassName = "",
  bare = false,
}: {
  children: ReactNode;
  tone?: SectionTone;
  id?: string;
  className?: string;
  containerClassName?: string;
  /** Skip the default container and vertical rhythm (for full-bleed content). */
  bare?: boolean;
}) {
  return (
    <section id={id} className={`${TONE_CLASS[tone]} ${className}`}>
      {bare ? children : <Container className={`py-20 md:py-28 ${containerClassName}`}>{children}</Container>}
    </section>
  );
}

/** Mono index label + headline, laid out on the site's two-column grid. */
export function SectionHead({
  index,
  title,
  lede,
  className = "",
}: {
  index: string;
  title: ReactNode;
  lede?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`sabi-section-head ${className}`}>
      <p className="sabi-section-index">{index}</p>
      <div>
        <h2 className="sabi-display sabi-h2 max-w-4xl">{title}</h2>
        {lede && <p className="sabi-lede mt-5 max-w-2xl">{lede}</p>}
      </div>
    </div>
  );
}
