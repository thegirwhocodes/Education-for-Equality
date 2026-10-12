import CallTranscript from "@/components/sabi/marketing/CallTranscript";
import { NumberedSteps } from "@/components/sabi/marketing/DataBlocks";
import { CallRings, FeaturePhone } from "@/components/sabi/marketing/FeaturePhone";
import { CtaBand, NextPage, TryButtons } from "@/components/sabi/marketing/Blocks";
import PageHeader from "@/components/sabi/marketing/PageHeader";
import { Section, SectionHead } from "@/components/sabi/marketing/Section";
import VideoFacade from "@/components/sabi/marketing/VideoFacade";
import { DEMO_VIDEO_ID, LESSON_ANATOMY, PIPELINE } from "@/lib/sabi/content";
import { sabiPageMetadata } from "@/lib/sabi/metadata";
import { SABI_ROUTES } from "@/lib/sabi/site";

export const metadata = sabiPageMetadata({
  path: "/how-it-works",
  title: "How Sabi works — a five-minute lesson over a phone call",
  description:
    "What happens when a child calls Sabi: the greeting, the lesson, the practice, and the memory that carries it into tomorrow's call. Plus what runs behind the line.",
});

export default function HowItWorksPage() {
  return (
    <div className="flex-1">
      <PageHeader
        eyebrow="How it works"
        tone="yellow"
        title="Five minutes. One idea. Every day."
        lede="A Sabi lesson is a phone call short enough to fit between chores and focused enough to teach one thing properly. Here is what happens on the line, and behind it."
        aside={
          <div className="relative h-[360px] hidden lg:block">
            <div className="absolute left-1/2 top-1/2">
              <CallRings sizes={[260, 380, 500]} pulse={260} />
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.78]">
              <FeaturePhone timer="00:42" label="Warm-up" />
            </div>
          </div>
        }
      >
        <TryButtons />
      </PageHeader>

      <Section tone="white">
        <SectionHead index="01 — The call" title="From dial tone to ‘see you tomorrow’." />
        <div className="mt-16 grid lg:grid-cols-12 gap-14 lg:gap-10 items-start">
          <div className="lg:col-span-5">
            <NumberedSteps />
          </div>
          <div className="lg:col-span-7 lg:pl-6">
            <CallTranscript />
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <SectionHead
          index="02 — Inside a lesson"
          title="Every call has the same shape."
          lede="Children learn faster when they know what's coming. Each lesson follows a fixed rhythm, so the only new thing is the idea itself."
        />
        <ol className="sabi-timeline mt-16">
          {LESSON_ANATOMY.map((step) => (
            <li key={step.minute}>
              <span className="sabi-timeline-time">{step.minute}</span>
              <span className="sabi-timeline-dot" aria-hidden="true" />
              <h3 className="sabi-display text-xl !font-semibold mt-5">{step.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--sabi-ink-soft)]">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="white" containerClassName="grid lg:grid-cols-2 gap-6">
        <div className="sabi-feature-panel sabi-tone-yellow">
          <p className="sabi-eyebrow">Easy to reach</p>
          <h3 className="sabi-display text-3xl md:text-4xl mt-5">Text CALL. Sabi rings you back.</h3>
          <p className="mt-4 text-[var(--sabi-ink-soft)] leading-relaxed max-w-md">
            Families send the word CALL by SMS or WhatsApp, and Sabi calls them. The family never pays for the lesson
            airtime.
          </p>
          <div className="sabi-sms mt-8" aria-hidden="true">
            <span className="sabi-sms-out">CALL</span>
            <span className="sabi-sms-in">Sabi will ring you for a short lesson. You are not charged.</span>
          </div>
        </div>
        <div className="sabi-feature-panel sabi-tone-ink">
          <p className="sabi-eyebrow !text-[var(--sabi-yellow)]">Shared phones</p>
          <h3 className="sabi-display text-3xl md:text-4xl mt-5">One handset, every child.</h3>
          <p className="mt-4 text-white/70 leading-relaxed max-w-md">
            Most families share one phone. Sabi keeps a separate learner for each child on it, so a younger brother
            never inherits his sister&apos;s lessons.
          </p>
          <div className="mt-8 flex flex-wrap gap-3" aria-hidden="true">
            {[
              ["Chidi", "Subtraction"],
              ["Ada", "Letter sounds"],
              ["Emeka", "Counting to 20"],
            ].map(([name, topic]) => (
              <span key={name} className="sabi-learner-chip">
                <strong>{name}</strong>
                {topic}
              </span>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="ink">
        <SectionHead
          index="03 — Behind the line"
          title="Four things happen every time a child speaks."
          lede="Between the child finishing a sentence and Sabi answering, every turn goes through the same four steps."
        />
        <ol className="sabi-pipeline mt-16">
          {PIPELINE.map((p, i) => (
            <li key={p.verb}>
              <span className="sabi-mono text-xs text-white/50">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="sabi-display text-4xl mt-4">{p.verb}</h3>
              <p className="mt-3 text-white/70 leading-relaxed text-[15px]">{p.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="paper" containerClassName="grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-4">
          <p className="sabi-section-index max-w-[220px]">04 — Hear it</p>
          <h2 className="sabi-display sabi-h2 mt-8">Watch the demo.</h2>
          <p className="sabi-lede mt-5">A six-minute walkthrough from Naomi. Or skip it and talk to Sabi yourself.</p>
          <div className="mt-8">
            <TryButtons />
          </div>
        </div>
        <div className="lg:col-span-8">
          <VideoFacade id={DEMO_VIDEO_ID} title="Sabi, an AI tutor a child reaches by phone call" duration="6:10" />
        </div>
      </Section>

      <NextPage href={SABI_ROUTES.evidence} label="Next" title="Why we built it this way" />
      <CtaBand />
    </div>
  );
}
