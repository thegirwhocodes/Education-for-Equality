import Link from "next/link";

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

export default function SabiLanding() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* ─── Hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-darker)] via-[#0a6b5a] to-[#1a5c3a]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--primary)] rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-[var(--accent)] rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 py-24 md:py-32 text-center text-white">
          <p className="text-sm uppercase tracking-widest opacity-70 mb-4">
            Education for Equality
          </p>
          <h1 className="text-5xl md:text-7xl font-bold mb-4">Sabi</h1>
          <p className="text-xl md:text-2xl opacity-90 mb-2 italic">
            /sah-bee/ — &quot;to know&quot; in Nigerian Pidgin
          </p>
          <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto mt-6 leading-relaxed">
            An AI tutor any child can reach by calling a phone number. No
            smartphone. No internet. No cost.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              href="/sabi-demo"
              className="inline-flex items-center justify-center gap-2 bg-white text-[var(--primary-darker)] px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Try the Demo
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* ─── The Problem ───────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary-darker)] mb-4">
            The Learning Crisis
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Children go to school for a decade and come out unable to read.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 text-center">
            <p className="text-5xl font-bold text-[var(--primary-darker)] mb-2">
              98M
            </p>
            <p className="text-gray-600">
              Children out of school in Sub-Saharan Africa
            </p>
            <p className="text-xs text-gray-400 mt-2">UNESCO 2024</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 text-center">
            <p className="text-5xl font-bold text-[var(--primary-darker)] mb-2">
              7 in 10
            </p>
            <p className="text-gray-600">
              Nigerian 10-year-olds who cannot read a single sentence
            </p>
            <p className="text-xs text-gray-400 mt-2">World Bank 2022</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 text-center">
            <p className="text-5xl font-bold text-[var(--primary-darker)] mb-2">
              16%
            </p>
            <p className="text-gray-600">
              Of planned learning that actually happens in schools
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Attendance × lesson completion × teacher presence
            </p>
          </div>
        </div>
      </section>

      {/* ─── The Insight ───────────────────────────────────── */}
      <section className="bg-[var(--secondary)]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary-darker)] mb-6">
              The Answer Is Already in Their Pocket
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              600 million people in Africa have no internet. But{" "}
              <strong>70% have a mobile phone</strong>. In Lagos, 95% of
              households have one. 2G coverage is 99%.
            </p>
            <p className="text-xl font-semibold text-[var(--primary-darker)]">
              What if we used the infrastructure that already exists?
            </p>
          </div>
        </div>
      </section>

      {/* ─── How It Works ──────────────────────────────────── */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary-darker)] mb-4">
            How Sabi Works
          </h2>
          <p className="text-lg text-gray-600">
            A child dials a phone number. Sabi does the rest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Flow */}
          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "Child calls the number",
                desc: "Works on any phone — even a $5 feature phone. No app, no data, no account needed.",
              },
              {
                step: "2",
                title: "Sabi greets them by name",
                desc: "New callers introduce themselves once. Returning callers are recognized instantly.",
              },
              {
                step: "3",
                title: "A lesson begins",
                desc: "Sabi teaches at the child's actual level using scenarios they know — market transactions, Naira, everyday Lagos life.",
              },
              {
                step: "4",
                title: "5-7 minutes, one concept",
                desc: "Short, focused calls. Gets harder when the child is ready. Slows down when they struggle.",
              },
              {
                step: "5",
                title: "Child calls back tomorrow",
                desc: "Sabi remembers everything — their name, their level, their mistakes. Picks up exactly where they left off.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--primary-darker)] text-white flex items-center justify-center font-bold text-sm">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-[var(--primary-darker)]">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Sample conversation */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="font-bold text-[var(--primary-darker)] mb-4">
              A Real Sabi Conversation
            </h3>
            <div className="space-y-3 text-sm">
              {[
                { who: "Sabi", text: "Hello! My name is Sabi. What is your name?" },
                { who: "Child", text: "Chidi." },
                {
                  who: "Sabi",
                  text: "Hi Chidi! Do you ever help your family at the market?",
                },
                { who: "Child", text: "Yes, I sell groundnuts." },
                {
                  who: "Sabi",
                  text: "Ah, you know business! If a customer gives you ₦500, and groundnuts cost ₦350, how much change do you give back?",
                },
                { who: "Child", text: "150." },
                {
                  who: "Sabi",
                  text: "You got it! You already know maths, Chidi — you just don't know you know it. Now let me teach you how they write that in school...",
                },
              ].map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.who === "Child" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl ${
                      msg.who === "Child"
                        ? "bg-[var(--primary-dark)] text-white rounded-br-md"
                        : "bg-gray-100 text-gray-800 rounded-bl-md"
                    }`}
                  >
                    <span
                      className={`font-semibold block mb-0.5 text-xs ${msg.who === "Child" ? "opacity-70" : "text-[var(--primary-darker)]"}`}
                    >
                      {msg.who}
                    </span>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Next day */}
            <div className="border-t border-dashed border-gray-300 my-4 relative">
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-gray-400">
                Next day
              </span>
            </div>
            <div className="flex justify-start">
              <div className="max-w-[85%] px-4 py-2.5 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-md text-sm">
                <span className="font-semibold block mb-0.5 text-xs text-[var(--primary-darker)]">
                  Sabi
                </span>
                Welcome back, Chidi! Yesterday you learned about subtraction
                using market change. You got 4 out of 5 right. Today,
                let&apos;s try adding things together...
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Why It Works (Research) ───────────────────────── */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary-darker)] mb-4">
              The Science Behind Sabi
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every design choice is backed by research from Nigeria, Ghana,
              Tanzania, Madagascar, and global RCTs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-2xl p-6">
              <p className="text-3xl font-bold text-[var(--primary-darker)] mb-1">
                9x
              </p>
              <p className="font-semibold text-gray-800 mb-2">
                Market math vs. abstract math
              </p>
              <p className="text-sm text-gray-600">
                Children solve the exact same arithmetic 9x more often when
                framed as a market transaction (48.5% vs 5.4%).
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Nature 2025, Sokoto Nigeria 2024
              </p>
            </div>

            <div className="border border-gray-200 rounded-2xl p-6">
              <p className="text-3xl font-bold text-[var(--primary-darker)] mb-1">
                1.5-2 years
              </p>
              <p className="font-semibold text-gray-800 mb-2">
                Learning gains in 6 weeks
              </p>
              <p className="text-sm text-gray-600">
                World Bank RCT in Nigeria: AI tutoring delivered 1.5-2 years of
                learning gains in just 6 weeks.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                World Bank 2024, benefit-cost ratio: 161-260
              </p>
            </div>

            <div className="border border-gray-200 rounded-2xl p-6">
              <p className="text-3xl font-bold text-[var(--primary-darker)] mb-1">
                7% → 45%
              </p>
              <p className="font-semibold text-gray-800 mb-2">
                Reading with no teachers
              </p>
              <p className="text-sm text-gray-600">
                In Tanzania, children given only tablets went from 7% to 45%
                reading ability in 15 months — without any teachers.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Global Learning XPRIZE
              </p>
            </div>

            <div className="border border-gray-200 rounded-2xl p-6">
              <p className="text-3xl font-bold text-[var(--primary-darker)] mb-1">
                $0.50-5
              </p>
              <p className="font-semibold text-gray-800 mb-2">
                Per student per year
              </p>
              <p className="text-sm text-gray-600">
                10-100x cheaper than any alternative. At $2/student, reaching
                100,000 children costs $200,000/year.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Self-hosted open-source stack
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Key Features ──────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary-darker)] mb-4">
            Built for the Last Mile
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-14 h-14 bg-[var(--secondary)] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[var(--primary-darker)]">
              <PhoneIcon />
            </div>
            <h3 className="font-bold text-lg text-[var(--primary-darker)] mb-2">
              Any Phone
            </h3>
            <p className="text-sm text-gray-600">
              Works on a $5 feature phone. No smartphone, no internet, no app
              download. Just a phone call.
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-[var(--secondary)] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[var(--primary-darker)]">
              <BrainIcon />
            </div>
            <h3 className="font-bold text-lg text-[var(--primary-darker)] mb-2">
              Persistent Memory
            </h3>
            <p className="text-sm text-gray-600">
              Sabi remembers every child — their name, their level, their
              mistakes. Picks up where they left off.
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-[var(--secondary)] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[var(--primary-darker)]">
              <HeartIcon />
            </div>
            <h3 className="font-bold text-lg text-[var(--primary-darker)] mb-2">
              Completely Free
            </h3>
            <p className="text-sm text-gray-600">
              Toll-free calls. No subscription. No paywall. Sponsored by
              Education for Equality, a 501(c)(3) nonprofit.
            </p>
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[var(--primary-darker)] to-[#1a5c3a]">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Try Sabi Right Now
          </h2>
          <p className="text-lg opacity-90 mb-8 leading-relaxed">
            We&apos;re not building another education app that sits in an app
            store. We&apos;re building something a mother hears about at church,
            dials after dinner, and hands to her child for five minutes.
          </p>
          <Link
            href="/sabi-demo"
            className="inline-flex items-center justify-center gap-2 bg-white text-[var(--primary-darker)] px-10 py-5 rounded-xl text-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Launch Demo
          </Link>
          <p className="text-sm opacity-60 mt-6">
            Lagos pilot planned Q4 2026 — 100-500 students in high-burden LGAs
          </p>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────── */}
      <footer className="bg-[var(--footer-bg)] text-white">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="font-bold text-lg">Education for Equality</p>
              <p className="text-sm opacity-60 mt-1">
                Free, world-class education for every child.
              </p>
            </div>
            <div className="flex gap-6 text-sm opacity-70">
              <a
                href="https://curriculum-app-eta.vercel.app"
                className="hover:opacity-100"
              >
                Curriculum App
              </a>
              <a
                href="https://naomiivie04.wixsite.com/mysite"
                className="hover:opacity-100"
              >
                Website
              </a>
              <a href="mailto:nivie@wesleyan.edu" className="hover:opacity-100">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
