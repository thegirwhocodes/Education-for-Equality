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
              Learn Math, English, Science, and Social Studies with engaging video lessons
              aligned to Cambridge International curriculum. Designed for children in Nigeria and across Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/curriculum/grade-4" className="btn-primary text-center">
                Start Grade 4
              </Link>
              <Link href="/curriculum" className="btn-secondary text-center">
                Browse Curriculum
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <blockquote className="text-2xl md:text-3xl font-serif italic text-gray-700">
            "Education is the most powerful weapon which you can use to change the world."
          </blockquote>
          <p className="mt-4 text-[var(--text-muted)]">— Nelson Mandela</p>
        </div>
      </section>

      {/* Subjects Preview */}
      <section className="py-16 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What You'll Learn
            </h2>
            <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
              Our Grade 4 curriculum includes {totalGrade4Lessons} lessons across {totalGrade4Units} units,
              aligned to Cambridge Primary Stage 4 standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject) => (
              <Link key={subject.id} href={`/subjects/${subject.slug}`}>
                <div className="subject-card h-full">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4"
                    style={{ backgroundColor: `${subject.color}20` }}
                  >
                    {subject.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2" style={{ color: subject.color }}>
                    {subject.name}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    {subject.description}
                  </p>
                  <div className="mt-4 text-sm text-gray-500">
                    {subject.units.length} units • {subject.units.reduce((acc, u) => acc + u.lessons.length, 0)} lessons
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
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
          <Link href="/subjects" className="inline-block bg-white text-[var(--primary-dark)] font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
            Browse Subjects
          </Link>
        </div>
      </section>
    </div>
  );
}
