import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section — photo background with overlay */}
      <section className="relative overflow-hidden">
        <Image
          src="/hero-children.jpg"
          alt="Smiling children in Africa"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary-darker)]/85 via-[var(--primary-darker)]/75 to-[#0a6b5a]/85" />

        <div className="relative max-w-5xl mx-auto px-6 py-24 md:py-32 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-5 py-2 text-sm mb-8 border border-white/20">
            <span className="font-medium">Foundational + Cambridge-Aligned</span>
            <span className="opacity-40">|</span>
            <span className="opacity-80">Ages 8-14</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Empowering Learners<br className="hidden md:block" /> Across Africa
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed mb-10">
            70% of children in low-income countries cannot read a simple sentence by age 10.
            Millions of adults never got the chance to learn. We deliver free, AI-powered
            literacy and numeracy courses to anyone who needs them — on any phone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/subjects/foundational-literacy"
              className="inline-flex items-center justify-center gap-2 bg-white text-[var(--primary-darker)] px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Foundational Literacy
            </Link>
            <Link
              href="/subjects/foundational-numeracy"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Foundational Numeracy
            </Link>
          </div>
        </div>
      </section>

      {/* The Crisis Section — white cards with shadows */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary-darker)] mb-4">
            The Learning Crisis
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Millions of children and adults lack the foundational skills to read, write, or do basic math — skills that unlock everything else.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-8 text-center shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <p className="text-5xl font-bold text-[var(--primary-darker)] mb-3">
              70%
            </p>
            <p className="text-gray-600">
              Of 10-year-olds in Nigeria cannot read and understand a simple sentence
            </p>
            <p className="text-xs text-gray-400 mt-3">World Bank / UNICEF 2022</p>
          </div>
          <div className="bg-white rounded-2xl p-8 text-center shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <p className="text-5xl font-bold text-[var(--primary-darker)] mb-3">
              35%
            </p>
            <p className="text-gray-600">
              Average score on everyday math — the weakest domain at every grade level
            </p>
            <p className="text-xs text-gray-400 mt-3">NALABE National Assessment, 43,200 students</p>
          </div>
          <div className="bg-white rounded-2xl p-8 text-center shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <p className="text-5xl font-bold text-[var(--primary-darker)] mb-3">
              $40B
            </p>
            <p className="text-gray-600">
              Lost every year in Nigeria from an under-educated workforce — roughly 8% of GDP
            </p>
            <p className="text-xs text-gray-400 mt-3">SBM Intelligence</p>
          </div>
        </div>
      </section>

      {/* Insight bridge — colored background for visual break */}
      <section className="bg-[var(--secondary)]">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary-darker)] mb-6">
            Learning Is Worth 4x More Than Attendance
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            A child who spends 10 years in school but can&apos;t read earns almost nothing more
            than one who never attended. But a child who <strong>can read</strong> earns
            <strong> NGN 4.4 million more</strong> over a lifetime — same years, dramatically different life.
          </p>
          <p className="text-sm text-gray-500 mt-4">Aromolaran (2004), World Bank HCI+ 2026</p>
        </div>
      </section>

      {/* Our Courses Section */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary-darker)] mb-4">
            Free Foundational Courses
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            For children and adults who never had the chance to learn. AI-powered voice lessons that meet every learner where they are.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Literacy Course Card */}
          <Link href="/subjects/foundational-literacy" className="group">
            <div className="relative bg-gradient-to-br from-[var(--primary-darker)] to-[#0a6b5a] rounded-2xl p-8 text-white h-full shadow-lg group-hover:shadow-2xl transition-all group-hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
              <div className="relative">
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
                <span className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
                  Start Reading
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>

          {/* Numeracy Course Card */}
          <Link href="/subjects/foundational-numeracy" className="group">
            <div className="relative bg-gradient-to-br from-[#1a3a5c] to-[#0d2847] rounded-2xl p-8 text-white h-full shadow-lg group-hover:shadow-2xl transition-all group-hover:-translate-y-1">
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
              <div className="relative">
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
                <span className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
                  Start Math
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Economic Gains Section — research-backed cards with borders */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary-darker)] mb-4">
              The Economic Case for Foundational Skills
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Investing in foundational literacy and numeracy isn&apos;t charity — it&apos;s the highest-return investment a government can make.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-2xl p-8 hover:shadow-md transition-shadow">
              <p className="text-4xl font-bold text-[var(--primary-dark)] mb-2">+20%</p>
              <p className="font-semibold text-gray-800 mb-2">Boost in labor earnings</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                If schools delivered effective foundational learning, labor earnings would rise by 20%. A child who can actually read earns NGN 4.4 million more over a lifetime than one who sat in school the same years but can&apos;t.
              </p>
              <p className="text-xs text-gray-400 mt-3">World Bank HCI+ 2026 / Aromolaran (2004)</p>
            </div>
            <div className="border border-gray-200 rounded-2xl p-8 hover:shadow-md transition-shadow">
              <p className="text-4xl font-bold text-[var(--primary-dark)] mb-2">161-260x</p>
              <p className="font-semibold text-gray-800 mb-2">Return on AI tutoring investment</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                AI tutoring in Nigerian public schools produced 1.5-2 years of learning gains in just 6 weeks, with a benefit-cost ratio of 161-260. No other education intervention comes close.
              </p>
              <p className="text-xs text-gray-400 mt-3">World Bank RCT, Edo State 2024</p>
            </div>
            <div className="border border-gray-200 rounded-2xl p-8 hover:shadow-md transition-shadow">
              <p className="text-4xl font-bold text-[var(--primary-dark)] mb-2">$40B/yr</p>
              <p className="font-semibold text-gray-800 mb-2">Recoverable lost productivity</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Nigeria currently loses $40 billion annually — 8% of GDP — from an under-educated workforce. Foundational skills programs can recover a significant share of this, generating returns that dwarf the investment.
              </p>
              <p className="text-xs text-gray-400 mt-3">SBM Intelligence</p>
            </div>
            <div className="border border-gray-200 rounded-2xl p-8 hover:shadow-md transition-shadow">
              <p className="text-4xl font-bold text-[var(--primary-dark)] mb-2">47M</p>
              <p className="font-semibold text-gray-800 mb-2">People lifted from poverty across Africa</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Quality foundational education could lift 47 million people out of poverty across Sub-Saharan Africa and add $368 billion to the continent&apos;s GDP — a 4.3% increase.
              </p>
              <p className="text-xs text-gray-400 mt-3">ISS Africa</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section — icons with colored backgrounds */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary-darker)] mb-4">
            Why Learn With Us?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-[var(--secondary)] rounded-2xl flex items-center justify-center mx-auto mb-5 text-[var(--primary-darker)]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-[var(--primary-darker)] mb-2">100% Free</h3>
            <p className="text-sm text-gray-600">
              Every lesson is completely free. No hidden costs, no subscriptions, ever.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-[var(--secondary)] rounded-2xl flex items-center justify-center mx-auto mb-5 text-[var(--primary-darker)]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-[var(--primary-darker)] mb-2">Works on Any Phone</h3>
            <p className="text-sm text-gray-600">
              Voice-guided lessons on any phone. No smartphone needed, no internet required.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-[var(--secondary)] rounded-2xl flex items-center justify-center mx-auto mb-5 text-[var(--primary-darker)]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-[var(--primary-darker)] mb-2">AI That Adapts</h3>
            <p className="text-sm text-gray-600">
              Sabi remembers where each learner left off and adapts to their level automatically.
            </p>
          </div>
        </div>
      </section>

      {/* Founder's Story */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-3 bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary-darker)] rounded-2xl opacity-20 blur-lg" />
                <Image
                  src="/founder-naomi.png"
                  alt="Naomi Ivie, Founder of Education for Equality"
                  width={360}
                  height={360}
                  className="relative rounded-2xl object-cover shadow-lg"
                />
              </div>
            </div>
            <div>
              <p className="text-sm uppercase tracking-widest text-[var(--primary-dark)] font-medium mb-4">Our Founder</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary-darker)] mb-6">
                Why I Started This
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Growing up in Lagos, Nigeria, I attended my secondary school on a scholarship and a discount based on my mother&apos;s salary as a teacher. Sometimes my family didn&apos;t have food to eat.
                </p>
                <p>
                  On the way to school every day, I saw children my age hawking wares or fixing cars so their families could survive. I knew there was no difference between me and them. Without the grace of God and the extreme sacrifices of my parents, I would have been one of those kids.
                </p>
                <p>
                  Education gave me a way out. Now I want to extend the same opportunity to every child who didn&apos;t get one. If we can teach people across Africa to solve problems around them, we can set off a chain reaction of transformation across the continent.
                </p>
              </div>
              <p className="mt-6 font-semibold text-[var(--primary-darker)]">
                Naomi Ivie
              </p>
              <p className="text-sm text-gray-500">Founder, Education for Equality</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grade 4 Curriculum - subtle mention */}
      <section className="bg-[var(--secondary)]">
        <div className="max-w-4xl mx-auto px-6 py-14 text-center">
          <p className="text-gray-700 mb-3 text-lg">
            Already reading? We also offer a full Cambridge-aligned Grade 4 curriculum.
          </p>
          <Link href="/curriculum/grade-4" className="text-[var(--primary-dark)] font-semibold hover:text-[var(--primary-darker)] transition-colors inline-flex items-center gap-1 text-lg">
            Browse Grade 4 Lessons
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Partner CTA Section */}
      <section className="bg-gradient-to-br from-[var(--primary-darker)] to-[#1a5c3a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--primary)] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--accent)] rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 py-20 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Partner With Us
          </h2>
          <p className="text-lg opacity-90 mb-10 max-w-2xl mx-auto leading-relaxed">
            We&apos;re looking for governments, NGOs, schools, and organizations to bring foundational literacy
            and numeracy to every learner who needs it. Let&apos;s work together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@educationforequality.org"
              className="inline-flex items-center justify-center gap-2 bg-white text-[var(--primary-darker)] px-10 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Get in Touch
            </a>
            <Link href="/sabi" className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-colors">
              Try the Course
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
