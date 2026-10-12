import { NumberedSteps } from "@/components/sabi/marketing/DataBlocks";
import { CtaBand, FaqSection, NextPage, TryButtons } from "@/components/sabi/marketing/Blocks";
import PageHeader from "@/components/sabi/marketing/PageHeader";
import { Section, SectionHead } from "@/components/sabi/marketing/Section";
import { FAMILY_STEPS, PILOT, SAFETY_POINTS } from "@/lib/sabi/content";
import { sabiPageMetadata } from "@/lib/sabi/metadata";
import { SABI_ROUTES } from "@/lib/sabi/site";

export const metadata = sabiPageMetadata({
  path: "/families",
  title: "Sabi for families — free phone lessons for your child",
  description:
    "How Sabi works for parents: text CALL and Sabi rings your child for a free five-minute reading or maths lesson. What it costs (nothing) and how it keeps children safe.",
});

const FAMILY_FAQS = [
  "Do you need internet or a smartphone to use Sabi?",
  "How much does Sabi cost?",
  "Where does Sabi operate?",
  "What does the name Sabi mean?",
];

export default function FamiliesPage() {
  return (
    <div className="flex-1">
      <PageHeader
        eyebrow="For families"
        tone="yellow"
        title="Five minutes a day, on the phone you already have."
        lede="Sabi gives your child a patient tutor for reading and maths. No smartphone, no data, no fees. Just answer the call and hand them the phone."
        aside={
          <dl className="sabi-fact-card">
            {[
              ["Cost to you", "₦0"],
              ["Lesson length", "5–7 min"],
              ["Phone needed", "Any"],
              ["Internet needed", "None"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd className="sabi-display">{v}</dd>
              </div>
            ))}
          </dl>
        }
      >
        <TryButtons />
      </PageHeader>

      <Section tone="white" containerClassName="grid lg:grid-cols-12 gap-14 lg:gap-10">
        <div className="lg:col-span-5">
          <p className="sabi-section-index max-w-[220px]">01 — Getting a lesson</p>
          <h2 className="sabi-display sabi-h2 mt-8">Three steps. None of them cost money.</h2>
          <p className="sabi-notice mt-8">
            Sabi is in its pre-pilot in {PILOT.where}. Pilot families receive the number directly from us. Want Sabi where you live?{" "}
            <a href="mailto:info@eduforequality.org?subject=Sabi%20for%20my%20family" className="underline underline-offset-4">
              Tell us
            </a>
            .
          </p>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <NumberedSteps steps={FAMILY_STEPS} />
        </div>
      </Section>

      <Section tone="paper">
        <SectionHead
          index="02 — Safety"
          title="Built for children, from the first line of code."
          lede="Sabi talks to children aged 8 to 14. Here is what that means for how it behaves."
        />
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {SAFETY_POINTS.map((p) => (
            <div key={p.title} className="sabi-principle">
              <h3 className="sabi-display text-2xl !font-semibold">{p.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--sabi-ink-soft)]">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="green" containerClassName="grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <p className="sabi-section-index max-w-[220px]">03 — What your child learns</p>
          <h2 className="sabi-display sabi-h2 mt-8">The basics that unlock everything else.</h2>
          <p className="mt-6 text-lg leading-relaxed text-white/75 max-w-xl">
            Foundational reading and maths, taught at your child&apos;s real level, not their class level. If they are
            ahead, Sabi moves faster. If they are stuck, it slows down and tries another way.
          </p>
        </div>
        <ul className="lg:col-span-4 lg:col-start-9 grid gap-3">
          {["Letter sounds & first words", "Reading short sentences", "Counting & place value", "Adding, subtracting, giving change"].map(
            (topic) => (
              <li key={topic} className="sabi-topic">
                {topic}
              </li>
            ),
          )}
        </ul>
      </Section>

      <FaqSection index="04 — Questions" questions={FAMILY_FAQS} />
      <NextPage href={SABI_ROUTES.howItWorks} label="Next" title="See what happens on a call" />
      <CtaBand title="Hear Sabi for yourself." lede="Try a lesson in your browser before your child does." />
    </div>
  );
}
