import Link from 'next/link';
import { subjects } from '@/lib/curriculum';
import { grade4Curriculum, getTotalLessons } from '@/lib/cambridge-grade4-curriculum';

// Calculate Grade 4 totals
const grade4Subjects = Object.values(grade4Curriculum);
const totalGrade4Lessons = grade4Subjects.reduce((acc, s) => acc + getTotalLessons(s), 0);
const totalGrade4Units = grade4Subjects.reduce((acc, s) => acc + s.units.length, 0);

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--secondary)] to-[var(--accent)] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/60 rounded-full px-4 py-1.5 text-sm mb-6">
              <span className="text-[var(--primary-dark)] font-medium">Cambridge-Aligned</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">Grade 4 Now Available</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--primary-darker)] mb-6">
              Free Quality Education for Every Child
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-muted)] mb-8">
              From foundational literacy and numeracy to full Cambridge-aligned courses.
              Designed for children in Nigeria and across Africa — whether you&apos;re learning
              to read for the first time or building on existing skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sabi" className="btn-primary text-center">
                Literacy
              </Link>
              <Link href="/sabi" className="btn-primary text-center">
                Numeracy
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <blockquote className="text-2xl md:text-3xl font-serif italic text-gray-700">
            &ldquo;Education is the most powerful weapon which you can use to change the world.&rdquo;
          </blockquote>
          <p className="mt-4 text-[var(--text-muted)]">&mdash; Nelson Mandela</p>
        </div>
      </section>

      {/* Choose Your Path */}
      <section className="py-16 bg-[var(--background)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Start Where You Are
            </h2>
            <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
              Every learner is different. Choose the path that fits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/sabi">
              <div className="bg-white rounded-2xl p-8 border border-gray-200 h-full hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-[var(--secondary)] rounded-lg flex items-center justify-center text-2xl mb-4">
                  <svg className="w-6 h-6 text-[var(--primary-dark)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">First-Time Learners</h3>
                <p className="text-[var(--text-muted)] mb-4">
                  Never learned to read or do math? Start here. Foundational literacy and numeracy courses built for children and adults starting from scratch.
                </p>
                <span className="text-[var(--primary-dark)] font-semibold text-sm inline-flex items-center gap-1">
                  Start Literacy & Numeracy
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>

            <Link href="/curriculum/grade-4">
              <div className="bg-white rounded-2xl p-8 border border-gray-200 h-full hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-[var(--secondary)] rounded-lg flex items-center justify-center text-2xl mb-4">
                  <svg className="w-6 h-6 text-[var(--primary-dark)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">Learners With Basic Reading</h3>
                <p className="text-[var(--text-muted)] mb-4">
                  Can already read and do basic math? Jump into our Cambridge-aligned Grade 4 curriculum — {totalGrade4Lessons} lessons across Math, English, Science, and Social Studies.
                </p>
                <span className="text-[var(--primary-dark)] font-semibold text-sm inline-flex items-center gap-1">
                  Start Grade 4
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* The Cost of Not Learning — Economic Case */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--primary-darker)] mb-4">
              The Lifetime Cost of the Learning Crisis
            </h2>
            <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
              Children spend 10 years in school but receive only 5 years of actual education. The return per year of school in Nigeria is just 2-4% — far below the global average of 10%.
            </p>
          </div>

          {/* Earnings Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">No School</p>
              <p className="text-2xl font-bold text-gray-400 mb-1">NGN 20,000<span className="text-base font-normal">/mo</span></p>
              <p className="text-sm text-gray-400">NGN 9.6M lifetime</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Primary Done, Can&apos;t Read</p>
              <p className="text-2xl font-bold text-gray-500 mb-1">NGN 22,500<span className="text-base font-normal">/mo</span></p>
              <p className="text-sm text-gray-400">NGN 10.8M lifetime</p>
            </div>
            <div className="bg-[var(--secondary)] rounded-2xl p-6 text-center border-2 border-[var(--primary-dark)]">
              <p className="text-xs uppercase tracking-wider text-[var(--primary-dark)] mb-2">Primary Done, Can Read</p>
              <p className="text-2xl font-bold text-[var(--primary-darker)] mb-1">NGN 31,700<span className="text-base font-normal">/mo</span></p>
              <p className="text-sm text-[var(--primary-dark)]">NGN 15.2M lifetime</p>
            </div>
          </div>

          <div className="text-center mb-14">
            <p className="text-xl font-bold text-[var(--primary-darker)]">
              &ldquo;Learning is worth 4x more than attendance.&rdquo;
            </p>
            <p className="text-sm text-[var(--text-muted)] mt-2">
              Same years in school. Dramatically different life. — Aromolaran (2004) / World Bank HCI
            </p>
          </div>

          {/* National Impact */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              The National Impact
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[var(--background)] rounded-2xl p-8 text-center border border-gray-100">
              <p className="text-3xl md:text-4xl font-bold text-[var(--primary-darker)] mb-2">$40B</p>
              <p className="text-gray-700 font-medium mb-1">Lost annually</p>
              <p className="text-sm text-[var(--text-muted)]">
                ~8% of GDP, from an under-educated workforce
              </p>
              <p className="text-xs text-gray-400 mt-2">SBM Intelligence</p>
            </div>
            <div className="bg-[var(--background)] rounded-2xl p-8 text-center border border-gray-100">
              <p className="text-3xl md:text-4xl font-bold text-[var(--primary-darker)] mb-2">0.36</p>
              <p className="text-gray-700 font-medium mb-1">Human Capital Index</p>
              <p className="text-sm text-[var(--text-muted)]">
                150th of 157 countries — a child will be only 36% as productive as possible
              </p>
              <p className="text-xs text-gray-400 mt-2">World Bank HCI 2020</p>
            </div>
            <div className="bg-[var(--background)] rounded-2xl p-8 text-center border border-gray-100">
              <p className="text-3xl md:text-4xl font-bold text-[var(--primary-darker)] mb-2">133M</p>
              <p className="text-gray-700 font-medium mb-1">In multidimensional poverty</p>
              <p className="text-sm text-[var(--text-muted)]">
                63% of Nigerians — educational deprivation is the primary driver
              </p>
              <p className="text-xs text-gray-400 mt-2">NBS 2022</p>
            </div>
          </div>
        </div>
      </section>

      {/* What Works — Solution / ROI for Partners */}
      <section className="py-16 bg-[var(--background)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The Solution Works — and the Returns Are Massive
            </h2>
            <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
              AI-powered tutoring at the child&apos;s actual level is the most cost-effective education intervention ever measured.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
              <p className="text-3xl md:text-4xl font-bold text-[var(--primary-dark)] mb-2">161-260x</p>
              <p className="text-gray-700 font-medium mb-1">Benefit-cost ratio</p>
              <p className="text-sm text-[var(--text-muted)]">
                AI tutoring in Nigerian schools: 1.5-2 years of learning in 6 weeks
              </p>
              <p className="text-xs text-gray-400 mt-2">World Bank RCT, Edo State 2024</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
              <p className="text-3xl md:text-4xl font-bold text-[var(--primary-dark)] mb-2">+20%</p>
              <p className="text-gray-700 font-medium mb-1">Labor earnings gain</p>
              <p className="text-sm text-[var(--text-muted)]">
                What effective foundational learning delivers to a country&apos;s workforce
              </p>
              <p className="text-xs text-gray-400 mt-2">World Bank HCI+ 2026</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
              <p className="text-3xl md:text-4xl font-bold text-[var(--primary-dark)] mb-2">$5</p>
              <p className="text-gray-700 font-medium mb-1">Per student per year</p>
              <p className="text-sm text-[var(--text-muted)]">
                Cost of AI math tutoring that delivers 1 extra year of learning
              </p>
              <p className="text-xs text-gray-400 mt-2">Rori AI RCT, Ghana 2024</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Learn With Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Learn With Us?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[var(--secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[var(--primary-dark)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">100% Free</h3>
              <p className="text-[var(--text-muted)]">
                All our lessons are completely free. No hidden costs, no subscriptions.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[var(--secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[var(--primary-dark)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Video Lessons</h3>
              <p className="text-[var(--text-muted)]">
                Learn through engaging video content with clear explanations.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[var(--secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[var(--primary-dark)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Track Progress</h3>
              <p className="text-[var(--text-muted)]">
                Create an account to save your progress and continue where you left off.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[var(--primary-dark)]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-white/80 mb-8">
            Join thousands of students across Nigeria who are building a brighter future through education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sabi" className="inline-block bg-white text-[var(--primary-dark)] font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
              Start Learning
            </Link>
            <a href="mailto:info@educationforequality.org" className="inline-block border-2 border-white/40 text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors">
              Partner With Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
