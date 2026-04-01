"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

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

/* ── Animated sound wave bars ─────────────────────────────── */
function SoundWave({ color = "#10b981", bars = 40 }: { color?: string; bars?: number }) {
  return (
    <div className="flex items-center gap-[2px] h-12 opacity-60">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full"
          style={{
            background: color,
            animation: `wave 1.2s ease-in-out ${i * 0.05}s infinite alternate`,
            height: `${12 + Math.sin(i * 0.7) * 20 + Math.random() * 10}px`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Floating orb component ───────────────────────────────── */
function FloatingOrb({ className, color, size, delay = "0s" }: { className?: string; color: string; size: string; delay?: string }) {
  return (
    <div
      className={`absolute rounded-full blur-[100px] ${className}`}
      style={{
        background: color,
        width: size,
        height: size,
        animation: `float 8s ease-in-out ${delay} infinite alternate`,
      }}
    />
  );
}

/* ── Scroll-reveal wrapper ────────────────────────────────── */
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
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal-element ${className}`}>
      {children}
    </div>
  );
}

/* ── Data ─────────────────────────────────────────────────── */
const devTiers = [
  {
    name: "Starter",
    price: "$0.04",
    unit: "/min",
    description: "For builders getting started with voice AI in Africa.",
    cta: "Start Building",
    href: "mailto:api@eduforequality.org?subject=Sabi API — Starter",
    highlighted: false,
    features: [
      "Speech-to-Text (Nigerian English)",
      "LLM processing",
      "Text-to-Speech (default voice)",
      "English language",
      "99.5% uptime SLA",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: "$0.07",
    unit: "/min",
    description: "For teams scaling voice products across Africa.",
    cta: "Get Started",
    href: "mailto:api@eduforequality.org?subject=Sabi API — Pro",
    highlighted: true,
    features: [
      "Everything in Starter",
      "Custom voice cloning",
      "Accent & language selection",
      "Yoruba, Hausa, Igbo, Pidgin TTS",
      "Adaptive memory per user",
      "Emotion-aware synthesis",
      "99.9% uptime SLA",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    unit: "",
    description: "For governments, telcos, and national deployments.",
    cta: "Contact Sales",
    href: "mailto:api@eduforequality.org?subject=Sabi API — Enterprise",
    highlighted: false,
    features: [
      "Everything in Pro",
      "Custom content loading",
      "White-label deployment",
      "Dedicated GPU capacity",
      "Analytics dashboard",
      "On-premise option",
      "100% uptime SLA",
      "Dedicated account manager",
    ],
  },
];

const orgTiers = [
  {
    name: "Pilot",
    students: "100–500",
    price: "$10–15",
    unit: "/student",
    description: "Prove it works. Pre/post assessments included.",
    features: ["Full literacy & numeracy course", "Toll-free calling", "Student progress tracking", "Impact report"],
  },
  {
    name: "Scale",
    students: "1K–50K",
    price: "$5–8",
    unit: "/student",
    description: "Deploy across schools, districts, or regions.",
    features: ["Everything in Pilot", "Government-ready reporting", "Impact assessment framework", "Dedicated support"],
  },
  {
    name: "National",
    students: "100K+",
    price: "$2–5",
    unit: "/student",
    description: "State or federal level. We handle everything.",
    features: ["Everything in Scale", "Zero-rated telephony via MNO partnerships", "Policy integration support", "On-the-ground team"],
  },
];

/* ── Page ─────────────────────────────────────────────────── */
export default function SabiPricingPage() {
  return (
    <>
      <style>{`
        body > div > nav, body > div > header,
        body > div > footer, body header, body footer,
        [class*="Navbar"], [class*="Footer"],
        body > main ~ footer, body > div > main ~ footer {
          display: none !important;
        }
        body, main { background: #09090b !important; }

        @keyframes wave {
          0% { transform: scaleY(0.3); }
          100% { transform: scaleY(1); }
        }
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, -20px) scale(1.1); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.3; }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .reveal-element {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-element.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        .card-hover {
          transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-hover:hover {
          border-color: rgba(16,185,129,0.2) !important;
          transform: translateY(-2px);
          box-shadow: 0 0 40px rgba(16,185,129,0.06);
        }

        .btn-glow:hover {
          box-shadow: 0 0 30px rgba(16,185,129,0.3);
        }

        .grid-bg {
          background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 24px 24px;
        }

        .lang-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>

      <div className="min-h-screen grid-bg" style={{ background: "#09090b", color: "#fafafa" }}>

        {/* ─── Nav ──────────────────────────────────────────── */}
        <nav className="fixed top-0 w-full z-50" style={{ background: "rgba(9,9,11,0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/sabi" className="flex items-center gap-3">
              <span className="text-xl font-bold tracking-tight" style={{ color: "#10b981" }}>sabi</span>
            </Link>
            <div className="flex items-center gap-8 text-sm" style={{ color: "#71717a" }}>
              <a href="#developers" className="hover:text-white transition-colors">For Developers</a>
              <a href="#organizations" className="hover:text-white transition-colors">For Organizations</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <Link href="mailto:info@eduforequality.org?subject=Sabi" className="px-5 py-2 rounded-lg text-sm font-medium btn-glow transition-all" style={{ background: "#10b981", color: "#000" }}>
                Get Started
              </Link>
            </div>
          </div>
        </nav>

        {/* ─── Hero ─────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-32 pb-24">
          <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[100px]" style={{ background: "#10b981", animation: "pulse-glow 6s ease-in-out infinite" }} />
          <FloatingOrb color="#06b6d4" size="400px" className="top-20 right-[-100px] opacity-10" delay="2s" />
          <FloatingOrb color="#8b5cf6" size="300px" className="bottom-0 left-[-50px] opacity-[0.07]" delay="4s" />

          <div className="relative max-w-5xl mx-auto px-6 text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 text-xs font-mono px-4 py-2 rounded-full mb-8" style={{ border: "1px solid rgba(16,185,129,0.15)", color: "#10b981", background: "rgba(16,185,129,0.05)" }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#10b981" }} />
                Now accepting early access partners
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6" style={{ background: "linear-gradient(135deg, #fafafa 0%, #10b981 50%, #06b6d4 100%)", backgroundSize: "200% 200%", animation: "gradient-shift 8s ease infinite", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Voice AI<br />for Africa
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-6 leading-relaxed" style={{ color: "#a1a1aa" }}>
                The only voice AI platform built for African accents, languages, and infrastructure.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="flex justify-center mb-10">
                <SoundWave />
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link href="#developers" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold btn-glow transition-all" style={{ background: "#10b981", color: "#000" }}>
                  For Developers <ArrowIcon />
                </Link>
                <Link href="#organizations" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all hover:bg-white/5" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#fafafa" }}>
                  For Organizations <ArrowIcon />
                </Link>
              </div>
            </Reveal>

            {/* Language ticker */}
            <Reveal delay={500}>
              <div className="overflow-hidden max-w-lg mx-auto" style={{ maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)" }}>
                <div className="flex gap-8 lang-marquee whitespace-nowrap text-sm font-mono" style={{ color: "#52525b" }}>
                  {["Nigerian English", "Yoruba", "Hausa", "Igbo", "Pidgin", "Swahili", "Amharic", "Wolof", "Zulu", "Nigerian English", "Yoruba", "Hausa", "Igbo", "Pidgin", "Swahili", "Amharic", "Wolof", "Zulu"].map((lang, i) => (
                    <span key={i} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full" style={{ background: "#10b981" }} />
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─── Two Products ─────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Reveal>
              <a href="#developers" className="block rounded-2xl p-10 card-hover relative overflow-hidden group" style={{ background: "#0f0f11", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-500" style={{ background: "#10b981" }} />
                <span className="text-xs font-mono px-3 py-1 rounded-full mb-6 inline-block" style={{ border: "1px solid rgba(16,185,129,0.2)", color: "#10b981", background: "rgba(16,185,129,0.05)" }}>
                  API Platform
                </span>
                <h2 className="text-2xl font-bold mb-3">Sabi for Developers</h2>
                <p className="leading-relaxed mb-4" style={{ color: "#71717a" }}>
                  Hosted voice AI pipeline — STT, LLM, and TTS in one API call. Build voice apps for African markets in minutes.
                </p>
                <span className="text-sm font-semibold inline-flex items-center gap-2" style={{ color: "#10b981" }}>
                  View API pricing <ArrowIcon />
                </span>
              </a>
            </Reveal>

            <Reveal delay={150}>
              <a href="#organizations" className="block rounded-2xl p-10 card-hover relative overflow-hidden group" style={{ background: "#0f0f11", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-500" style={{ background: "#06b6d4" }} />
                <span className="text-xs font-mono px-3 py-1 rounded-full mb-6 inline-block" style={{ border: "1px solid rgba(6,182,212,0.2)", color: "#06b6d4", background: "rgba(6,182,212,0.05)" }}>
                  Managed Delivery
                </span>
                <h2 className="text-2xl font-bold mb-3">Sabi for Organizations</h2>
                <p className="leading-relaxed mb-4" style={{ color: "#71717a" }}>
                  Turn-key education delivery. You fund it, kids learn. We handle telephony, curriculum, AI, and impact measurement.
                </p>
                <span className="text-sm font-semibold inline-flex items-center gap-2" style={{ color: "#06b6d4" }}>
                  View managed pricing <ArrowIcon />
                </span>
              </a>
            </Reveal>
          </div>
        </section>

        {/* ─── Sabi for Developers ──────────────────────────── */}
        <section id="developers" className="relative" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <FloatingOrb color="#10b981" size="500px" className="top-20 left-[-200px] opacity-[0.06]" delay="1s" />

          <div className="max-w-6xl mx-auto px-6 py-24">
            <Reveal>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono px-3 py-1 rounded-full" style={{ border: "1px solid rgba(16,185,129,0.2)", color: "#10b981", background: "rgba(16,185,129,0.05)" }}>01</span>
                <span className="text-sm font-medium uppercase tracking-widest" style={{ color: "#10b981" }}>For Developers</span>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                One API call. Full voice pipeline.
              </h2>
            </Reveal>

            <Reveal delay={200}>
              <p className="text-lg max-w-2xl mb-16" style={{ color: "#71717a" }}>
                Send audio in, get audio back. Speech recognition, language model, and voice synthesis — optimized for African accents, tuned for noisy environments, fast on 2G.
              </p>
            </Reveal>

            {/* Code snippet */}
            <Reveal delay={300}>
              <div className="rounded-2xl overflow-hidden mb-20" style={{ background: "#0a0a0c", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2 px-5 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="w-3 h-3 rounded-full" style={{ background: "#ef4444" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#eab308" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#22c55e" }} />
                  <span className="ml-3 text-xs font-mono" style={{ color: "#3f3f46" }}>api.eduforequality.org</span>
                </div>
                <pre className="p-6 text-sm font-mono overflow-x-auto leading-relaxed">
                  <code>
                    <span style={{ color: "#10b981" }}>$</span>{" "}
                    <span style={{ color: "#a1a1aa" }}>curl</span>{" "}
                    <span style={{ color: "#fafafa" }}>https://api.eduforequality.org/v1/voice/process</span> \{"\n"}
                    {"  "}-H <span style={{ color: "#fbbf24" }}>&quot;Authorization: Bearer sk_sabi_...&quot;</span> \{"\n"}
                    {"  "}-H <span style={{ color: "#fbbf24" }}>&quot;Content-Type: application/json&quot;</span> \{"\n"}
                    {"  "}-d <span style={{ color: "#fbbf24" }}>&apos;{"{"}</span>{"\n"}
                    {"    "}<span style={{ color: "#60a5fa" }}>&quot;audio&quot;</span><span style={{ color: "#52525b" }}>:</span> <span style={{ color: "#fbbf24" }}>&quot;base64_encoded_audio&quot;</span>,{"\n"}
                    {"    "}<span style={{ color: "#60a5fa" }}>&quot;voice&quot;</span><span style={{ color: "#52525b" }}>:</span> <span style={{ color: "#fbbf24" }}>&quot;naomi&quot;</span>,{"\n"}
                    {"    "}<span style={{ color: "#60a5fa" }}>&quot;language&quot;</span><span style={{ color: "#52525b" }}>:</span> <span style={{ color: "#fbbf24" }}>&quot;en-NG&quot;</span>,{"\n"}
                    {"    "}<span style={{ color: "#60a5fa" }}>&quot;emotion&quot;</span><span style={{ color: "#52525b" }}>:</span> <span style={{ color: "#fbbf24" }}>&quot;warm&quot;</span>{"\n"}
                    {"  "}<span style={{ color: "#fbbf24" }}>{"}"}&apos;</span>
                  </code>
                </pre>
              </div>
            </Reveal>

            {/* Capabilities grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-20">
              {[
                { stat: "10x", label: "cheaper than alternatives", description: "Full pipeline at $0.01/min cost. Pass the savings on or keep the margin." },
                { stat: "20+", label: "African accents", description: "Nigerian English, Yoruba, Hausa, Igbo — built in, not bolted on." },
                { stat: "<500", label: "ms latency", description: "Full round-trip. Optimized for 2G networks and real-world noise." },
                { stat: "100%", label: "self-hostable", description: "On-premise deployment available. Your data never leaves your servers." },
              ].map((item, i) => (
                <Reveal key={item.label} delay={i * 100}>
                  <div className="rounded-xl p-6 card-hover h-full" style={{ background: "#0f0f11", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-2xl font-bold font-mono block mb-1" style={{ color: "#10b981" }}>{item.stat}</span>
                    <span className="text-xs uppercase tracking-wider block mb-3" style={{ color: "#a1a1aa" }}>{item.label}</span>
                    <p className="text-xs leading-relaxed" style={{ color: "#52525b" }}>{item.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* API Pricing tiers */}
            <div id="pricing" className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {devTiers.map((tier, i) => (
                <Reveal key={tier.name} delay={i * 100}>
                  <div className="rounded-2xl p-8 flex flex-col relative card-hover h-full" style={{ background: tier.highlighted ? "linear-gradient(to bottom, rgba(16,185,129,0.08), rgba(16,185,129,0.02))" : "#0f0f11", border: tier.highlighted ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(255,255,255,0.06)" }}>
                    {tier.highlighted && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-4 py-1 rounded-full" style={{ background: "#10b981", color: "#000" }}>
                        Most Popular
                      </div>
                    )}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">{tier.name}</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold font-mono">{tier.price}</span>
                        <span className="text-sm" style={{ color: "#71717a" }}>{tier.unit}</span>
                      </div>
                      <p className="text-sm mt-3" style={{ color: "#52525b" }}>{tier.description}</p>
                    </div>
                    <ul className="space-y-3 mb-8 flex-1">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-sm" style={{ color: "#a1a1aa" }}>
                          <span className="mt-0.5 flex-shrink-0" style={{ color: "#10b981" }}><CheckIcon /></span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link href={tier.href} className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all btn-glow" style={tier.highlighted ? { background: "#10b981", color: "#000" } : { background: "transparent", color: "#fafafa", border: "1px solid rgba(255,255,255,0.1)" }}>
                      {tier.cta} <ArrowIcon />
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={400}>
              <p className="text-center text-sm mt-8" style={{ color: "#3f3f46" }}>
                Volume discounts for 1M+ min/month. On-premise starts at $3,000/mo.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ─── Sabi for Organizations ───────────────────────── */}
        <section id="organizations" className="relative" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <FloatingOrb color="#06b6d4" size="500px" className="top-20 right-[-200px] opacity-[0.06]" delay="3s" />

          <div className="max-w-6xl mx-auto px-6 py-24">
            <Reveal>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono px-3 py-1 rounded-full" style={{ border: "1px solid rgba(6,182,212,0.2)", color: "#06b6d4", background: "rgba(6,182,212,0.05)" }}>02</span>
                <span className="text-sm font-medium uppercase tracking-widest" style={{ color: "#06b6d4" }}>For Organizations</span>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                You fund it. Kids learn.
              </h2>
            </Reveal>

            <Reveal delay={200}>
              <p className="text-lg max-w-2xl mb-16" style={{ color: "#71717a" }}>
                Turn-key foundational literacy and numeracy. We handle the telephony, the AI, the curriculum, the student tracking, and the impact measurement. You get a report showing learning outcomes.
              </p>
            </Reveal>

            {/* How it works strip */}
            <Reveal delay={300}>
              <div className="flex flex-col md:flex-row gap-4 mb-20">
                {[
                  { num: "1", title: "You fund a cohort", desc: "100 students, 1,000, or 100,000. Per-student pricing." },
                  { num: "2", title: "Kids call a toll-free number", desc: "5-minute daily lessons. Any phone. No internet." },
                  { num: "3", title: "Sabi teaches adaptively", desc: "Market math, phonics, persistent memory. Nigerian context." },
                  { num: "4", title: "You receive impact data", desc: "Pre/post TaRL assessments, engagement metrics, cost per outcome." },
                ].map((step, i) => (
                  <div key={step.num} className="flex-1 rounded-xl p-6" style={{ background: "#0f0f11", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-2xl font-bold font-mono block mb-2" style={{ color: "#06b6d4" }}>{step.num}</span>
                    <h4 className="font-semibold mb-1 text-sm">{step.title}</h4>
                    <p className="text-xs" style={{ color: "#52525b" }}>{step.desc}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Org pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {orgTiers.map((tier, i) => (
                <Reveal key={tier.name} delay={i * 100}>
                  <div className="rounded-2xl p-8 flex flex-col card-hover h-full" style={{ background: "#0f0f11", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-1">{tier.name}</h3>
                      <p className="text-xs mb-4" style={{ color: "#52525b" }}>{tier.students} students</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold font-mono">{tier.price}</span>
                        <span className="text-sm" style={{ color: "#71717a" }}>{tier.unit}</span>
                      </div>
                      <p className="text-sm mt-3" style={{ color: "#52525b" }}>{tier.description}</p>
                    </div>
                    <ul className="space-y-3 mb-8 flex-1">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-sm" style={{ color: "#a1a1aa" }}>
                          <span className="mt-0.5 flex-shrink-0" style={{ color: "#06b6d4" }}><CheckIcon /></span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link href="mailto:info@eduforequality.org?subject=Sabi for Organizations" className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all" style={{ background: "transparent", color: "#fafafa", border: "1px solid rgba(255,255,255,0.1)" }}>
                      Contact Us <ArrowIcon />
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={400}>
              <p className="text-center text-sm mt-8" style={{ color: "#3f3f46" }}>
                Governments, UN agencies, foundations, and telco CSR programs welcome.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ─── The Only One ─────────────────────────────────── */}
        <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="max-w-4xl mx-auto px-6 py-24 text-center">
            <Reveal>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                The only voice AI built for Africa
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                {[
                  { icon: "🎙", text: "Other platforms fail on Nigerian accents" },
                  { icon: "🌍", text: "Other platforms don't support African languages" },
                  { icon: "💰", text: "Other platforms cost 2–10x more" },
                  { icon: "🔒", text: "Other platforms can't be self-hosted" },
                ].map((item) => (
                  <div key={item.text} className="text-center">
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <p className="text-sm" style={{ color: "#71717a" }}>{item.text}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─── Final CTA ────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[150px]" style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)", opacity: 0.1, animation: "pulse-glow 6s ease-in-out infinite" }} />

          <div className="relative max-w-3xl mx-auto px-6 py-28 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6" style={{ background: "linear-gradient(135deg, #fafafa, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Start building with Sabi
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="text-lg mb-10" style={{ color: "#71717a" }}>
                The voice AI infrastructure Africa has been waiting for.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="mailto:api@eduforequality.org?subject=Sabi API Access" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold btn-glow transition-all" style={{ background: "#10b981", color: "#000" }}>
                  Get API Key <ArrowIcon />
                </Link>
                <Link href="mailto:info@eduforequality.org?subject=Sabi Enterprise" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all hover:bg-white/5" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#fafafa" }}>
                  Talk to Sales
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─── Footer ───────────────────────────────────────── */}
        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="font-bold text-lg" style={{ color: "#10b981" }}>sabi</span>
              <span className="text-xs" style={{ color: "#3f3f46" }}>by Education for Equality</span>
            </div>
            <div className="flex gap-8 text-sm" style={{ color: "#3f3f46" }}>
              <Link href="/sabi" className="hover:text-white transition-colors">Sabi for Kids</Link>
              <a href="https://eduforequality.org" className="hover:text-white transition-colors">Main Site</a>
              <a href="mailto:info@eduforequality.org" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
