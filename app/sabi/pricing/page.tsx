"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const DEVELOPER_ACCESS = "/sabi/developers";

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function DashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="6" y1="12" x2="18" y2="12" />
    </svg>
  );
}

function SoundWave({ bars = 36 }: { bars?: number }) {
  return (
    <div className="flex items-center justify-center gap-[2px] h-10 opacity-80">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full sabi-wave-bar"
          style={{
            animation: `sabi-wave 1.2s ease-in-out ${i * 0.05}s infinite alternate`,
            height: `${10 + Math.abs(Math.sin(i * 0.7)) * 18 + Math.abs(Math.sin(i * 2.3)) * 8}px`,
          }}
        />
      ))}
    </div>
  );
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("revealed"), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`sabi-reveal ${className}`}>
      {children}
    </div>
  );
}

const plans = [
  {
    name: "Free",
    price: "$0",
    unit: "",
    tagline: "1,000 minutes/month planned for early builders.",
    description: "Join the early access list and build the first prototype when the pilot opens.",
    cta: "Join early access",
    href: DEVELOPER_ACCESS,
    highlighted: false,
    features: [
      "First 1,000 prototype minutes when the pilot opens",
      "Nigerian English STT + LLM + TTS",
      "Default Nigerian voice",
      "Sandbox and docs rolling out with early access",
      "Feedback loop with the Sabi team",
    ],
  },
  {
    name: "Pay as you go",
    price: "$0.06",
    unit: "/min",
    tagline: "The public-beta rate we are building toward.",
    description: "For teams that want the full pipeline as soon as Sabi opens to developers.",
    cta: "Join waitlist",
    href: DEVELOPER_ACCESS,
    highlighted: true,
    features: [
      "Full STT → LLM → TTS pipeline",
      "Yoruba, Hausa, Igbo & Pidgin voices",
      "Custom voice cloning + accent select",
      "Adaptive per-caller memory",
      "À la carte primitives (transcribe / speak)",
      "Automatic volume pricing (see below)",
      "Design-partner onboarding support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    unit: "",
    tagline: "From $0.015/min on committed volume.",
    description: "For telcos, ministries, banks, and national deployments.",
    cta: "Talk to us",
    href: DEVELOPER_ACCESS,
    highlighted: false,
    features: [
      "Committed-volume rates from $0.015/min",
      "White-label deployment",
      "On-premise option ($3,000–5,000/mo)",
      "Dedicated inference capacity",
      "Custom curriculum / content loading",
      "Data processing agreement + 100% SLA",
      "Dedicated account manager",
    ],
  },
];

const volumeTiers = [
  { band: "First 1,000 min / month", rate: "Free", note: "Every account, every month" },
  { band: "Up to 100k min / month", rate: "$0.06", note: "Pay as you go" },
  { band: "100k – 1M min / month", rate: "$0.04", note: "Applied automatically" },
  { band: "1M – 5M min / month", rate: "$0.02", note: "Growth" },
  { band: "5M+ min / month", rate: "from $0.015", note: "Enterprise commit" },
];

const primitives = [
  {
    verb: "transcribe",
    title: "African-accent speech-to-text",
    price: "$0.012",
    unit: "/min",
    desc: "Nigerian English, Pidgin, names, money, numerals — accurate on noisy 2G phone audio.",
  },
  {
    verb: "speak",
    title: "Nigerian text-to-speech",
    price: "$0.12",
    unit: "/1k chars",
    desc: "Warm, local voices in English, Yoruba, Hausa, Igbo & Pidgin.",
  },
  {
    verb: "tutor",
    title: "Curriculum LLM turn",
    price: "Metered",
    unit: "in pipeline",
    desc: "Adaptive, safety-first tutoring turns grounded in literacy & numeracy.",
  },
  {
    verb: "identify",
    title: "Per-child identity on a shared phone",
    price: "Included",
    unit: "",
    desc: "Recognise and remember individual learners across calls on one household number.",
  },
];

const comparison = [
  { feature: "Starting price / min", sabi: "$0.06", vapi: "~$0.14*", eleven: "$0.10–0.12", retell: "$0.07+" },
  { feature: "Nigerian English & Pidgin", sabi: true, vapi: false, eleven: false, retell: false },
  { feature: "Tuned for 2G / noisy phone audio", sabi: true, vapi: false, eleven: false, retell: false },
  { feature: "Yoruba / Hausa / Igbo voices", sabi: true, vapi: false, eleven: false, retell: false },
  { feature: "Per-child identity on shared phone", sabi: true, vapi: false, eleven: false, retell: false },
  { feature: "Telephony billed at cost", sabi: true, vapi: false, eleven: false, retell: false },
  { feature: "Self-host / on-premise", sabi: true, vapi: false, eleven: false, retell: false },
];

const faqs = [
  {
    q: "What exactly am I paying for?",
    a: "The inference we run — speech-to-text, the language model, and text-to-speech. Telephony minutes are passed through at cost as a separate line item. We never mark them up.",
  },
  {
    q: "How does a minute get counted?",
    a: "You're billed per minute of active conversation through the pipeline, rounded to the second. The first 1,000 minutes every month are free.",
  },
  {
    q: "Do volume discounts need a contract?",
    a: "No. Lower rates apply automatically as usage crosses each threshold. Enterprise commits (from $0.015/min) are the only ones that need a conversation.",
  },
  {
    q: "Can I use just transcription or just the voice?",
    a: "Yes. Each primitive is available on its own — fintech IVR and health hotlines don't need to pay for the tutoring layer.",
  },
  {
    q: "Why are you cheaper than Vapi and ElevenLabs?",
    a: "We own the hard part — African-accent models — and refuse to make margin on telco minutes. Same pipeline that teaches kids on a phone call.",
  },
];

export default function SabiPricingPage() {
  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden border-b sabi-pricing-hero" style={{ borderColor: "var(--sabi-border)" }}>
        <div className="max-w-3xl mx-auto px-6 pt-16 pb-14 text-center">
          <Reveal>
            <p
              className="inline-flex items-center gap-2 text-xs font-normal tracking-[0.02em] px-3.5 py-1.5 rounded-full mb-6"
              style={{ background: "var(--sabi-card)", color: "var(--sabi-muted)", border: "1px solid var(--sabi-border)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--sabi-gold)]" />
              Usage-based · no minimums · pay only for what you use
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="sabi-display text-4xl md:text-6xl tracking-tight mb-5">
              Pricing that scales with your voice app
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-lg md:text-xl text-[var(--sabi-muted)] max-w-2xl mx-auto leading-relaxed">
              One per-minute price for the full African voice pipeline. Telephony billed at cost, never marked up.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-8 mb-4">
              <SoundWave />
            </div>
            <div className="overflow-hidden max-w-md mx-auto" style={{ maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" }}>
              <div className="flex gap-6 whitespace-nowrap text-sm font-mono text-[var(--sabi-muted)]" style={{ animation: "sabi-marquee 28s linear infinite" }}>
                {["Nigerian English", "Yoruba", "Hausa", "Igbo", "Pidgin", "Nigerian English", "Yoruba", "Hausa", "Igbo", "Pidgin"].map((lang, i) => (
                  <span key={i} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[var(--sabi-gold)]" />
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Plans */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 80}>
              <div className={`sabi-card p-8 flex flex-col h-full relative ${plan.highlighted ? "sabi-card-highlight" : ""}`}>
                {plan.highlighted && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1 rounded-full sabi-popular-badge"
                    style={{ background: "var(--sabi-gold)", color: "var(--sabi-ink)" }}
                  >
                    Most popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="sabi-display text-2xl text-[var(--sabi-ink)] mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="sabi-display text-5xl text-[var(--sabi-ink)]">{plan.price}</span>
                    <span className="text-sm text-[var(--sabi-muted)]">{plan.unit}</span>
                  </div>
                  <p className="text-sm mt-3 font-medium text-[var(--sabi-gold-deep)]">{plan.tagline}</p>
                  <p className="text-sm mt-2 text-[var(--sabi-muted)]">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-[var(--sabi-muted)]">
                      <span className="mt-0.5 flex-shrink-0 text-[var(--sabi-green)]"><CheckIcon /></span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`inline-flex items-center justify-center gap-2 w-full py-3 text-sm ${plan.highlighted ? "sabi-btn-primary" : "sabi-btn-secondary"}`}
                >
                  {plan.cta} <ArrowIcon />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Volume */}
      <section id="volume" className="border-t border-b sabi-pricing-section-alt" style={{ borderColor: "var(--sabi-border)", background: "var(--sabi-white)" }}>
        <div className="max-w-4xl mx-auto px-6 py-16">
          <Reveal>
            <p className="text-xs uppercase tracking-widest sabi-accent-label mb-2">Volume</p>
            <h2 className="sabi-display text-3xl md:text-4xl mb-3">Grow into a lower rate — automatically</h2>
            <p className="text-[var(--sabi-muted)] mb-8 max-w-2xl">
              Discounts apply on their own as monthly usage climbs — like cloud infrastructure. No renegotiation.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="sabi-card overflow-hidden">
              {volumeTiers.map((t, i) => (
                <div
                  key={t.band}
                  className={`flex items-center justify-between px-6 py-5 hover:bg-[var(--sabi-gold-wash)] transition-colors ${i > 0 ? "border-t" : ""}`}
                  style={{ borderColor: "var(--sabi-border)" }}
                >
                  <div>
                    <div className="text-sm font-semibold text-[var(--sabi-ink)]">{t.band}</div>
                    <div className="text-xs text-[var(--sabi-muted)] mt-0.5">{t.note}</div>
                  </div>
                  <div className="sabi-display text-2xl md:text-3xl text-[var(--sabi-ink)]">
                    {t.rate}
                    {t.rate !== "Free" && <span className="text-sm text-[var(--sabi-muted)]"> /min</span>}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-[var(--sabi-muted)] mt-4">
              Telephony is pass-through at provider cost. Margin is on inference we run — never on carrier minutes.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Primitives */}
      <section id="primitives" className="max-w-6xl mx-auto px-6 py-16">
        <Reveal>
          <p className="text-xs uppercase tracking-widest sabi-accent-label mb-2">À la carte</p>
          <h2 className="sabi-display text-3xl md:text-4xl mb-3">Four primitives. Compose your own.</h2>
          <p className="text-[var(--sabi-muted)] mb-10 max-w-2xl">
            A fintech IVR or health hotline doesn&apos;t need the tutor — use African-accent STT or Nigerian voice on their own.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {primitives.map((p, i) => (
            <Reveal key={p.verb} delay={i * 60}>
              <div className="sabi-card p-6 h-full">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <code className="text-sm font-mono px-2 py-1 rounded bg-[var(--sabi-gold-soft)] text-[var(--sabi-gold-deep)]">{p.verb}</code>
                  <div className="text-right">
                    <span className="sabi-display text-2xl text-[var(--sabi-ink)]">{p.price}</span>
                    <span className="text-xs text-[var(--sabi-muted)] ml-1">{p.unit}</span>
                  </div>
                </div>
                <h4 className="font-bold text-sm text-[var(--sabi-ink)] mb-2">{p.title}</h4>
                <p className="text-sm text-[var(--sabi-muted)] leading-relaxed">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Code */}
      <section className="border-t sabi-pricing-code-band" style={{ borderColor: "var(--sabi-border)" }}>
        <div className="max-w-4xl mx-auto px-6 py-16">
          <Reveal>
            <h2 className="sabi-display text-2xl md:text-3xl mb-3">One call. The whole pipeline.</h2>
            <p className="text-[var(--sabi-muted)] mb-8">Send audio in, get audio back — tuned for Nigerian voices and noisy 2G lines.</p>
          </Reveal>
          <Reveal delay={80}>
            <div className="rounded-2xl overflow-hidden border shadow-lg sabi-code-terminal">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                <div className="w-3 h-3 rounded-full bg-[var(--sabi-gold)]" />
                <div className="w-3 h-3 rounded-full bg-[var(--sabi-green)]" />
                <span className="ml-3 text-xs font-mono text-white/40">api.eduforequality.org</span>
              </div>
              <pre className="p-6 text-sm font-mono overflow-x-auto leading-relaxed text-white/90">
                <code>{`$ curl https://api.eduforequality.org/v1/voice/process \\
  -H "Authorization: Bearer sk_sabi_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "audio": "base64_encoded_audio",
    "voice": "bukola",
    "language": "en-NG"
  }'`}</code>
              </pre>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Compare */}
      <section id="compare" className="max-w-5xl mx-auto px-6 py-16">
        <Reveal>
          <h2 className="sabi-display text-3xl md:text-4xl mb-3">Cheaper — and the only one built for Africa</h2>
          <p className="text-[var(--sabi-muted)] mb-8 max-w-2xl">
            Vapi and ElevenLabs are excellent for American English. None of them understand a child speaking Pidgin on a 2G line.
          </p>
        </Reveal>
        <Reveal delay={80}>
          <div className="sabi-card overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--sabi-border)" }}>
                  <th className="text-left font-medium px-5 py-4 text-[var(--sabi-muted)]">&nbsp;</th>
                  <th className="text-center font-bold px-4 py-4 text-[var(--sabi-ink)]">Sabi</th>
                  <th className="text-center font-medium px-4 py-4 text-[var(--sabi-muted)]">Vapi</th>
                  <th className="text-center font-medium px-4 py-4 text-[var(--sabi-muted)]">ElevenLabs</th>
                  <th className="text-center font-medium px-4 py-4 text-[var(--sabi-muted)]">Retell</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={row.feature} className={i > 0 ? "border-t" : ""} style={{ borderColor: "var(--sabi-border)" }}>
                    <td className="px-5 py-4 text-[var(--sabi-muted)]">{row.feature}</td>
                    {(["sabi", "vapi", "eleven", "retell"] as const).map((k) => {
                      const v = row[k];
                      return (
                        <td key={k} className="text-center px-4 py-4">
                          {typeof v === "string" ? (
                            <span className={`font-mono font-semibold ${k === "sabi" ? "text-[var(--sabi-ink)]" : "text-[var(--sabi-muted)]"}`}>{v}</span>
                          ) : v ? (
                            <span className="inline-flex text-[var(--sabi-green)]"><CheckIcon /></span>
                          ) : (
                            <span className="inline-flex text-gray-300"><DashIcon /></span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[var(--sabi-muted)] mt-3">* Vapi real-world all-in ~$0.14/min. Competitor rates as published, July 2026.</p>
        </Reveal>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t sabi-pricing-section-alt" style={{ borderColor: "var(--sabi-border)", background: "var(--sabi-white)" }}>
        <div className="max-w-3xl mx-auto px-6 py-16">
          <Reveal>
            <h2 className="sabi-display text-3xl mb-8 text-center">Questions, answered</h2>
          </Reveal>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 50}>
                <div className="sabi-card p-6">
                  <h4 className="font-bold text-[var(--sabi-ink)] mb-2">{f.q}</h4>
                  <p className="text-sm text-[var(--sabi-muted)] leading-relaxed">{f.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Managed callout */}
      <section className="sabi-pricing-section-alt" style={{ background: "var(--sabi-white)" }}>
        <div className="max-w-4xl mx-auto px-6 pb-8">
          <Reveal>
            <div className="sabi-card p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6 justify-between sabi-pricing-org-callout">
              <div>
                <p className="text-xs uppercase tracking-widest sabi-accent-label mb-2">Not a developer?</p>
                <h3 className="sabi-display text-xl mb-2">Sabi for Organizations</h3>
                <p className="text-sm text-[var(--sabi-muted)] max-w-xl">
                  Governments and NGOs: fund a cohort, kids learn by phone call. We handle telephony, curriculum, AI, and impact measurement.
                </p>
              </div>
              <Link href="mailto:info@eduforequality.org?subject=Sabi%20for%20Organizations" className="sabi-btn-secondary px-6 py-3 text-sm inline-flex items-center gap-2 flex-shrink-0">
                Talk to us <ArrowIcon />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t sabi-pricing-cta" style={{ borderColor: "var(--sabi-border)" }}>
        <div className="max-w-3xl mx-auto px-6 py-20 text-center text-white">
          <Reveal>
            <h2 className="sabi-display text-3xl md:text-4xl mb-4">Want to build on Sabi when the API opens?</h2>
            <p className="text-lg opacity-90 mb-8">Join the early access list. We are inviting the first serious builders into the developer pilot.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={DEVELOPER_ACCESS} className="sabi-cta-primary inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold">
                Join early access <ArrowIcon />
              </Link>
              <Link href={DEVELOPER_ACCESS} className="sabi-cta-secondary inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold border-2 border-white/40 hover:bg-white/10 transition-colors">
                Tell us your use case
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
