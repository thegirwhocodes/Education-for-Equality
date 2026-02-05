import Link from 'next/link';
import { notFound } from 'next/navigation';
import { subjects, getSubjectBySlug, getTotalLessons } from '@/lib/curriculum';

interface SubjectPageProps {
  params: Promise<{ subject: string }>;
}

export async function generateStaticParams() {
  return subjects.map((subject) => ({
    subject: subject.slug,
  }));
}

export async function generateMetadata({ params }: SubjectPageProps) {
  const { subject: subjectSlug } = await params;
  const subject = getSubjectBySlug(subjectSlug);

  if (!subject) {
    return { title: 'Subject Not Found' };
  }

  return {
    title: `${subject.name} | Education for Equality`,
    description: subject.description,
  };
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { subject: subjectSlug } = await params;
  const subject = getSubjectBySlug(subjectSlug);

  if (!subject) {
    notFound();
  }

  const totalLessons = getTotalLessons(subject);
  const totalMinutes = subject.units.reduce(
    (acc, unit) => acc + unit.lessons.reduce((a, l) => a + l.duration, 0),
    0
  );

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/subjects" className="hover:text-[var(--primary-dark)]">
              Subjects
            </Link>
            <span>/</span>
            <span style={{ color: subject.color }}>{subject.name}</span>
          </div>

          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ backgroundColor: `${subject.color}15` }}
            >
              {subject.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{subject.name}</h1>
              <p className="text-[var(--text-muted)]">{subject.description}</p>
              <div className="flex gap-6 mt-4 text-sm text-gray-500">
                <span>{subject.units.length} units</span>
                <span>{totalLessons} lessons</span>
                <span>~{Math.round(totalMinutes)} min total</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Units and Lessons */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {subject.units.map((unit, unitIndex) => (
            <div key={unit.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Unit Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white"
                    style={{ backgroundColor: subject.color }}
                  >
                    {unitIndex + 1}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{unit.title}</h2>
                    <p className="text-sm text-gray-500">{unit.description}</p>
                  </div>
                </div>
              </div>

              {/* Lessons List */}
              <div className="divide-y divide-gray-100">
                {unit.lessons.map((lesson, lessonIndex) => (
                  <Link
                    key={lesson.id}
                    href={`/subjects/${subject.slug}/${lesson.id}`}
                    className="lesson-item group"
                  >
                    <div className="flex items-center gap-4 w-full">
                      {/* Lesson Number */}
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-500 flex-shrink-0 group-hover:bg-[var(--secondary)]">
                        {lessonIndex + 1}
                      </div>

                      {/* Lesson Info */}
                      <div className="flex-grow min-w-0">
                        <h3 className="font-medium text-gray-900 group-hover:text-[var(--primary-dark)] transition-colors">
                          {lesson.title}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">{lesson.description}</p>
                      </div>

                      {/* Duration & Video Badge */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {lesson.videoUrl && (
                          <span className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                            Video
                          </span>
                        )}
                        <span className="text-sm text-gray-400">{lesson.duration} min</span>
                        <svg className="w-5 h-5 text-gray-300 group-hover:text-[var(--primary-dark)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
