import Link from 'next/link';
import { subjects, getTotalLessons } from '@/lib/curriculum';

export const metadata = {
  title: 'Subjects | Education for Equality',
  description: 'Browse all subjects: Mathematics, English, Science, and Social Studies.',
};

export default function SubjectsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">All Subjects</h1>
          <p className="text-[var(--text-muted)] max-w-2xl">
            Choose a subject to start learning. Each subject contains multiple units with
            video lessons and reading materials designed for 3rd grade students.
          </p>
        </div>
      </div>

      {/* Subject Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {subjects.map((subject) => {
            const totalLessons = getTotalLessons(subject);
            const totalMinutes = subject.units.reduce(
              (acc, unit) => acc + unit.lessons.reduce((a, l) => a + l.duration, 0),
              0
            );

            return (
              <Link key={subject.id} href={`/subjects/${subject.slug}`}>
                <div className="subject-card h-full flex flex-col">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                      style={{ backgroundColor: `${subject.color}15` }}
                    >
                      {subject.icon}
                    </div>
                    <div className="flex-grow">
                      <h2 className="text-xl font-semibold mb-1" style={{ color: subject.color }}>
                        {subject.name}
                      </h2>
                      <p className="text-[var(--text-muted)] text-sm">
                        {subject.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        {subject.units.length} units
                      </span>
                      <span className="text-gray-500">
                        {totalLessons} lessons
                      </span>
                      <span className="text-gray-500">
                        ~{Math.round(totalMinutes / 60)}h total
                      </span>
                    </div>
                  </div>

                  {/* Units Preview */}
                  <div className="mt-4 space-y-2">
                    {subject.units.slice(0, 2).map((unit) => (
                      <div key={unit.id} className="text-sm text-gray-600 flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        {unit.title}
                      </div>
                    ))}
                    {subject.units.length > 2 && (
                      <div className="text-sm text-gray-400 pl-6">
                        +{subject.units.length - 2} more units
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-4">
                    <span
                      className="inline-flex items-center gap-1 text-sm font-medium"
                      style={{ color: subject.color }}
                    >
                      Start Learning
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
