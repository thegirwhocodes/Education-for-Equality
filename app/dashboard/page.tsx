import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { getCambridgeSubjects } from '@/lib/curriculum';

export default async function DashboardPage() {
  const user = await currentUser();
  const subjects = getCambridgeSubjects();

  // Calculate total lessons
  const totalLessons = subjects.reduce((acc, subject) => {
    return acc + subject.units.reduce((unitAcc, unit) => unitAcc + unit.lessons.length, 0);
  }, 0);

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
            <div className="text-3xl font-bold text-[var(--primary-dark)]">0</div>
            <div className="text-gray-600 text-sm">Lessons Completed</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-3xl font-bold text-[var(--primary-dark)]">{totalLessons}</div>
            <div className="text-gray-600 text-sm">Total Lessons Available</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-3xl font-bold text-[var(--primary-dark)]">0%</div>
            <div className="text-gray-600 text-sm">Overall Progress</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-3xl font-bold text-[var(--primary-dark)]">0h</div>
            <div className="text-gray-600 text-sm">Time Learning</div>
          </div>
        </div>

        {/* Continue Learning */}
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
          <h2 className="text-xl font-semibold mb-4">Continue Learning</h2>
          <div className="text-center py-8 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="mb-4">Start your first lesson to see your progress here!</p>
            <Link href="/curriculum/4" className="btn-primary inline-block">
              Browse Grade 4 Curriculum
            </Link>
          </div>
        </div>

        {/* Subject Progress */}
        <h2 className="text-xl font-semibold mb-4">Progress by Subject</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map((subject) => {
            const lessonCount = subject.units.reduce((acc, unit) => acc + unit.lessons.length, 0);
            return (
              <div key={subject.slug} className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{subject.icon}</span>
                  <div>
                    <h3 className="font-semibold">{subject.name}</h3>
                    <p className="text-sm text-gray-500">{lessonCount} lessons</p>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-gray-900 font-medium">0%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: '0%',
                        backgroundColor: subject.color
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
        <div className="mt-8 bg-[var(--primary-light)] rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-[var(--primary-darker)]">
            Learning Tips
          </h2>
          <ul className="space-y-2 text-[var(--primary-darker)]">
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary-dark)]">✓</span>
              Set a daily learning goal - even 15 minutes makes a difference!
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary-dark)]">✓</span>
              Watch videos at your own pace - pause and replay as needed.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary-dark)]">✓</span>
              Take notes while learning to help remember key concepts.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary-dark)]">✓</span>
              Complete units in order for the best learning experience.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}