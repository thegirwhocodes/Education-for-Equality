import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  grade4Curriculum,
  getTotalLessons,
  getTotalDuration,
  type SubjectCurriculum,
} from '@/lib/cambridge-grade4-curriculum';

// Subject metadata
const subjectMeta: Record<string, { color: string; icon: string; slug: string }> = {
  mathematics: { color: '#2563eb', icon: '🔢', slug: 'mathematics' },
  english: { color: '#dc2626', icon: '📚', slug: 'english' },
  science: { color: '#16a34a', icon: '🔬', slug: 'science' },
  socialStudies: { color: '#9333ea', icon: '🌍', slug: 'social-studies' },
};

// Map grade slug to curriculum data
function getCurriculumForGrade(gradeSlug: string): {
  gradeNumber: number;
  gradeName: string;
  stage: string;
  subjects: Array<{ key: string; curriculum: SubjectCurriculum; meta: typeof subjectMeta.mathematics }>;
} | null {
  if (gradeSlug === 'grade-4') {
    return {
      gradeNumber: 4,
      gradeName: 'Grade 4',
      stage: 'Cambridge Primary Stage 4',
      subjects: Object.entries(grade4Curriculum).map(([key, curriculum]) => ({
        key,
        curriculum,
        meta: subjectMeta[key],
      })),
    };
  }
  return null;
}

interface PageProps {
  params: Promise<{ grade: string }>;
}

export default async function GradeDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const gradeData = getCurriculumForGrade(resolvedParams.grade);

  if (!gradeData) {
    notFound();
  }

  const { gradeNumber, gradeName, stage, subjects } = gradeData;

  // Calculate totals
  const totalLessons = subjects.reduce((acc, s) => acc + getTotalLessons(s.curriculum), 0);
  const totalUnits = subjects.reduce((acc, s) => acc + s.curriculum.units.length, 0);
  const totalDuration = subjects.reduce((acc, s) => acc + getTotalDuration(s.curriculum), 0);

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-[var(--secondary)] to-[var(--accent)] py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-4">
            <Link href="/curriculum" className="text-[var(--primary-dark)] hover:underline text-sm">
              Curriculum
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600 text-sm">{gradeName}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary-darker)] mb-2">
                {gradeName} Curriculum
              </h1>
              <p className="text-[var(--text-muted)]">
                {stage} • Ages 9-10 years
              </p>
            </div>

            <div className="flex gap-4 text-sm">
              <div className="bg-white/60 rounded-lg px-4 py-2">
                <div className="font-bold text-[var(--primary-dark)]">{subjects.length}</div>
                <div className="text-gray-600">Subjects</div>
              </div>
              <div className="bg-white/60 rounded-lg px-4 py-2">
                <div className="font-bold text-[var(--primary-dark)]">{totalUnits}</div>
                <div className="text-gray-600">Units</div>
              </div>
              <div className="bg-white/60 rounded-lg px-4 py-2">
                <div className="font-bold text-[var(--primary-dark)]">{totalLessons}</div>
                <div className="text-gray-600">Lessons</div>
              </div>
              <div className="bg-white/60 rounded-lg px-4 py-2">
                <div className="font-bold text-[var(--primary-dark)]">{Math.round(totalDuration / 60)}+</div>
                <div className="text-gray-600">Hours</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subject Navigation */}
      <section className="sticky top-16 bg-white border-b z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-1 py-2">
            {subjects.map((subject) => (
              <a
                key={subject.key}
                href={`#${subject.curriculum.subjectId}`}
                className="flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors hover:bg-gray-100"
                style={{ color: subject.meta.color }}
              >
                <span>{subject.meta.icon}</span>
                <span>{subject.curriculum.subjectName}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects and Units */}
      <section className="py-8 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {subjects.map((subject) => (
              <div key={subject.key} id={subject.curriculum.subjectId} className="scroll-mt-32">
                {/* Subject Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                    style={{ backgroundColor: `${subject.meta.color}15` }}
                  >
                    {subject.meta.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold" style={{ color: subject.meta.color }}>
                      {subject.curriculum.subjectName}
                    </h2>
                    <p className="text-gray-500">
                      {subject.curriculum.units.length} units • {getTotalLessons(subject.curriculum)} lessons •{' '}
                      {Math.round(getTotalDuration(subject.curriculum) / 60)}+ hours
                    </p>
                  </div>
                </div>

                {/* Units Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {subject.curriculum.units.map((unit, unitIndex) => (
                    <div
                      key={unit.id}
                      className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* Unit Header */}
                      <div
                        className="px-6 py-4 border-b"
                        style={{ borderColor: `${subject.meta.color}30` }}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span
                              className="text-xs font-medium px-2 py-0.5 rounded"
                              style={{
                                backgroundColor: `${subject.meta.color}15`,
                                color: subject.meta.color,
                              }}
                            >
                              Unit {unitIndex + 1}
                            </span>
                            <h3 className="text-lg font-semibold text-gray-900 mt-1">
                              {unit.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">{unit.description}</p>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-400">
                          Standards: {unit.standardsAlignment}
                        </div>
                      </div>

                      {/* Lessons List */}
                      <div className="divide-y divide-gray-50">
                        {unit.lessons.map((lesson, lessonIndex) => (
                          <Link
                            key={lesson.id}
                            href={`/subjects/${subject.meta.slug}/${lesson.id}`}
                            className="block px-6 py-3 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5"
                                style={{
                                  backgroundColor: `${subject.meta.color}15`,
                                  color: subject.meta.color,
                                }}
                              >
                                {lessonIndex + 1}
                              </div>
                              <div className="flex-grow min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">
                                  {lesson.title}
                                </h4>
                                <p className="text-sm text-gray-500 truncate">
                                  {lesson.description}
                                </p>
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                  {lesson.videoUrl && (
                                    <span className="flex items-center gap-1">
                                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                      </svg>
                                      Video
                                    </span>
                                  )}
                                  <span>{lesson.durationMinutes} min</span>
                                  {lesson.standards.length > 0 && (
                                    <span>{lesson.standards.join(', ')}</span>
                                  )}
                                </div>
                              </div>
                              <svg
                                className="w-5 h-5 text-gray-300 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Attribution Footer */}
      <section className="py-8 bg-white border-t">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">
            <strong>Content Sources:</strong> Videos from Khan Academy (CC BY-NC-SA 4.0).
            Aligned to Cambridge Assessment International Education Primary Stage {gradeNumber} framework.
          </p>
        </div>
      </section>
    </div>
  );
}

// Generate metadata
export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const gradeData = getCurriculumForGrade(resolvedParams.grade);

  if (!gradeData) {
    return { title: 'Grade Not Found' };
  }

  return {
    title: `${gradeData.gradeName} Curriculum - Education for Equality`,
    description: `Free ${gradeData.gradeName} lessons aligned to ${gradeData.stage}. Learn Math, English, Science, and Social Studies with video lessons.`,
  };
}