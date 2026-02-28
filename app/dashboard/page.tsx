'use client';

import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { getCambridgeSubjects } from '@/lib/curriculum';
import { useProgress } from '@/lib/useProgress';

export default function DashboardPage() {
  const { user } = useUser();
  const subjects = getCambridgeSubjects();
  const { completions, loading, completedBySubject, completedCount } = useProgress();

  // Calculate total lessons across all subjects
  const totalLessons = subjects.reduce((acc, subject) => {
    return acc + subject.units.reduce((unitAcc, unit) => unitAcc + unit.lessons.length, 0);
  }, 0);

  const overallPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Find most recently completed lesson for "Continue Learning"
  const lastCompletion = completions.length > 0
    ? [...completions].sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())[0]
    : null;

  // Find the next uncompleted lesson after the last completed one
  const allLessons = subjects.flatMap((s) =>
    s.units.flatMap((u) => u.lessons.map((l) => ({ ...l, subjectSlug: s.slug, subjectName: s.name })))
  );
  const completedIds = new Set(completions.map((c) => c.lesson_id));
  const nextLesson = lastCompletion
    ? (() => {
        const idx = allLessons.findIndex((l) => l.id === lastCompletion.lesson_id);
        const after = allLessons.slice(idx + 1).find((l) => !completedIds.has(l.id));
        return after || allLessons.find((l) => !completedIds.has(l.id));
      })()
    : allLessons[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName || 'Learner'}!
          </h1>
          <p className="mt-2 text-gray-600">
            Track your learning progress and continue where you left off.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-3xl font-bold text-[var(--primary-dark)]">
              {loading ? '...' : completedCount}
            </div>
            <div className="text-gray-600 text-sm">Lessons Completed</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-3xl font-bold text-[var(--primary-dark)]">{totalLessons}</div>
            <div className="text-gray-600 text-sm">Total Lessons Available</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-3xl font-bold text-[var(--primary-dark)]">
              {loading ? '...' : `${overallPercent}%`}
            </div>
            <div className="text-gray-600 text-sm">Overall Progress</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-3xl font-bold text-[var(--primary-dark)]">
              {loading ? '...' : `${Math.round(completedCount * 12 / 60)}h`}
            </div>
            <div className="text-gray-600 text-sm">Est. Time Learning</div>
          </div>
        </div>

        {/* Continue Learning */}
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
          <h2 className="text-xl font-semibold mb-4">Continue Learning</h2>
          {nextLesson ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{nextLesson.subjectName}</p>
                <p className="font-medium text-gray-900">{nextLesson.title}</p>
                <p className="text-sm text-gray-600">{nextLesson.description}</p>
              </div>
              <Link
                href={`/subjects/${nextLesson.subjectSlug}/${nextLesson.id}`}
                className="btn-primary whitespace-nowrap"
              >
                {completedCount > 0 ? 'Continue' : 'Start Learning'}
              </Link>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-4">You&apos;ve completed all available lessons!</p>
              <Link href="/curriculum/4" className="btn-primary inline-block">
                Review Grade 4 Curriculum
              </Link>
            </div>
          )}
        </div>

        {/* Subject Progress */}
        <h2 className="text-xl font-semibold mb-4">Progress by Subject</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map((subject) => {
            const subjectLessonIds = subject.units.flatMap((u) => u.lessons.map((l) => l.id));
            const subjectTotal = subjectLessonIds.length;
            const subjectCompleted = completedBySubject(subjectLessonIds);
            const subjectPercent = subjectTotal > 0 ? Math.round((subjectCompleted / subjectTotal) * 100) : 0;

            return (
              <div key={subject.slug} className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{subject.icon}</span>
                  <div>
                    <h3 className="font-semibold">{subject.name}</h3>
                    <p className="text-sm text-gray-500">
                      {loading ? '...' : `${subjectCompleted} / ${subjectTotal} lessons`}
                    </p>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-gray-900 font-medium">
                      {loading ? '...' : `${subjectPercent}%`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${subjectPercent}%`,
                        backgroundColor: subject.color,
                      }}
                    />
                  </div>
                </div>
                <Link
                  href={`/subjects/${subject.slug}`}
                  className="text-sm text-[var(--primary-dark)] hover:underline"
                >
                  View lessons →
                </Link>
              </div>
            );
          })}
        </div>

        {/* Learning Tips */}
        <div className="mt-8 bg-[var(--secondary)] rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-[var(--primary-darker)]">
            Learning Tips
          </h2>
          <ul className="space-y-2 text-[var(--primary-darker)]">
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary-dark)]">&#10003;</span>
              Set a daily learning goal - even 15 minutes makes a difference!
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary-dark)]">&#10003;</span>
              Watch videos at your own pace - pause and replay as needed.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary-dark)]">&#10003;</span>
              Take notes while learning to help remember key concepts.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary-dark)]">&#10003;</span>
              Complete units in order for the best learning experience.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
