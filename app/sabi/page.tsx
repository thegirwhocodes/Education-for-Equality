import Image from "next/image";
import Link from "next/link";
import { SABI_FAQS } from "@/lib/seo";

function ArrowIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}

const KEYS = [
  ["1", ""],
  ["2", "abc"],
  ["3", "def"],
  ["4", "ghi"],
  ["5", "jkl"],
  ["6", "mno"],
  ["7", "pqrs"],
  ["8", "tuv"],
  ["9", "wxyz"],
  ["*", ""],
  ["0", "+"],
  ["#", ""],
];

const WAVE = [6, 14, 22, 12, 26, 18, 30, 16, 24, 10, 20, 28, 14, 8, 18, 24, 12, 6];

function FeaturePhone() {
  return (
    <div className="sabi-phone" aria-hidden="true">
      <div className="sabi-phone-speaker" />
      <div className="sabi-phone-screen">
        <div className="flex items-center justify-between text-[9px] tracking-wider">
          <span>▮▮▮▯ 2G</span>
          <span>▭ 64%</span>
        </div>
        <p className="mt-3 text-[10px] tracking-[0.14em] uppercase opacity-70">Calling</p>
        <p className="text-[26px] font-medium leading-none tracking-tight" style={{ fontFamily: "var(--sabi-font-display)" }}>
          Sabi
        </p>
        <div className="sabi-phone-bars mt-3">
          {WAVE.map((h, i) => (
            <i key={i} style={{ height: h, animationDelay: `${(i % 6) * 0.12}s` }} />
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px]">
          <span>02:41</span>
          <span className="opacity-70">Lesson 4</span>
        </div>
      </div>
      <div className="sabi-phone-softkeys">
        <span style={{ background: "#2a332d" }} />
        <span style={{ background: "var(--sabi-coral)" }} />
      </div>
      <div className="sabi-phone-keys">
        {KEYS.map(([n, l]) => (
          <div key={n} className="sabi-phone-key">
            {n}
            {l && <small>{l}</small>}
          </div>
        ))}
      </div>
    </div>
  );
}

function Rings({ sizes, pulse }: { sizes: number[]; pulse?: number }) {
  return (
    <div className="sabi-rings" aria-hidden="true">
      {sizes.map((s) => (
        <span key={s} style={{ width: s, height: s }} />
      ))}
      {pulse && <span className="sabi-ring-pulse" style={{ width: pulse, height: pulse }} />}
    </div>
  );
}

const STEPS = [
  { title: "A child calls the number", desc: "Any phone works, even a $5 feature phone. No app, no data, no account." },
  { title: "Sabi greets them by name", desc: "New callers introduce themselves once. Returning callers are recognised instantly." },
  { title: "A lesson begins", desc: "Taught at the child's actual level, using things they know: the market, Naira, everyday Lagos life." },
  { title: "Five to seven minutes, one idea", desc: "Short, focused calls. Harder when the child is ready, slower when they struggle." },
  { title: "They call back tomorrow", desc: "Sabi remembers their name, their level and their mistakes, and picks up where they left off." },
];

const CALL = [
  { t: "00:03", who: "Sabi", text: "Hello! My name is Sabi. What is your name?" },
  { t: "00:07", who: "Child", text: "Chidi." },
  { t: "00:09", who: "Sabi", text: "Hi Chidi! Do you ever help your family at the market?" },
  { t: "00:14", who: "Child", text: "Yes, I sell groundnuts." },
  { t: "00:17", who: "Sabi", text: "Ah, you know business! If a customer gives you ₦500, and groundnuts cost ₦350, how much change do you give back?" },
  { t: "00:29", who: "Child", text: "150." },
  { t: "00:31", who: "Sabi", text: "You got it! You already know maths, Chidi — you just don't know you know it. Now let me show you how they write that in school…" },
];

const EVIDENCE = [
  {
    stat: "9×",
    title: "Market maths beats abstract maths",
    desc: "Children solved comparable subtraction tasks nine times more often when framed as a market sale than in school format (48.5% vs 5.4%).",
    cite: "Weber, Bogler & Vollmer 2024 · North-West Nigeria",
  },
  {
    stat: "1.5–2 yrs",
    title: "of learning in six weeks",
    desc: "A World Bank RCT in Nigeria found AI tutoring delivered one and a half to two years of learning gains in just six weeks.",
    cite: "World Bank 2024 · benefit–cost ratio 161–260",
  },
  {
    stat: "7% → 45%",
    title: "Reading, with no teacher in the room",
    desc: "In Tanzania, children given only tablets went from 7% to 45% reading ability in fifteen months.",
    cite: "Global Learning XPRIZE",
  },
  {
    stat: "$0.50–5",
    title: "per student, per year",
    desc: "Ten to a hundred times cheaper than the alternatives. At $2 a student, reaching 100,000 children costs $200,000 a year.",
    cite: "Self-hosted open-source stack",
  },
];

const PHONE_FACTS = [
  { value: 70, label: "of Africans have a mobile phone" },
  { value: 95, label: "of Lagos households own one" },
  { value: 99, label: "2G network coverage" },
];

export default function SabiLanding() {
  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="sabi-landing-hero">
        <div className="max-w-7xl mx-auto px-5 md:px-8 pt-14 pb-16 md:pt-20 md:pb-24 grid lg:grid-cols-12 gap-12 lg:gap-6 items-center">
          <div className="lg:col-span-7 relative z-10">
            <span className="sabi-pill">
              <span className="sabi-live-dot" />
              Lagos pilot · Q4 2026
            </span>
            <h1 className="sabi-display sabi-hero-title mt-7">
              The tutor who picks up the <em>phone.</em>
            </h1>
            <p className="mt-7 text-lg md:text-xl leading-relaxed max-w-xl text-[var(--sabi-ink-soft)]">
              Sabi teaches children to read and count in five-minute phone calls. It works on any
              handset, needs no internet, and is free for every family.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row sm:items-center gap-5">
              <Link href="/demo" className="sabi-btn-primary px-7 py-4 text-base">
                <MicIcon />
                Talk to Sabi
              </Link>
              <Link href="/chat" className="sabi-text-link text-base">
                Or chat with Sabi <ArrowIcon size={16} />
              </Link>
            </div>
            <dl className="sabi-definition mt-14 max-w-md flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <dt className="sabi-display text-2xl">sa·bi</dt>
              <dd className="sabi-mono text-sm">/sah-bee/</dd>
              <dd className="text-sm text-[var(--sabi-ink-soft)] w-full">
                <span className="italic">Nigerian Pidgin.</span> To know; to understand.
              </dd>
            </dl>
          </div>

          <div className="lg:col-span-5 relative h-[540px] md:h-[600px] w-full max-w-[480px] mx-auto">
            <Rings sizes={[300, 440, 580, 720]} pulse={300} />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <FeaturePhone />
            </div>
            <div className="sabi-bubble left-0 top-6 md:-left-6 md:top-14 max-w-[210px] md:max-w-[250px]">
              <span className="sabi-bubble-label">Sabi</span>
              If a customer gives you ₦500 and groundnuts cost ₦350, how much change?
            </div>
            <div className="sabi-bubble sabi-bubble-child right-0 bottom-16 md:-right-2 md:bottom-24">
              <span className="sabi-bubble-label">Chidi</span>
              150!
            </div>
          </div>
        </div>
      </section>

      {/* What you don't need */}
      <section className="sabi-nos">
        <ul className="max-w-7xl mx-auto px-5 md:px-8 py-7 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 text-2xl md:text-4xl">
          {["No smartphone", "No internet", "No data", "No cost"].map((item, i) => (
            <li key={item} className="flex items-center gap-8">
              {i > 0 && <span className="hidden md:inline-block w-2.5 h-2.5 rounded-full bg-[var(--sabi-yellow)]" aria-hidden="true" />}
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* 01 — The problem */}
      <section className="bg-[var(--sabi-card)]">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28">
          <div className="sabi-section-head">
            <p className="sabi-section-index">01 — The problem</p>
            <h2 className="sabi-display sabi-h2 max-w-4xl">
              Children spend years in school and still can&apos;t read a sentence.
            </h2>
          </div>

          <div className="mt-16 md:mt-20 grid md:grid-cols-12 gap-10 md:gap-8">
            <div className="md:col-span-6 sabi-rule-top pt-6">
              <p className="sabi-big-stat text-[6.5rem] md:text-[10rem]">7 in 10</p>
              <p className="mt-5 text-lg max-w-sm">Nigerian 10-year-olds cannot read a single sentence.</p>
              <p className="sabi-source mt-3">World Bank, 2022</p>
            </div>
            {[
              { stat: "98M", label: "children are out of school in Sub-Saharan Africa.", cite: "UNESCO, 2024" },
              { stat: "16%", label: "of planned learning actually happens in school.", cite: "Attendance × lesson completion × teacher presence" },
            ].map((item) => (
              <div key={item.stat} className="md:col-span-3 sabi-rule-top pt-6">
                <p className="sabi-big-stat text-6xl md:text-7xl">{item.stat}</p>
                <p className="mt-5 text-base">{item.label}</p>
                <p className="sabi-source mt-3">{item.cite}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 02 — The insight */}
      <section className="sabi-insight">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28 grid lg:grid-cols-12 gap-14 lg:gap-8">
          <div className="lg:col-span-6">
            <p className="sabi-section-index max-w-[220px]">02 — The insight</p>
            <h2 className="sabi-display sabi-h2 mt-8 !text-white">The answer is already in their pocket.</h2>
            <p className="mt-6 text-lg leading-relaxed text-white/75 max-w-lg">
              600 million people in Africa have no internet. But almost every family already owns
              something that can make a call. So we built a tutor for the network that already exists.
            </p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 flex flex-col justify-end gap-9">
            {PHONE_FACTS.map((f) => (
              <div key={f.label}>
                <div className="flex items-baseline justify-between gap-4 mb-3">
                  <span className="sabi-big-stat !text-white text-5xl md:text-6xl">{f.value}%</span>
                  <span className="text-white/75 text-right">{f.label}</span>
                </div>
                <div className="sabi-bar-track">
                  <div className="sabi-bar-fill" style={{ width: `${f.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 — How a call goes */}
      <section id="how-it-works" className="bg-[var(--sabi-paper)]">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28">
          <div className="sabi-section-head">
            <p className="sabi-section-index">03 — How it works</p>
            <h2 className="sabi-display sabi-h2 max-w-3xl">A child dials a number. Sabi does the rest.</h2>
          </div>

          <div className="mt-16 grid lg:grid-cols-12 gap-14 lg:gap-10 items-start">
            <ol className="sabi-steps lg:col-span-5">
              {STEPS.map((s, i) => (
                <li key={s.title}>
                  <span className="sabi-step-index">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="sabi-display text-xl !font-semibold !tracking-tight">{s.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--sabi-muted)]">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>

            <figure className="lg:col-span-7 lg:pl-6">
              <div className="sabi-call-log">
                <div className="sabi-call-log-head">
                  <div className="flex items-center gap-3">
                    <span className="sabi-live-dot" />
                    <span className="font-semibold">Call 1 · Chidi</span>
                  </div>
                  <span className="sabi-mono text-xs text-white/60 hidden sm:inline">Subtraction · market change</span>
                </div>
                <div>
                  {CALL.map((line) => (
                    <div key={line.t} className={`sabi-call-line ${line.who === "Sabi" ? "is-sabi" : "is-child"}`}>
                      <span className="sabi-mono text-[var(--sabi-meta)]">{line.t}</span>
                      <span className="sabi-who font-semibold text-sm pt-px">{line.who}</span>
                      <span>{line.text}</span>
                    </div>
                  ))}
                </div>
                <div className="sabi-call-divider">
                  <span className="sabi-eyebrow">Next day · Call 2</span>
                </div>
                <div className="sabi-call-line is-sabi">
                  <span className="sabi-mono text-[var(--sabi-meta)]">00:02</span>
                  <span className="sabi-who font-semibold text-sm pt-px">Sabi</span>
                  <span>
                    Welcome back, Chidi! Yesterday you learned subtraction using market change. You got
                    4 out of 5 right. Today, let&apos;s try adding things together…
                  </span>
                </div>
              </div>
              <figcaption className="sabi-source mt-6">An example first and second call, transcribed.</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* 04 — Evidence */}
      <section className="bg-[var(--sabi-card)]">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28">
          <div className="sabi-section-head">
            <p className="sabi-section-index">04 — The evidence</p>
            <div>
              <h2 className="sabi-display sabi-h2 max-w-3xl">Every design choice has a study behind it.</h2>
              <p className="mt-5 text-lg text-[var(--sabi-muted)] max-w-2xl">
                Research from Nigeria, Ghana, Tanzania, Madagascar and global randomised trials.
              </p>
            </div>
          </div>

          <div className="mt-16">
            {EVIDENCE.map((e) => (
              <div key={e.stat} className="sabi-evidence-row">
                <p className="sabi-display text-4xl md:text-5xl">
                  <span className="sabi-highlight">{e.stat}</span>
                  <span className="block mt-3 text-xl md:text-2xl !font-semibold !tracking-tight">{e.title}</span>
                </p>
                <p className="text-base leading-relaxed text-[var(--sabi-ink-soft)]">{e.desc}</p>
                <p className="sabi-source">{e.cite}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo + founder line */}
      <section className="sabi-photo-band">
        <Image
          src="/partner-child.jpg"
          alt="A smiling girl in a classroom holds a chalk slate above her head"
          fill
          sizes="100vw"
          className="object-cover object-[60%_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/10 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28 flex items-end min-h-[560px]">
          <blockquote className="sabi-quote-card max-w-xl p-8 md:p-10">
            <span className="sabi-quote-mark block" aria-hidden="true">&ldquo;</span>
            <p className="sabi-display text-2xl md:text-[1.9rem] !font-semibold !leading-[1.15] !tracking-tight mt-2">
              We&apos;re not building another app that sits in an app store. We&apos;re building
              something a mother hears about at church, dials after dinner, and hands to her child
              for five minutes.
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
        </div>
      </section>

      {/* 05 — Principles */}
      <section className="bg-[var(--sabi-paper)]">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28">
          <div className="sabi-section-head">
            <p className="sabi-section-index">05 — Built for the last mile</p>
            <h2 className="sabi-display sabi-h2 max-w-3xl">Designed for the child furthest from a classroom.</h2>
          </div>
          <div className="mt-16 grid md:grid-cols-3 gap-10 md:gap-8">
            {[
              { title: "Any phone.", desc: "Works on a $5 feature phone. No smartphone, no internet, no app download. Just a phone call." },
              { title: "It remembers.", desc: "Sabi remembers every child: their name, their level, their mistakes. Each call picks up where the last one ended." },
              { title: "Free. Always.", desc: "Toll-free calls. No subscription, no paywall. Sponsored by Education for Equality, a 501(c)(3) nonprofit." },
            ].map((p) => (
              <div key={p.title} className="sabi-principle">
                <h3 className="sabi-principle-title">{p.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-[var(--sabi-ink-soft)] max-w-sm">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="sabi-dev-callout mt-20 md:mt-28 grid lg:grid-cols-12 gap-10 p-8 md:p-12">
            <div className="lg:col-span-5">
              <p className="sabi-eyebrow !text-[var(--sabi-yellow)]">For developers &amp; organisations</p>
              <h3 className="sabi-display !text-white text-3xl md:text-4xl mt-4">Build on the voice behind Sabi.</h3>
              <p className="mt-4 text-white/70 leading-relaxed">
                The same African-accent pipeline, rentable per minute: speech-to-text, LLM and a
                Nigerian voice in one call. From $0.06 a minute, with 1,000 minutes free every month.
                Or fund a cohort of learners directly.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <Link href="/sabi/pricing" className="sabi-btn-gold px-6 py-3 text-sm">
                  See pricing <ArrowIcon size={16} />
                </Link>
                <Link href="/sabi/developers" className="sabi-text-link text-sm text-white">
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
                {"  "}-d <span className="tok-s">&apos;{"{"}&quot;audio&quot;: &quot;base64_encoded_audio&quot;,</span>{"\n"}
                {"       "}<span className="tok-s">&quot;voice&quot;: &quot;bukola&quot;,</span>{"\n"}
                {"       "}<span className="tok-s">&quot;language&quot;: &quot;en-NG&quot;{"}"}&apos;</span>
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* FAQ — the visible source of the FAQPage structured data in layout.tsx.
          Both render from SABI_FAQS so the markup and the schema stay identical. */}
      <section className="bg-[var(--sabi-card)] border-t border-[var(--sabi-border)]">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="sabi-section-index max-w-[220px]">06 — Questions</p>
              <h2 className="sabi-display sabi-h2 mt-8">Common questions about Sabi</h2>
              <p className="mt-5 text-[var(--sabi-muted)]">
                Something else? Write to{" "}
                <a href="mailto:info@eduforequality.org" className="underline underline-offset-4 text-[var(--sabi-ink)]">
                  info@eduforequality.org
                </a>
              </p>
            </div>
          </div>
          <div className="sabi-faq lg:col-span-7 lg:col-start-6">
            {SABI_FAQS.map((faq, i) => (
              <details key={faq.question} open={i === 0}>
                <summary>
                  {faq.question}
                  <span className="sabi-faq-toggle" aria-hidden="true" />
                </summary>
                <p className="pb-6 -mt-1 pr-12 text-[var(--sabi-ink-soft)] leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="sabi-final-cta">
        <div className="absolute right-[-120px] top-1/2 hidden md:block">
          <Rings sizes={[260, 400, 540, 680, 820]} pulse={260} />
        </div>
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 py-24 md:py-32">
          <h2 className="sabi-display sabi-hero-title max-w-4xl">Go on, give Sabi a&nbsp;call.</h2>
          <p className="mt-6 text-lg md:text-xl max-w-xl text-[var(--sabi-ink-soft)]">
            Hear what a lesson sounds like, right here in your browser.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row sm:items-center gap-5">
            <Link href="/demo" className="sabi-btn-primary px-7 py-4 text-base">
              <MicIcon />
              Talk to Sabi
            </Link>
            <Link href="/chat" className="sabi-text-link text-base">
              Or chat with Sabi <ArrowIcon size={16} />
            </Link>
          </div>
          <p className="sabi-mono text-xs mt-12 text-[var(--sabi-ink-soft)]">
            Lagos pilot planned Q4 2026 · 100–500 students in high-burden LGAs
          </p>
        </div>
      </section>
    </div>
  );
}
