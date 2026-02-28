import Link from 'next/link';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--secondary)] to-[var(--accent)] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/60 rounded-full px-4 py-1.5 text-sm mb-6">
              <span className="text-[var(--primary-dark)] font-medium">Foundational + Cambridge-Aligned</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">Ages 8-14</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--primary-darker)] mb-6">
              Literacy & Numeracy for Every Learner
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-muted)] mb-8">
              70% of children in low-income countries cannot read a simple sentence by age 10.
              Millions of adults never got the chance to learn. We deliver free, AI-powered
              literacy and numeracy courses to anyone who needs them — on any phone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/subjects/foundational-literacy" className="btn-primary text-center">
                Foundational Literacy
              </Link>
              <Link href="/subjects/foundational-numeracy" className="btn-primary text-center">
                Foundational Numeracy
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Crisis Section */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[var(--primary-darker)] mb-4">
              The Learning Crisis
            </h2>
            <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
              Millions of children and adults lack the foundational skills to read, write, or do basic math — skills that unlock everything else.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[var(--background)] rounded-2xl p-8 text-center border border-gray-100">
              <p className="text-4xl md:text-5xl font-bold text-[var(--primary-darker)] mb-2">
                70%
              </p>
              <p className="text-[var(--text-muted)]">
                Of 10-year-olds in Nigeria cannot read and understand a simple sentence
              </p>
              <p className="text-xs text-gray-400 mt-2">World Bank / UNICEF 2022</p>
            </div>
            <div className="bg-[var(--background)] rounded-2xl p-8 text-center border border-gray-100">
              <p className="text-4xl md:text-5xl font-bold text-[var(--primary-darker)] mb-2">
                35%
              </p>
              <p className="text-[var(--text-muted)]">
                Average score on everyday math — applying math to real situations is the weakest domain at every grade level
              </p>
              <p className="text-xs text-gray-400 mt-2">NALABE National Assessment, 43,200 students</p>
            </div>
            <div className="bg-[var(--background)] rounded-2xl p-8 text-center border border-gray-100">
              <p className="text-4xl md:text-5xl font-bold text-[var(--primary-darker)] mb-2">
                $40B
              </p>
              <p className="text-[var(--text-muted)]">
                Lost every year in Nigeria from an under-educated workforce — roughly 8% of GDP
              </p>
              <p className="text-xs text-gray-400 mt-2">SBM Intelligence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Courses Section */}
      <section className="py-16 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Free Foundational Courses
            </h2>
            <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
              For children and adults who never had the chance to learn. AI-powered voice lessons that meet every learner where they are.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Literacy Course Card */}
            <Link href="/subjects/foundational-literacy">
              <div className="relative bg-gradient-to-br from-[var(--primary-darker)] to-[#0a6b5a] rounded-2xl p-8 text-white h-full hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-xs font-medium mb-4">
                  <span className="w-2 h-2 bg-[var(--primary)] rounded-full animate-pulse" />
                  COURSE
                </div>
                <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center mb-5">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">Foundational Literacy</h3>
                <p className="text-white/80 mb-6 leading-relaxed">
                  Learn to read from scratch. From letter sounds to full sentences — voice-guided lessons that work on any phone, no smartphone needed.
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold">
                  Start Reading
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Numeracy Course Card */}
            <Link href="/subjects/foundational-numeracy">
              <div className="relative bg-gradient-to-br from-[#1a3a5c] to-[#0d2847] rounded-2xl p-8 text-white h-full hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-xs font-medium mb-4">
                  <span className="w-2 h-2 bg-[var(--primary)] rounded-full animate-pulse" />
                  COURSE
                </div>
                <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center mb-5">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">Foundational Numeracy</h3>
                <p className="text-white/80 mb-6 leading-relaxed">
                  Master counting, addition, subtraction, multiplication, and real-world math — using everyday market scenarios learners already understand.
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold">
                  Start Math
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Economic Gains Section — solution-oriented, data from EfE research files */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--primary-darker)] mb-4">
              The Economic Case for Foundational Skills
            </h2>
            <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
              Investing in foundational literacy and numeracy isn&apos;t charity — it&apos;s the highest-return investment a government can make.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[var(--background)] rounded-2xl p-8 border border-gray-100">
              <p className="text-3xl md:text-4xl font-bold text-[var(--primary-dark)] mb-3">+20%</p>
              <p className="text-gray-700 font-medium mb-2">Boost in labor earnings</p>
              <p className="text-sm text-[var(--text-muted)]">
                If schools delivered effective foundational learning, labor earnings would rise by 20%. A child who can actually read earns NGN 4.4 million more over a lifetime than one who sat in school the same years but can&apos;t.
              </p>
              <p className="text-xs text-gray-400 mt-3">World Bank HCI+ 2026 / Aromolaran (2004)</p>
            </div>
            <div className="bg-[var(--background)] rounded-2xl p-8 border border-gray-100">
              <p className="text-3xl md:text-4xl font-bold text-[var(--primary-dark)] mb-3">161-260x</p>
              <p className="text-gray-700 font-medium mb-2">Return on AI tutoring investment</p>
              <p className="text-sm text-[var(--text-muted)]">
                AI tutoring in Nigerian public schools produced 1.5-2 years of learning gains in just 6 weeks, with a benefit-cost ratio of 161-260. No other education intervention comes close.
              </p>
              <p className="text-xs text-gray-400 mt-3">World Bank RCT, Edo State 2024</p>
            </div>
            <div className="bg-[var(--background)] rounded-2xl p-8 border border-gray-100">
              <p className="text-3xl md:text-4xl font-bold text-[var(--primary-dark)] mb-3">$40B/yr</p>
              <p className="text-gray-700 font-medium mb-2">Recoverable lost productivity</p>
              <p className="text-sm text-[var(--text-muted)]">
                Nigeria currently loses $40 billion annually — 8% of GDP — from an under-educated workforce. Foundational skills programs can recover a significant share of this, generating returns that dwarf the investment.
              </p>
              <p className="text-xs text-gray-400 mt-3">SBM Intelligence</p>
            </div>
            <div className="bg-[var(--background)] rounded-2xl p-8 border border-gray-100">
              <p className="text-3xl md:text-4xl font-bold text-[var(--primary-dark)] mb-3">47M</p>
              <p className="text-gray-700 font-medium mb-2">People lifted from poverty across Africa</p>
              <p className="text-sm text-[var(--text-muted)]">
                Quality foundational education could lift 47 million people out of poverty across Sub-Saharan Africa and add $368 billion to the continent&apos;s GDP — a 4.3% increase.
              </p>
              <p className="text-xs text-gray-400 mt-3">ISS Africa</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Learn With Us?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <svg className="w-8 h-8 text-[var(--primary-dark)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">100% Free</h3>
              <p className="text-[var(--text-muted)]">
                Every lesson is completely free. No hidden costs, no subscriptions, ever.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <svg className="w-8 h-8 text-[var(--primary-dark)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Works on Any Phone</h3>
              <p className="text-[var(--text-muted)]">
                Voice-guided lessons on any phone. No smartphone needed, no internet required.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <svg className="w-8 h-8 text-[var(--primary-dark)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">AI That Adapts</h3>
              <p className="text-[var(--text-muted)]">
                Sabi remembers where each learner left off and adapts to their level automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Grade 4 Curriculum - subtle mention */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-[var(--text-muted)] mb-3">
            Already reading? We also offer a full Cambridge-aligned Grade 4 curriculum.
          </p>
          <Link href="/curriculum/grade-4" className="text-[var(--primary-dark)] font-semibold hover:text-[var(--primary-darker)] transition-colors inline-flex items-center gap-1">
            Browse Grade 4 Lessons
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Partner CTA Section */}
      <section className="py-16 bg-[var(--primary-dark)]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Partner With Us
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            We&apos;re looking for governments, NGOs, schools, and organizations to bring foundational literacy
            and numeracy to every learner who needs it. Let&apos;s work together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@educationforequality.org"
              className="inline-block bg-white text-[var(--primary-dark)] font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get in Touch
            </a>
            <Link href="/sabi" className="inline-block border-2 border-white/40 text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors">
              Try the Course
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
