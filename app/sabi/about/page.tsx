import Image from "next/image";
import { CtaBand, NextPage } from "@/components/sabi/marketing/Blocks";
import PageHeader from "@/components/sabi/marketing/PageHeader";
import { Container, Section, SectionHead } from "@/components/sabi/marketing/Section";
import { ADVISORS, FOUNDER_STORY } from "@/lib/sabi/content";
import { sabiPageMetadata } from "@/lib/sabi/metadata";
import { SABI_ROUTES } from "@/lib/sabi/site";
import { AWARDS } from "@/lib/seo";

export const metadata = sabiPageMetadata({
  path: "/about",
  title: "About Sabi — built in Lagos by Education for Equality",
  description:
    "Why Naomi Ivie started Education for Equality, what the name Sabi means, and the advisors and programmes behind the phone tutor.",
});

export default function AboutPage() {
  return (
    <div className="flex-1">
      <PageHeader
        eyebrow="About"
        tone="paper"
        title="Built for the children we grew up beside."
        lede="Sabi is made by Education for Equality, a 501(c)(3) nonprofit, and built for Lagos first. Our job is simple to say and hard to do: every child should be able to read and count."
      />

      <section className="sabi-tone-white">
        <Container className="py-20 md:py-28 grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="sabi-portrait">
              <Image
                src="/founder-naomi.png"
                alt="Naomi Ivie, founder of Education for Equality"
                width={646}
                height={550}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            <p className="mt-5 font-semibold">Naomi Ivie</p>
            <p className="text-sm text-[var(--sabi-muted)]">Founder, Education for Equality</p>
          </div>
          <div className="lg:col-span-7">
            <p className="sabi-section-index max-w-[220px]">01 — Why I started this</p>
            <div className="sabi-story mt-8">
              {FOUNDER_STORY.map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Section tone="yellow" containerClassName="grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6">
          <p className="sabi-section-index max-w-[220px]">02 — The name</p>
          <p className="sabi-display sabi-name mt-8">sa·bi</p>
        </div>
        <div className="lg:col-span-6">
          <p className="sabi-mono text-lg">/sah-bee/ · Nigerian Pidgin</p>
          <p className="sabi-display text-3xl md:text-4xl mt-4 !leading-[1.1]">
            To know. To understand. To be good at something.
          </p>
          <p className="mt-6 text-lg text-[var(--sabi-ink-soft)] max-w-lg">
            We wanted a name a child in Lagos already uses, not one we had to explain. When a child says &ldquo;I
            sabi&rdquo;, that&apos;s the whole point.
          </p>
        </div>
      </Section>

      <Section tone="white">
        <SectionHead
          index="03 — Advisors"
          title="People who have run schools at scale."
          lede="Our advisors include these three, and four more across law, governance and technology: over 100 combined years of experience."
        />
        <ul className="mt-16 grid md:grid-cols-3 gap-8">
          {ADVISORS.map((a) => (
            <li key={a.name} className="sabi-principle">
              <p className="sabi-display text-2xl !font-semibold">{a.name}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--sabi-ink-soft)]">{a.role}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="ink">
        <SectionHead index="04 — Recognition" title="Where the work has been tested." />
        <ul className="mt-16 sabi-award-list">
          {AWARDS.map((award) => {
            const [org, honour] = award.split(" — ");
            return (
              <li key={award}>
                <span>{org}</span>
                <span className="sabi-display">{honour.charAt(0).toUpperCase() + honour.slice(1)}</span>
              </li>
            );
          })}
        </ul>
      </Section>

      <NextPage href={SABI_ROUTES.partners} label="Next" title="Work with us" />
      <CtaBand />
    </div>
  );
}
