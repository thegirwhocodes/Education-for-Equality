import Link from 'next/link';
import { grade4Curriculum, getTotalLessons, getTotalDuration } from '@/lib/cambridge-grade4-curriculum';

// Define available grades (Grade 4 is active, others coming soon)
const grades = [
  { number: 4, name: 'Grade 4', stage: 'Cambridge Primary Stage 4', ageRange: '9-10 years', available: true },
  { number: 5, name: 'Grade 5', stage: 'Cambridge Primary Stage 5', ageRange: '10-11 years', available: false },
  { number: 6, name: 'Grade 6', stage: 'Cambridge Primary Stage 6', ageRange: '11-12 years', available: false },
  { number: 7, name: 'Grade 7', stage: 'Cambridge Lower Secondary Stage 7', ageRange: '12-13 years', available: false },
  { number: 8, name: 'Grade 8', stage: 'Cambridge Lower Secondary Stage 8', ageRange: '13-14 years', available: false },
  { number: 9, name: 'Grade 9', stage: 'Cambridge Lower Secondary Stage 9', ageRange: '14-15 years', available: false },
];

// Subject colors and icons
const subjectMeta: Record<string, { color: string; icon: string }> = {
  mathematics: { color: '#2563eb', icon: '🔢' },
  english: { color: '#dc2626', icon: '📚' },
  science: { color: '#16a34a', icon: '🔬' },
  socialStudies: { color: '#9333ea', icon: '🌍' },
};

export default function CurriculumPage() {
  // Calculate Grade 4 stats
  const subjects = Object.entries(grade4Curriculum).map(([key, curriculum]) => ({
    key,
    ...curriculum,
    meta: subjectMeta[key],
    totalLessons: getTotalLessons(curriculum),
    totalDuration: getTotalDuration(curriculum),
  }));

  const totalGrade4Lessons = subjects.reduce((acc, s) => acc + s.totalLessons, 0);
  const totalGrade4Units = subjects.reduce((acc, s) => acc + s.units.length, 0);

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-[var(--secondary)] to-[var(--accent)] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary-darker)] mb-4">
              Cambridge-Aligned Curriculum
            </h1>
            <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
              Our curriculum follows the internationally recognized Cambridge Primary and Lower Secondary framework,
              filled with free educational content from Khan Academy and other Open Educational Resources.
            </p>
          </div>
        </div>
      </section>

      {/* Curriculum Framework Info */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎓</span>
              <span className="text-sm text-gray-600">Cambridge International Standards</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎬</span>
              <span className="text-sm text-gray-600">Khan Academy Videos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📖</span>
              <span className="text-sm text-gray-600">Open Educational Resources</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇳🇬</span>
              <span className="text-sm text-gray-600">Nigeria Context</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grades Grid */}
      <section className="py-12 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Select Your Grade Level
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grades.map((grade) => (
              <div key={grade.number}>
                {grade.available ? (
                  <Link href={`/curriculum/grade-${grade.number}`}>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-[var(--primary)] transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-[var(--primary-dark)]">
                            {grade.name}
                          </h3>
                          <p className="text-sm text-gray-500">{grade.stage}</p>
                        </div>
                        <span className="bg-[var(--secondary)] text-[var(--primary-darker)] text-xs font-medium px-2.5 py-1 rounded-full">
                          {grade.ageRange}
                        </span>
                      </div>

                      {grade.number === 4 && (
                        <>
                          <div className="flex gap-4 mb-4 text-sm text-gray-600">
                            <span>4 subjects</span>
                            <span>{totalGrade4Units} units</span>
                            <span>{totalGrade4Lessons} lessons</span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {subjects.map((subject) => (
                              <span
                                key={subject.key}
                                className="text-xs px-2 py-1 rounded-full"
                                style={{
                                  backgroundColor: `${subject.meta.color}15`,
                                  color: subject.meta.color,
                                }}
                              >
                                {subject.meta.icon} {subject.subjectName}
                              </span>
                            ))}
                          </div>
                        </>
                      )}

                      <div className="mt-4 flex items-center text-[var(--primary-dark)] font-medium">
                        <span>Start Learning</span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 opacity-75">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-400">
                          {grade.name}
                        </h3>
                        <p className="text-sm text-gray-400">{grade.stage}</p>
                      </div>
                      <span className="bg-gray-200 text-gray-500 text-xs font-medium px-2.5 py-1 rounded-full">
                        {grade.ageRange}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">
                      Coming soon! We're working on content for this grade level.
                    </p>
                    <div className="flex items-center text-gray-400">
                      <span>Coming Soon</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grade 4 Preview */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Grade 4 Curriculum Overview
            </h2>
            <p className="text-[var(--text-muted)]">
              Cambridge Primary Stage 4 • {totalGrade4Lessons} lessons available now
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject) => (
              <Link key={subject.key} href={`/curriculum/grade-4?subject=${subject.subjectId}`}>
                <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md hover:border-[var(--primary)] transition-all h-full">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4"
                    style={{ backgroundColor: `${subject.meta.color}15` }}
                  >
                    {subject.meta.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2" style={{ color: subject.meta.color }}>
                    {subject.subjectName}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {subject.units.length} units • {subject.totalLessons} lessons
                  </p>
                  <div className="text-xs text-gray-400">
                    {Math.round(subject.totalDuration / 60)}+ hours of content
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Standards */}
      <section className="py-12 bg-[var(--background)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              About Our Curriculum
            </h2>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg text-[var(--primary-dark)] mb-2">
                  Cambridge International Standards
                </h3>
                <p className="text-gray-600">
                  Our lessons are aligned to the Cambridge Primary and Lower Secondary curriculum framework,
                  used by schools in over 160 countries worldwide including many schools in Nigeria.
                  Each lesson includes the specific Cambridge learning objectives it covers.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-[var(--primary-dark)] mb-2">
                  Open Educational Resources
                </h3>
                <p className="text-gray-600">
                  We use free, high-quality videos from Khan Academy and text content from OpenStax, CK-12,
                  and iCivics. All content is properly attributed and used under Creative Commons licenses.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-[var(--primary-dark)] mb-2">
                  Nigeria Context
                </h3>
                <p className="text-gray-600">
                  While following international standards, we include examples and context relevant to
                  Nigerian students, including Nigerian geography, history, and culture in our Social Studies content.
                </p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">
                  <strong>Attribution:</strong> Videos from Khan Academy (CC BY-NC-SA 4.0).
                  Text content adapted from OpenStax, CK-12, and iCivics (CC BY / CC BY-NC-SA).
                  Curriculum aligned to Cambridge Assessment International Education frameworks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[var(--primary-dark)]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Start Learning Today
          </h2>
          <p className="text-white/80 mb-6">
            All content is free and available immediately. No account required to start.
          </p>
          <Link
            href="/curriculum/grade-4"
            className="inline-block bg-white text-[var(--primary-dark)] font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Begin Grade 4 Curriculum
          </Link>
        </div>
      </section>
    </div>
  );
}