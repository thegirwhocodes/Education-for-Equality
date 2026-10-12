import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { CallRings } from "@/components/sabi/marketing/FeaturePhone";
import { ArrowIcon, MicIcon } from "@/components/sabi/marketing/Icons";
import { Container } from "@/components/sabi/marketing/Section";
import { FOUNDER_QUOTE } from "@/lib/sabi/content";
import { SABI_FAQS } from "@/lib/seo";
import { CONTACT_EMAIL, SABI_ROUTES } from "@/lib/sabi/site";

/** The product's two entry points: voice demo first, chat second. */
export function TryButtons({ onDark = false }: { onDark?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-5">
      <Link href={SABI_ROUTES.talk} className={`${onDark ? "sabi-btn-gold" : "sabi-btn-primary"} px-7 py-4 text-base`}>
        <MicIcon />
        Talk to Sabi
      </Link>
      <Link href={SABI_ROUTES.chat} className={`sabi-text-link text-base ${onDark ? "text-white" : ""}`}>
        Or chat with Sabi <ArrowIcon size={16} />
      </Link>
    </div>
  );
}

export function CtaBand({
  title = <>Go on, give Sabi a&nbsp;call.</>,
  lede = "Hear what a lesson sounds like, right here in your browser.",
  actions = <TryButtons />,
}: {
  title?: ReactNode;
  lede?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="sabi-final-cta">
      <div className="absolute right-[-120px] top-1/2 hidden md:block">
        <CallRings sizes={[260, 400, 540, 680, 820]} pulse={260} />
      </div>
      <Container className="relative py-24 md:py-32">
        <h2 className="sabi-display sabi-hero-title max-w-4xl">{title}</h2>
        <p className="mt-6 text-lg md:text-xl max-w-xl text-[var(--sabi-ink-soft)]">{lede}</p>
        <div className="mt-9">{actions}</div>
      </Container>
    </section>
  );
}

/** "Up next" link at the foot of a subpage, so each page leads into the next. */
export function NextPage({ href, label, title }: { href: string; label: string; title: string }) {
  return (
    <Link href={href} className="sabi-next-page group">
      <Container className="py-10 md:py-14 flex items-center justify-between gap-6">
        <span>
          <span className="sabi-eyebrow block">{label}</span>
          <span className="sabi-display block mt-2 text-3xl md:text-5xl">{title}</span>
        </span>
        <span className="sabi-next-arrow" aria-hidden="true">
          <ArrowIcon size={28} />
        </span>
      </Container>
    </Link>
  );
}

export function QuoteBand() {
  return (
    <section className="sabi-photo-band">
      <Image
        src="/partner-child.jpg"
        alt="A smiling girl in a classroom holds a chalk slate above her head"
        fill
        sizes="100vw"
        className="object-cover object-[60%_30%]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/10 to-transparent" />
      <Container className="relative py-20 md:py-28 flex items-end min-h-[560px]">
        <blockquote className="sabi-quote-card max-w-xl p-8 md:p-10">
          <span className="sabi-quote-mark block" aria-hidden="true">
            &ldquo;
          </span>
          <p className="sabi-display text-2xl md:text-[1.9rem] !font-semibold !leading-[1.15] !tracking-tight mt-2">
            {FOUNDER_QUOTE}
          </p>
          <footer className="mt-6 flex items-center gap-3">
            <Image
              src="/founder-naomi.png"
              alt=""
              width={44}
              height={44}
              className="rounded-full object-cover w-11 h-11 border-[1.5px] border-[var(--sabi-ink)]"
            />
            <span className="text-sm">
              <strong className="font-semibold">Naomi Ivie</strong>
              <span className="block text-[var(--sabi-ink-soft)]">Founder, Education for Equality</span>
            </span>
          </footer>
        </blockquote>
      </Container>
    </section>
  );
}

export function DevCallout() {
  return (
    <div className="sabi-dev-callout grid lg:grid-cols-12 gap-10 p-8 md:p-12">
      <div className="lg:col-span-5">
        <p className="sabi-eyebrow !text-[var(--sabi-yellow)]">For developers &amp; organisations</p>
        <h3 className="sabi-display !text-white text-3xl md:text-4xl mt-4">Build on the voice behind Sabi.</h3>
        <p className="mt-4 text-white/70 leading-relaxed">
          The same African-accent pipeline, rentable per minute: speech-to-text, LLM and a Nigerian voice in one
          call. From $0.06 a minute, with 1,000 minutes free every month.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-5">
          <Link href={SABI_ROUTES.pricing} className="sabi-btn-gold px-6 py-3 text-sm">
            See pricing <ArrowIcon size={16} />
          </Link>
          <Link href={SABI_ROUTES.developers} className="sabi-text-link text-sm text-white">
            Request access
          </Link>
        </div>
      </div>
      <pre className="sabi-dev-code lg:col-span-7 self-center p-6 overflow-x-auto" aria-label="Example API request">
        <code>
          <span className="tok-c"># One request: audio in, Nigerian voice out</span>
          {"\n"}
          <span className="tok-k">curl</span> https://api.eduforequality.org/v1/voice/process \{"\n"}
          {"  "}-H <span className="tok-s">&quot;Authorization: Bearer sk_sabi_...&quot;</span> \{"\n"}
          {"  "}-d <span className="tok-s">&apos;{"{"}&quot;audio&quot;: &quot;base64_encoded_audio&quot;,</span>
          {"\n"}
          {"       "}
          <span className="tok-s">&quot;voice&quot;: &quot;bukola&quot;,</span>
          {"\n"}
          {"       "}
          <span className="tok-s">&quot;language&quot;: &quot;en-NG&quot;{"}"}&apos;</span>
        </code>
      </pre>
    </div>
  );
}

/**
 * The visible source of the FAQPage structured data in app/sabi/layout.tsx.
 * Both render from SABI_FAQS so the markup and the schema stay identical.
 */
export function FaqList({ questions }: { questions?: string[] }) {
  const faqs = questions ? SABI_FAQS.filter((f) => questions.includes(f.question)) : SABI_FAQS;
  return (
    <div className="sabi-faq">
      {faqs.map((faq, i) => (
        <details key={faq.question} open={i === 0}>
          <summary>
            {faq.question}
            <span className="sabi-faq-toggle" aria-hidden="true" />
          </summary>
          <p className="pb-6 -mt-1 pr-12 text-[var(--sabi-ink-soft)] leading-relaxed">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}

export function FaqSection({ index, questions }: { index: string; questions?: string[] }) {
  return (
    <section className="sabi-tone-white border-t border-[var(--sabi-border)]">
      <Container className="py-20 md:py-28 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="sabi-section-index max-w-[220px]">{index}</p>
            <h2 className="sabi-display sabi-h2 mt-8">Common questions about Sabi</h2>
            <p className="mt-5 text-[var(--sabi-muted)]">
              Something else? Write to{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4 text-[var(--sabi-ink)]">
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <FaqList questions={questions} />
        </div>
      </Container>
    </section>
  );
}

const AUDIENCES = [
  {
    href: SABI_ROUTES.families,
    who: "For families",
    title: "Five minutes a day, on the phone you have.",
    body: "What a call is like, what it costs (nothing), and how Sabi keeps your child safe.",
    tone: "yellow",
  },
  {
    href: SABI_ROUTES.partners,
    who: "For schools & funders",
    title: "Bring Sabi to a whole community.",
    body: "Host a pilot cohort, sponsor children, keep the line open, or evaluate it with us.",
    tone: "green",
  },
  {
    href: SABI_ROUTES.pricing,
    who: "For developers",
    title: "Rent the African voice pipeline.",
    body: "Speech-to-text, tutor LLM and a Nigerian voice in one API. 1,000 minutes free a month.",
    tone: "ink",
  },
] as const;

export function AudienceGrid() {
  return (
    <div className="grid md:grid-cols-3 gap-5">
      {AUDIENCES.map((a) => (
        <Link key={a.href} href={a.href} className={`sabi-audience-card sabi-tone-${a.tone} group`}>
          <span className="sabi-eyebrow sabi-audience-who">{a.who}</span>
          <span className="sabi-display block text-3xl mt-10 !leading-[1.05]">{a.title}</span>
          <span className="block mt-4 text-[15px] leading-relaxed sabi-audience-body">{a.body}</span>
          <span className="sabi-audience-arrow mt-10" aria-hidden="true">
            <ArrowIcon size={20} />
          </span>
        </Link>
      ))}
    </div>
  );
}
