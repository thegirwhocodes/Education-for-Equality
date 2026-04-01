import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sabi Pricing — Voice AI for Africa",
  description:
    "The only voice AI API built for African accents, languages, and infrastructure. STT, LLM, and TTS in one call. From $0.04/min.",
};

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

const tiers = [
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
      "LLM processing (Claude Haiku)",
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
    description: "For organizations scaling voice products across Africa.",
    cta: "Get Started",
    href: "mailto:api@eduforequality.org?subject=Sabi API — Pro",
    highlighted: true,
    features: [
      "Everything in Starter",
      "Custom voice cloning",
      "Accent & language selection",
      "Yoruba, Hausa, Igbo, Pidgin TTS",
      "Adaptive student memory",
      "Emotion-aware voice synthesis",
      "99.9% uptime SLA",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    unit: "",
    description: "For governments, telcos, and large-scale deployments.",
    cta: "Contact Sales",
    href: "mailto:api@eduforequality.org?subject=Sabi API — Enterprise",
    highlighted: false,
    features: [
      "Everything in Pro",
      "Custom curriculum loading",
      "White-label deployment",
      "Dedicated capacity",
      "Analytics dashboard",
      "On-premise option",
      "100% uptime SLA",
      "Dedicated account manager",
    ],
  },
];

const advantages = [
  {
    stat: "10x",
    label: "Cheaper",
    description:
      "Our self-hosted stack runs at $0.01/min. Competitors charge $0.07-0.14/min for worse African language support.",
  },
  {
    stat: "20+",
    label: "African accents",
    description:
      "Whisper fine-tuned on Nigerian English, Yoruba, Hausa, Igbo. Not an afterthought — the core product.",
  },
  {
    stat: "<500ms",
    label: "Latency",
    description:
      "Full STT → LLM → TTS pipeline under 500ms. Optimized for 2G networks and real-world noise.",
  },
  {
    stat: "0",
    label: "Vendor lock-in",
    description:
      "On-premise deployment available. Your data stays on your servers. Full stack, no external API dependencies.",
  },
];

export default function SabiAPIPage() {
  return (
    <>
      {/* Hide the main site Navbar and Footer on this page */}
      <style>{`
        body > div > nav, body > div > header,
        body > div > footer, body header, body footer,
        [class*="Navbar"], [class*="Footer"],
        body > main ~ footer, body > div > main ~ footer {
          display: none !important;
        }
        body, main {
          background: #09090b !important;
        }
      `}</style>
      <div className="min-h-screen" style={{ background: "#09090b", color: "#fafafa" }}>
      {/* ─── Nav ─────────────────────────────────────────────── */}
      <nav
        className="border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/sabi" className="flex items-center gap-2">
            <span
              className="text-lg font-bold tracking-tight"
              style={{ color: "#10b981" }}
            >
              sabi
            </span>
            <span
              className="text-xs font-mono px-2 py-0.5 rounded"
              style={{
                background: "rgba(16,185,129,0.1)",
                color: "#10b981",
                border: "1px solid rgba(16,185,129,0.2)",
              }}
            >
              API
            </span>
          </Link>
          <div className="flex items-center gap-6 text-sm" style={{ color: "#a1a1aa" }}>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <Link
              href="mailto:api@eduforequality.org?subject=Sabi API Access"
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: "#10b981",
                color: "#000",
              }}
            >
              Get API Key
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px] opacity-20"
          style={{ background: "#10b981" }}
        />
        <div
          className="absolute top-40 right-0 w-[300px] h-[300px] rounded-full blur-[100px] opacity-10"
          style={{ background: "#06b6d4" }}
        />

        <div className="relative max-w-4xl mx-auto px-6 pt-28 pb-20 text-center">
          <div
            className="inline-flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full mb-8"
            style={{
              border: "1px solid rgba(16,185,129,0.2)",
              color: "#10b981",
              background: "rgba(16,185,129,0.05)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#10b981" }}
            />
            Now accepting early access partners
          </div>

          <h1
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
            style={{
              background: "linear-gradient(to bottom, #fafafa, #71717a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Voice AI for Africa
          </h1>

          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-4 leading-relaxed"
            style={{ color: "#a1a1aa" }}
          >
            The only hosted voice AI API built for African accents, languages,
            and infrastructure. STT, LLM, and TTS — one endpoint, one call.
          </p>

          <p className="text-sm mb-10" style={{ color: "#52525b" }}>
            Nigerian English &middot; Yoruba &middot; Hausa &middot; Igbo
            &middot; Pidgin &middot; More coming
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="mailto:api@eduforequality.org?subject=Sabi API Access"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all hover:opacity-90"
              style={{ background: "#10b981", color: "#000" }}
            >
              Get Started
              <ArrowIcon />
            </Link>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all hover:bg-white/5"
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fafafa",
              }}
            >
              View Pricing
            </a>
          </div>
        </div>
      </section>

      {/* ─── Code Snippet ────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "#0f0f11",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: "#ef4444" }}
            />
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: "#eab308" }}
            />
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: "#22c55e" }}
            />
            <span
              className="ml-3 text-xs font-mono"
              style={{ color: "#52525b" }}
            >
              terminal
            </span>
          </div>
          <pre className="p-6 text-sm font-mono overflow-x-auto leading-relaxed">
            <code>
              <span style={{ color: "#10b981" }}>$</span>{" "}
              <span style={{ color: "#a1a1aa" }}>curl</span>{" "}
              <span style={{ color: "#fafafa" }}>
                https://api.eduforequality.org/v1/voice/process
              </span>{" "}
              \{"\n"}
              {"  "}-H{" "}
              <span style={{ color: "#fbbf24" }}>
                &quot;Authorization: Bearer sk_sabi_...&quot;
              </span>{" "}
              \{"\n"}
              {"  "}-H{" "}
              <span style={{ color: "#fbbf24" }}>
                &quot;Content-Type: application/json&quot;
              </span>{" "}
              \{"\n"}
              {"  "}-d{" "}
              <span style={{ color: "#fbbf24" }}>&apos;{"{"}</span>
              {"\n"}
              {"    "}
              <span style={{ color: "#60a5fa" }}>&quot;audio&quot;</span>
              <span style={{ color: "#a1a1aa" }}>:</span>{" "}
              <span style={{ color: "#fbbf24" }}>&quot;base64_audio_data&quot;</span>
              <span style={{ color: "#a1a1aa" }}>,</span>
              {"\n"}
              {"    "}
              <span style={{ color: "#60a5fa" }}>&quot;voice&quot;</span>
              <span style={{ color: "#a1a1aa" }}>:</span>{" "}
              <span style={{ color: "#fbbf24" }}>&quot;naomi&quot;</span>
              <span style={{ color: "#a1a1aa" }}>,</span>
              {"\n"}
              {"    "}
              <span style={{ color: "#60a5fa" }}>&quot;language&quot;</span>
              <span style={{ color: "#a1a1aa" }}>:</span>{" "}
              <span style={{ color: "#fbbf24" }}>&quot;en-NG&quot;</span>
              <span style={{ color: "#a1a1aa" }}>,</span>
              {"\n"}
              {"    "}
              <span style={{ color: "#60a5fa" }}>&quot;system_prompt&quot;</span>
              <span style={{ color: "#a1a1aa" }}>:</span>{" "}
              <span style={{ color: "#fbbf24" }}>
                &quot;You are a friendly health advisor...&quot;
              </span>
              {"\n"}
              {"  "}
              <span style={{ color: "#fbbf24" }}>{"}"}&apos;</span>
            </code>
          </pre>
        </div>
      </section>

      {/* ─── Why Sabi ────────────────────────────────────────── */}
      <section
        id="features"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Built for where others fail
            </h2>
            <p style={{ color: "#71717a" }} className="text-lg max-w-xl mx-auto">
              Vapi, Retell, and Bland weren&apos;t built for African markets. Sabi was.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {advantages.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl p-8 transition-all hover:border-emerald-500/20"
                style={{
                  background: "#0f0f11",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-baseline gap-2 mb-3">
                  <span
                    className="text-3xl font-bold font-mono"
                    style={{ color: "#10b981" }}
                  >
                    {item.stat}
                  </span>
                  <span
                    className="text-sm font-medium uppercase tracking-wider"
                    style={{ color: "#a1a1aa" }}
                  >
                    {item.label}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#71717a" }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Comparison ──────────────────────────────────────── */}
      <section
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-4xl mx-auto px-6 py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              The competition
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <th className="text-left py-4 pr-4 font-medium" style={{ color: "#71717a" }}>
                    Platform
                  </th>
                  <th className="text-left py-4 px-4 font-medium" style={{ color: "#71717a" }}>
                    Per-min rate
                  </th>
                  <th className="text-left py-4 px-4 font-medium" style={{ color: "#71717a" }}>
                    African accents
                  </th>
                  <th className="text-left py-4 px-4 font-medium" style={{ color: "#71717a" }}>
                    African languages
                  </th>
                  <th className="text-left py-4 pl-4 font-medium" style={{ color: "#71717a" }}>
                    Self-hostable
                  </th>
                </tr>
              </thead>
              <tbody style={{ color: "#a1a1aa" }}>
                {[
                  { name: "Vapi", rate: "$0.14", accents: "No", langs: "No", host: "No" },
                  { name: "Retell AI", rate: "$0.07+", accents: "No", langs: "No", host: "No" },
                  { name: "Bland AI", rate: "$0.09", accents: "No", langs: "No", host: "No" },
                  { name: "ElevenLabs", rate: "$0.08", accents: "Limited", langs: "Limited", host: "No" },
                ].map((row) => (
                  <tr
                    key={row.name}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <td className="py-3 pr-4">{row.name}</td>
                    <td className="py-3 px-4">{row.rate}</td>
                    <td className="py-3 px-4" style={{ color: "#ef4444" }}>{row.accents}</td>
                    <td className="py-3 px-4" style={{ color: "#ef4444" }}>{row.langs}</td>
                    <td className="py-3 pl-4" style={{ color: "#ef4444" }}>{row.host}</td>
                  </tr>
                ))}
                <tr
                  style={{
                    borderBottom: "1px solid rgba(16,185,129,0.2)",
                    background: "rgba(16,185,129,0.03)",
                  }}
                >
                  <td className="py-3 pr-4 font-bold" style={{ color: "#10b981" }}>
                    Sabi
                  </td>
                  <td className="py-3 px-4 font-bold" style={{ color: "#10b981" }}>
                    $0.04
                  </td>
                  <td className="py-3 px-4" style={{ color: "#10b981" }}>
                    Yes — built for it
                  </td>
                  <td className="py-3 px-4" style={{ color: "#10b981" }}>
                    Yoruba, Hausa, Igbo, Pidgin
                  </td>
                  <td className="py-3 pl-4" style={{ color: "#10b981" }}>
                    Yes
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── Pricing ─────────────────────────────────────────── */}
      <section
        id="pricing"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Simple, transparent pricing
            </h2>
            <p style={{ color: "#71717a" }} className="text-lg">
              Pay per minute. No hidden fees. No contracts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className="rounded-2xl p-8 flex flex-col relative"
                style={{
                  background: tier.highlighted
                    ? "linear-gradient(to bottom, rgba(16,185,129,0.08), rgba(16,185,129,0.02))"
                    : "#0f0f11",
                  border: tier.highlighted
                    ? "1px solid rgba(16,185,129,0.3)"
                    : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {tier.highlighted && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-4 py-1 rounded-full"
                    style={{
                      background: "#10b981",
                      color: "#000",
                    }}
                  >
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold font-mono">
                      {tier.price}
                    </span>
                    <span className="text-sm" style={{ color: "#71717a" }}>
                      {tier.unit}
                    </span>
                  </div>
                  <p
                    className="text-sm mt-3 leading-relaxed"
                    style={{ color: "#71717a" }}
                  >
                    {tier.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm"
                      style={{ color: "#a1a1aa" }}
                    >
                      <span
                        className="mt-0.5 flex-shrink-0"
                        style={{ color: "#10b981" }}
                      >
                        <CheckIcon />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={tier.href}
                  className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all"
                  style={
                    tier.highlighted
                      ? { background: "#10b981", color: "#000" }
                      : {
                          background: "transparent",
                          color: "#fafafa",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }
                  }
                >
                  {tier.cta}
                  <ArrowIcon />
                </Link>
              </div>
            ))}
          </div>

          <p
            className="text-center text-sm mt-8"
            style={{ color: "#52525b" }}
          >
            Volume discounts available for 1M+ minutes/month.
            On-premise deployment starts at $3,000/mo.
          </p>
        </div>
      </section>

      {/* ─── Use Cases ───────────────────────────────────────── */}
      <section
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Built for every voice application
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Education",
                description:
                  "AI tutors that speak local languages and understand children's voices. Sabi was born here.",
                tag: "What we built it for",
              },
              {
                title: "Healthcare",
                description:
                  "Voice-based health information for low-literacy populations. Maternal health, disease prevention, medication reminders.",
                tag: "High demand",
              },
              {
                title: "Financial Services",
                description:
                  "Voice banking, loan applications, and customer service in local accents. Replace expensive call centers.",
                tag: "High margin",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl p-8"
                style={{
                  background: "#0f0f11",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span
                  className="text-xs font-mono px-2 py-1 rounded mb-4 inline-block"
                  style={{
                    background: "rgba(16,185,129,0.1)",
                    color: "#10b981",
                    border: "1px solid rgba(16,185,129,0.15)",
                  }}
                >
                  {item.tag}
                </span>
                <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#71717a" }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ───────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] opacity-15"
          style={{ background: "#10b981" }}
        />

        <div
          className="relative max-w-3xl mx-auto px-6 py-24 text-center"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Start building with Sabi
          </h2>
          <p className="text-lg mb-8" style={{ color: "#71717a" }}>
            The voice AI infrastructure Africa has been waiting for.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="mailto:api@eduforequality.org?subject=Sabi API Access"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all hover:opacity-90"
              style={{ background: "#10b981", color: "#000" }}
            >
              Get API Key
              <ArrowIcon />
            </Link>
            <Link
              href="mailto:api@eduforequality.org?subject=Sabi Enterprise"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all hover:bg-white/5"
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fafafa",
              }}
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold" style={{ color: "#10b981" }}>
              sabi
            </span>
            <span className="text-sm" style={{ color: "#52525b" }}>
              by Education for Equality
            </span>
          </div>
          <div
            className="flex gap-6 text-sm"
            style={{ color: "#52525b" }}
          >
            <Link href="/sabi" className="hover:text-white transition-colors">
              Sabi for Kids
            </Link>
            <a
              href="https://eduforequality.org"
              className="hover:text-white transition-colors"
            >
              Main Site
            </a>
            <a
              href="mailto:api@eduforequality.org"
              className="hover:text-white transition-colors"
            >
              api@eduforequality.org
            </a>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
