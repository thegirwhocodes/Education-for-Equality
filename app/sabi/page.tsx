import Link from "next/link";
import CallTranscript from "@/components/sabi/marketing/CallTranscript";
import { NumberedSteps, PhoneCoverage, Principles, ProblemStats } from "@/components/sabi/marketing/DataBlocks";
import { CallScene } from "@/components/sabi/marketing/FeaturePhone";
import { ArrowIcon } from "@/components/sabi/marketing/Icons";
import { AudienceGrid, CtaBand, DevCallout, FaqSection, QuoteBand, TryButtons } from "@/components/sabi/marketing/Blocks";
import { Container, Section, SectionHead } from "@/components/sabi/marketing/Section";
import { PILOT } from "@/lib/sabi/content";
import { SABI_ROUTES } from "@/lib/sabi/site";

function MoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="sabi-text-link mt-12 text-base">
      {children} <ArrowIcon size={16} />
    </Link>
  );
}

export default function SabiHome() {
  return (
    <div className="flex-1">
      <section className="sabi-landing-hero">
        <Container className="pt-14 pb-16 md:pt-20 md:pb-24 grid lg:grid-cols-12 gap-12 lg:gap-6 items-center">
          <div className="lg:col-span-7 relative z-10">
            <span className="sabi-pill">
              <span className="sabi-live-dot" />
              {PILOT.where} pilot · {PILOT.when}
            </span>
            <h1 className="sabi-display sabi-hero-title mt-7">
              The tutor who picks up the <em>phone.</em>
            </h1>
            <p className="mt-7 text-lg md:text-xl leading-relaxed max-w-xl text-[var(--sabi-ink-soft)]">
              Sabi teaches children to read and count in five-minute phone calls. It works on any handset, needs no
              internet, and is free for every family.
            </p>
            <div className="mt-9">
              <TryButtons />
            </div>
            <dl className="sabi-definition mt-14 max-w-md flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <dt className="sabi-display text-2xl">sa·bi</dt>
              <dd className="sabi-mono text-sm">/sah-bee/</dd>
              <dd className="text-sm text-[var(--sabi-ink-soft)] w-full">
                <span className="italic">Nigerian Pidgin.</span> To know; to understand.
              </dd>
            </dl>
          </div>
          <div className="lg:col-span-5">
            <CallScene />
          </div>
        </Container>
      </section>

      <section className="sabi-nos">
        <ul className="max-w-7xl mx-auto px-5 md:px-8 py-7 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 text-2xl md:text-4xl">
          {["No smartphone", "No internet", "No data", "No cost"].map((item, i) => (
            <li key={item} className="flex items-center gap-8">
              {i > 0 && (
                <span className="hidden md:inline-block w-2.5 h-2.5 rounded-full bg-[var(--sabi-yellow)]" aria-hidden="true" />
              )}
              {item}
            </li>
          ))}
        </ul>
      </section>

      <Section tone="white">
        <SectionHead index="01 — The problem" title="Children spend years in school and still can't read a sentence." />
        <div className="mt-16 md:mt-20">
          <ProblemStats />
        </div>
        <MoreLink href={SABI_ROUTES.evidence}>See the evidence</MoreLink>
      </Section>

      <Section tone="green" containerClassName="grid lg:grid-cols-12 gap-14 lg:gap-8">
        <div className="lg:col-span-6">
          <p className="sabi-section-index max-w-[220px]">02 — The insight</p>
          <h2 className="sabi-display sabi-h2 mt-8">The answer is already in their pocket.</h2>
          <p className="mt-6 text-lg leading-relaxed text-white/75 max-w-lg">
            600 million people in Africa have no internet. But almost every family already owns something that can
            make a call. So we built a tutor for the network that already exists.
          </p>
        </div>
        <div className="lg:col-span-5 lg:col-start-8 flex flex-col justify-end">
          <PhoneCoverage />
        </div>
      </Section>

      <Section tone="paper" id="how-it-works">
        <SectionHead index="03 — How it works" title="A child dials a number. Sabi does the rest." />
        <div className="mt-16 grid lg:grid-cols-12 gap-14 lg:gap-10 items-start">
          <div className="lg:col-span-5">
            <NumberedSteps />
            <MoreLink href={SABI_ROUTES.howItWorks}>Inside a lesson</MoreLink>
          </div>
          <div className="lg:col-span-7 lg:pl-6">
            <CallTranscript />
          </div>
        </div>
      </Section>

      <Section tone="white">
        <SectionHead index="04 — Who it's for" title="One phone line, three ways in." />
        <div className="mt-16">
          <AudienceGrid />
        </div>
      </Section>

      <QuoteBand />

      <Section tone="paper">
        <SectionHead index="05 — Built for the last mile" title="Designed for the child furthest from a classroom." />
        <div className="mt-16">
          <Principles />
        </div>
        <div className="mt-20 md:mt-28">
          <DevCallout />
        </div>
      </Section>

      <FaqSection index="06 — Questions" />

      <CtaBand />
    </div>
  );
}
