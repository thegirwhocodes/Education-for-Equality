import Image from "next/image";
import Link from "next/link";
import { SABI_FAQS } from "@/lib/seo";

function PhoneIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A5.5 5.5 0 0 0 4 7.5c0 1.5.5 2.9 1.4 4L12 21l6.6-9.5A5.5 5.5 0 0 0 12 2.5 5.5 5.5 0 0 0 9.5 2z" />
      <path d="M12 2.5V21" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function SabiLanding() {
  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden border-b sabi-hero">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32 text-center">
          <Image src="/sabi-spark.svg" alt="" width={48} height={51} className="sabi-spark-mark mx-auto mb-6" />
          <p className="sabi-byline mb-4">
            Education for Equality
          </p>
          <h1 className="mb-4">
            <span className="sabi-display text-6xl md:text-8xl block">Sabi</span>
            <span className="block text-xl md:text-3xl mt-4 font-normal text-[var(--sabi-text-secondary)]">
              The free AI tutor children reach by phone call
            </span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--sabi-text-secondary)] mb-2 italic">
            /sah-bee/ — &quot;to know&quot; in Nigerian Pidgin
          </p>
          <p className="text-lg md:text-xl text-[var(--sabi-muted)] max-w-2xl mx-auto mt-6 leading-relaxed">
            A child dials a number and gets foundational reading and maths in five-minute
            spoken lessons. No smartphone. No internet. No cost.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link href="/demo" className="sabi-btn-gold inline-flex items-center justify-center gap-2 px-8 py-4 text-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
              Talk to Sabi
            </Link>
            <Link href="/chat" className="sabi-btn-secondary inline-flex items-center justify-center gap-2 px-8 py-4 text-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Chat with Sabi
            </Link>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="sabi-section-crisis">
        <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="sabi-display text-3xl md:text-4xl mb-4">The Learning Crisis</h2>
          <p className="text-lg text-[var(--sabi-muted)] max-w-2xl mx-auto">
            Children go to school for a decade and come out unable to read.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { stat: "98M", label: "Children out of school in Sub-Saharan Africa", cite: "UNESCO 2024" },
            { stat: "7 in 10", label: "Nigerian 10-year-olds who cannot read a single sentence", cite: "World Bank 2022" },
            { stat: "16%", label: "Of planned learning that actually happens in schools", cite: "Attendance × lesson completion × teacher presence" },
          ].map((item) => (
            <div key={item.stat} className="sabi-card p-8 text-center">
              <p className="sabi-stat-value text-5xl mb-2">{item.stat}</p>
              <p className="text-[var(--sabi-text-secondary)]">{item.label}</p>
              <p className="text-xs text-[var(--sabi-meta)] mt-2">{item.cite}</p>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* Insight */}
      <section className="sabi-section-answer border-y" style={{ borderColor: "var(--sabi-border)" }}>
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="sabi-display text-3xl md:text-4xl mb-6">The Answer Is Already in Their Pocket</h2>
            <p className="text-lg text-[var(--sabi-text-secondary)] leading-relaxed mb-8">
              600 million people in Africa have no internet. But <strong className="text-[var(--sabi-text)]">70% have a mobile phone</strong>.
              In Lagos, 95% of households have one. 2G coverage is 99%.
            </p>
            <p className="text-xl font-semibold text-[var(--sabi-gold-deep)]">
              What if we used the infrastructure that already exists?
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="sabi-section-how">
        <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="sabi-display text-3xl md:text-4xl mb-4">How Sabi Works</h2>
          <p className="text-lg text-[var(--sabi-muted)]">A child dials a phone number. Sabi does the rest.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {[
              { step: "1", title: "Child calls the number", desc: "Works on any phone — even a $5 feature phone. No app, no data, no account needed." },
              { step: "2", title: "Sabi greets them by name", desc: "New callers introduce themselves once. Returning callers are recognized instantly." },
              { step: "3", title: "A lesson begins", desc: "Sabi teaches at the child's actual level using scenarios they know — market transactions, Naira, everyday Lagos life." },
              { step: "4", title: "5-7 minutes, one concept", desc: "Short, focused calls. Gets harder when the child is ready. Slows down when they struggle." },
              { step: "5", title: "Child calls back tomorrow", desc: "Sabi remembers everything — their name, their level, their mistakes. Picks up exactly where they left off." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="sabi-step-num flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--sabi-ink)]">{item.title}</h3>
                  <p className="text-sm text-[var(--sabi-muted)] mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="sabi-card p-6">
            <h3 className="font-semibold text-[var(--sabi-ink)] mb-4">A Real Sabi Conversation</h3>
            <div className="space-y-3 text-sm">
              {[
                { who: "Sabi", text: "Hello! My name is Sabi. What is your name?" },
                { who: "Child", text: "Chidi." },
                { who: "Sabi", text: "Hi Chidi! Do you ever help your family at the market?" },
                { who: "Child", text: "Yes, I sell groundnuts." },
                { who: "Sabi", text: "Ah, you know business! If a customer gives you ₦500, and groundnuts cost ₦350, how much change do you give back?" },
                { who: "Child", text: "150." },
                { who: "Sabi", text: "You got it! You already know maths, Chidi — you just don't know you know it. Now let me teach you how they write that in school..." },
              ].map((msg, i) => (
                <div key={i} className={`flex ${msg.who === "Child" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${msg.who === "Child" ? "sabi-chat-child rounded-br-md" : "sabi-chat-sabi rounded-bl-md"}`}>
                    <span className={`font-semibold block mb-0.5 text-xs ${msg.who === "Child" ? "text-[var(--sabi-muted)]" : "text-[var(--sabi-gold-deep)]"}`}>
                      {msg.who}
                    </span>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed my-4 relative" style={{ borderColor: "var(--sabi-border)" }}>
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--sabi-surface)] px-3 text-xs text-[var(--sabi-meta)]">
                Next day
              </span>
            </div>
            <div className="flex justify-start">
              <div className="max-w-[85%] px-4 py-2.5 rounded-2xl sabi-chat-sabi rounded-bl-md text-sm">
                <span className="font-semibold block mb-0.5 text-xs text-[var(--sabi-gold-deep)]">Sabi</span>
                Welcome back, Chidi! Yesterday you learned about subtraction using market change. You got 4 out of 5 right. Today, let&apos;s try adding things together...
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Research */}
      <section className="sabi-section-alt border-y" style={{ borderColor: "var(--sabi-border)" }}>
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="sabi-display text-3xl md:text-4xl mb-4">The Science Behind Sabi</h2>
            <p className="text-lg text-[var(--sabi-muted)] max-w-2xl mx-auto">
              Every design choice is backed by research from Nigeria, Ghana, Tanzania, Madagascar, and global RCTs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { stat: "9x", title: "Market math vs. abstract math", desc: "Children solved comparable subtraction tasks 9x more often in market framing than in formal school format (48.5% vs 5.4%).", cite: "Weber, Bogler & Vollmer 2024, North-West Nigeria" },
              { stat: "1.5-2 years", title: "Learning gains in 6 weeks", desc: "World Bank RCT in Nigeria: AI tutoring delivered 1.5-2 years of learning gains in just 6 weeks.", cite: "World Bank 2024, benefit-cost ratio: 161-260" },
              { stat: "7% → 45%", title: "Reading with no teachers", desc: "In Tanzania, children given only tablets went from 7% to 45% reading ability in 15 months — without any teachers.", cite: "Global Learning XPRIZE" },
              { stat: "$0.50-5", title: "Per student per year", desc: "10-100x cheaper than any alternative. At $2/student, reaching 100,000 children costs $200,000/year.", cite: "Self-hosted open-source stack" },
            ].map((item) => (
              <div key={item.stat} className="sabi-card p-6">
                <p className="sabi-stat-value text-3xl mb-1">{item.stat}</p>
                <p className="font-semibold text-[var(--sabi-text)] mb-2">{item.title}</p>
                <p className="text-sm text-[var(--sabi-muted)]">{item.desc}</p>
                <p className="text-xs text-[var(--sabi-meta)] mt-2">{item.cite}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="sabi-section-last-mile">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="sabi-display text-3xl md:text-4xl mb-4">Built for the Last Mile</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <PhoneIcon />, title: "Any Phone", desc: "Works on a $5 feature phone. No smartphone, no internet, no app download. Just a phone call." },
              { icon: <BrainIcon />, title: "Persistent Memory", desc: "Sabi remembers every child — their name, their level, their mistakes. Picks up where they left off." },
              { icon: <HeartIcon />, title: "Completely Free", desc: "Toll-free calls. No subscription. No paywall. Sponsored by Education for Equality, a 501(c)(3) nonprofit." },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="sabi-icon-box w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <Link
            href="/sabi/pricing"
            className="group sabi-card p-8 md:p-10 mt-14 flex flex-col md:flex-row md:items-center gap-6 justify-between sabi-pricing-org-callout"
          >
            <div>
              <p className="text-xs uppercase tracking-widest sabi-accent-label mb-2">For developers &amp; organizations</p>
              <h3 className="sabi-display text-2xl mb-2">Build on the Sabi voice API — or fund a cohort</h3>
              <p className="text-sm text-[var(--sabi-muted)] max-w-xl">
                The same African-accent voice pipeline behind Sabi, rentable per minute. Speech-to-text, LLM, and Nigerian voice in one call — from $0.06/min, 1,000 minutes free every month.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 flex-shrink-0 font-medium text-[var(--sabi-ink)] group-hover:gap-3 transition-all">
              See pricing <ArrowIcon />
            </span>
          </Link>
        </div>
      </section>

      {/* FAQ — the visible source of the FAQPage structured data in layout.tsx.
          Both render from SABI_FAQS so the markup and the schema stay identical. */}
      <section className="sabi-section-crisis border-t">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="sabi-display text-3xl md:text-4xl mb-4">
              Common questions about Sabi
            </h2>
          </div>

          <dl className="flex flex-col gap-8">
            {SABI_FAQS.map((faq) => (
              <div key={faq.question}>
                <dt className="font-semibold text-lg mb-2">{faq.question}</dt>
                <dd className="text-[var(--sabi-muted)] leading-relaxed">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t sabi-pricing-cta">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h2 className="sabi-display text-3xl md:text-4xl mb-4">Try Sabi Right Now</h2>
          <p className="text-lg text-[var(--sabi-text-secondary)] mb-8 leading-relaxed">
            We&apos;re not building another education app that sits in an app store. We&apos;re building something a mother hears about at church, dials after dinner, and hands to her child for five minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo" className="sabi-btn-gold inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg font-bold">
              Talk to Sabi
            </Link>
            <Link href="/chat" className="sabi-cta-secondary inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold border-2">
              Chat with Sabi
            </Link>
          </div>
          <p className="text-sm text-[var(--sabi-meta)] mt-6">
            Lagos pilot planned Q4 2026 — 100-500 students in high-burden LGAs
          </p>
        </div>
      </section>
    </div>
  );
}
