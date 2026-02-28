import Link from 'next/link';
import { subjects, getTotalLessons, type Subject } from '@/lib/curriculum';

export const metadata = {
  title: 'Courses | Education for Equality',
  description: 'Browse foundational literacy and numeracy courses, plus Grade 4 Cambridge curriculum.',
};

function SubjectCard({ subject }: { subject: Subject }) {
  const totalLessons = getTotalLessons(subject);
  const totalMinutes = subject.units.reduce(
    (acc, unit) => acc + unit.lessons.reduce((a, l) => a + l.duration, 0),
    0
  );

  return (
    <Link href={`/subjects/${subject.slug}`}>
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
}

export default function SubjectsPage() {
  const foundationalCourses = subjects.filter(s =>
    s.slug === 'foundational-literacy' || s.slug === 'foundational-numeracy'
  );
  const grade4Courses = subjects.filter(s =>
    s.slug !== 'foundational-literacy' && s.slug !== 'foundational-numeracy'
  );

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--secondary)] via-[var(--accent)] to-[#c2f5e9]">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-48 h-48 bg-[var(--primary)] rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-10 w-64 h-64 bg-[var(--secondary)] rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-[var(--primary-darker)] mb-4">All Courses</h1>
          <p className="text-[var(--primary-darker)]/80 max-w-2xl">
            Start with our foundational courses to build reading and math skills from scratch,
            or dive into the full Grade 4 Cambridge curriculum.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Foundational Courses */}
        {foundationalCourses.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">Foundational Courses</h2>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                Ages 8-14
              </span>
            </div>
            <p className="text-[var(--text-muted)] mb-8">
              Build essential literacy and numeracy skills from scratch. Designed for children who need to
              strengthen their foundation before tackling grade-level content.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {foundationalCourses.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          </div>
        )}

        {/* Grade 4 Cambridge Curriculum */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-gray-900">Grade 4 Cambridge Curriculum</h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Cambridge-Aligned
            </span>
          </div>
          <p className="text-[var(--text-muted)] mb-8">
            Complete Cambridge Primary Stage 4 curriculum with video lessons and reading materials.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {grade4Courses.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
