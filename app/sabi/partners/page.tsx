import Image from "next/image";
import { CtaBand, NextPage } from "@/components/sabi/marketing/Blocks";
import { ArrowIcon } from "@/components/sabi/marketing/Icons";
import PageHeader from "@/components/sabi/marketing/PageHeader";
import { Section, SectionHead } from "@/components/sabi/marketing/Section";
import { PARTNER_LOGOS, PARTNER_WAYS, PILOT, RECOGNITION } from "@/lib/sabi/content";
import { sabiPageMetadata } from "@/lib/sabi/metadata";
import { CONTACT_EMAIL, SABI_ROUTES } from "@/lib/sabi/site";

export const metadata = sabiPageMetadata({
  path: "/partners",
  title: "Partner with Sabi — schools, governments, funders and telecoms",
  description:
    "Bring Sabi to a community: host a pilot cohort, sponsor children at around $2 a year, keep the line open, or evaluate Sabi with us.",
});

const mailto = (subject: string) => `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;

export default function PartnersPage() {
  return (
    <div className="flex-1">
      <PageHeader
        eyebrow="For schools, governments & funders"
        tone="ink"
        title="Bring Sabi to a whole community."
        lede={`Sabi reaches children where schools can't: at home, after dark, on the family phone. The first ${PILOT.where} cohort starts ${PILOT.when}. We're choosing the partners who come with it.`}
      >
        <a href={mailto("Partnering with Sabi")} className="sabi-btn-gold px-7 py-4 text-base">
          Start a conversation <ArrowIcon size={16} />
        </a>
      </PageHeader>

      <Section tone="white">
        <SectionHead index="01 — Ways to partner" title="Four ways in." />
        <div className="mt-16 grid md:grid-cols-2 gap-5">
          {PARTNER_WAYS.map((w, i) => (
            <article key={w.who} className="sabi-way-card">
              <div className="flex items-start justify-between gap-6">
                <p className="sabi-eyebrow">{w.who}</p>
                <span className="sabi-mono text-xs text-[var(--sabi-meta)]">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="sabi-display text-3xl md:text-4xl mt-8">{w.title}</h3>
              <p className="mt-4 text-[var(--sabi-ink-soft)] leading-relaxed max-w-md">{w.body}</p>
              <a href={mailto(w.subject)} className="sabi-text-link mt-8 text-sm">
                {w.cta} <ArrowIcon size={14} />
              </a>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="yellow" containerClassName="grid lg:grid-cols-12 gap-12 items-end">
        <div className="lg:col-span-7">
          <p className="sabi-section-index max-w-[220px]">02 — The maths</p>
          <h2 className="sabi-display sabi-h2 mt-8">About $2 a child, a year.</h2>
          <p className="sabi-lede mt-6 !text-[var(--sabi-ink-soft)] max-w-xl">
            Sabi runs on a self-hosted open-source stack, so the cost of a lesson is the cost of compute and the phone
            line, not a licence.
          </p>
        </div>
        <dl className="lg:col-span-5 sabi-cost-grid">
          {[
            ["$2,000", "≈ 1,000 children for a year"],
            ["$20,000", "≈ 10,000 children"],
            ["$200,000", "≈ 100,000 children"],
          ].map(([amount, reach]) => (
            <div key={amount}>
              <dt className="sabi-display">{amount}</dt>
              <dd>{reach}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section tone="paper">
        <SectionHead index="03 — Recognition" title="Recognised, funded and tested." />
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {RECOGNITION.map((r) => (
            <div key={r.org} className="sabi-principle">
              <p className="sabi-eyebrow">{r.org}</p>
              <p className="sabi-display text-2xl mt-4">{r.title}</p>
              <p className="mt-2 text-sm text-[var(--sabi-ink-soft)]">{r.detail}</p>
            </div>
          ))}
        </div>
        <ul className="sabi-logo-wall mt-16" aria-label="Programmes that back Sabi">
          {PARTNER_LOGOS.map((p) => (
            <li key={p.name}>
              <a href={p.href} target="_blank" rel="noopener noreferrer" aria-label={p.name}>
                <Image src={p.src} alt={p.name} width={p.width} height={p.height} className="max-h-14 w-auto object-contain" />
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <NextPage href={SABI_ROUTES.about} label="Next" title="Who is building Sabi" />
      <CtaBand
        title="Let's put Sabi in your schools."
        lede="Tell us about the children you serve, and we'll tell you honestly whether Sabi is ready for them."
        actions={
          <a href={mailto("Partnering with Sabi")} className="sabi-btn-primary px-7 py-4 text-base">
            Email {CONTACT_EMAIL}
          </a>
        }
      />
    </div>
  );
}
