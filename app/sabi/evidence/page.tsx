import { EvidenceList, PhoneCoverage, ProblemStats } from "@/components/sabi/marketing/DataBlocks";
import { CtaBand, NextPage } from "@/components/sabi/marketing/Blocks";
import PageHeader from "@/components/sabi/marketing/PageHeader";
import { Section, SectionHead } from "@/components/sabi/marketing/Section";
import { BENCHMARKS, PILOT, PILOT_MEASURES } from "@/lib/sabi/content";
import { sabiPageMetadata } from "@/lib/sabi/metadata";
import { SABI_ROUTES } from "@/lib/sabi/site";

export const metadata = sabiPageMetadata({
  path: "/evidence",
  title: "The evidence behind Sabi — research, benchmarks and the Lagos pilot",
  description:
    "The learning crisis in Nigeria, the research behind every Sabi design choice, the phone-tutoring results we measure ourselves against, and what the Lagos pilot will report.",
});

export default function EvidencePage() {
  return (
    <div className="flex-1">
      <PageHeader
        eyebrow="Evidence"
        tone="green"
        title="Built on research. Judged on results."
        lede="Every design choice in Sabi traces back to a study. And from the first pilot call, Sabi is measured against the best phone-tutoring programmes in the world."
      />

      <Section tone="white">
        <SectionHead index="01 — The problem" title="Years in school, not years of learning." />
        <div className="mt-16 md:mt-20">
          <ProblemStats />
        </div>
      </Section>

      <Section tone="green" containerClassName="grid lg:grid-cols-12 gap-14 lg:gap-8">
        <div className="lg:col-span-6">
          <p className="sabi-section-index max-w-[220px]">02 — The channel</p>
          <h2 className="sabi-display sabi-h2 mt-8">Why a phone call, and not an app.</h2>
          <p className="mt-6 text-lg leading-relaxed text-white/75 max-w-lg">
            600 million people in Africa have no internet. A voice call over 2G reaches nearly everyone, on the phone
            they already own, with nothing to install.
          </p>
        </div>
        <div className="lg:col-span-5 lg:col-start-8 flex flex-col justify-end">
          <PhoneCoverage />
        </div>
      </Section>

      <Section tone="white">
        <SectionHead
          index="03 — Design choices"
          title="Every choice has a study behind it."
          lede="Research from Nigeria, Ghana, Tanzania, Madagascar and global randomised trials."
        />
        <div className="mt-16">
          <EvidenceList showInforms />
        </div>
      </Section>

      <Section tone="paper">
        <SectionHead
          index="04 — The bar"
          title="What good looks like."
          lede="Published results from phone and chat tutoring. These are the numbers Sabi's pilot will be read against."
        />
        <div className="mt-16 sabi-table-wrap">
          <table className="sabi-table">
            <thead>
              <tr>
                <th scope="col">Programme</th>
                <th scope="col">Learning gain</th>
                <th scope="col">Cost</th>
                <th scope="col">Dose</th>
              </tr>
            </thead>
            <tbody>
              {BENCHMARKS.map((b) => (
                <tr key={b.name}>
                  <th scope="row">{b.name}</th>
                  <td className="sabi-display text-2xl">{b.effect}</td>
                  <td>{b.cost}</td>
                  <td className="text-[var(--sabi-muted)]">{b.dose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="sabi-source mt-5">SD = standard deviations of learning gain. Teaching at the Right Level shows readers before → after.</p>
      </Section>

      <Section tone="white">
        <SectionHead
          index="05 — The pilot"
          title={`${PILOT.where}, ${PILOT.when}. Here's what we'll report.`}
          lede={`${PILOT.size} ${PILOT.detail}. Every number below comes from consented children only, with no raw child audio in any export.`}
        />
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {PILOT_MEASURES.map((m, i) => (
            <div key={m.title} className="sabi-principle">
              <span className="sabi-mono text-xs text-[var(--sabi-muted)]">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="sabi-display text-2xl !font-semibold mt-3">{m.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--sabi-ink-soft)]">{m.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <NextPage href={SABI_ROUTES.families} label="Next" title="What it's like for a family" />
      <CtaBand />
    </div>
  );
}
