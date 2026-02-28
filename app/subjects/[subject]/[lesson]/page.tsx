'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getLessonByIdExtended, getNextLessonExtended } from '@/lib/curriculum';
import { useProgress } from '@/lib/useProgress';
import { SignInButton } from '@clerk/nextjs';

export default function LessonPage() {
  const params = useParams();
  const subjectSlug = params.subject as string;
  const lessonId = params.lesson as string;
  const { isCompleted, toggleComplete, loading, isSignedIn } = useProgress();

  const data = getLessonByIdExtended(subjectSlug, lessonId);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson Not Found</h1>
          <Link href="/subjects" className="btn-primary">
            Back to Subjects
          </Link>
        </div>
      </div>
    );
  }

  const { subject, unit, lesson } = data;
  const nextLesson = getNextLessonExtended(subjectSlug, lessonId);
  const completed = isCompleted(lessonId);
  const isFoundational = subject.slug === 'foundational-literacy' || subject.slug === 'foundational-numeracy';

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Breadcrumb */}
      <div className={isFoundational
        ? "relative overflow-hidden bg-gradient-to-br from-[var(--secondary)] via-[var(--accent)] to-[#c2f5e9]"
        : "bg-white border-b border-gray-100"
      }>
        {isFoundational && (
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-5 left-10 w-32 h-32 bg-[var(--primary)] rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-10 w-48 h-48 bg-[var(--secondary)] rounded-full blur-3xl" />
          </div>
        )}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className={`flex items-center gap-2 text-sm ${isFoundational ? 'text-[var(--primary-darker)]/70' : 'text-gray-500'}`}>
            <Link href="/subjects" className={isFoundational ? "hover:text-[var(--primary-darker)]" : "hover:text-[var(--primary-dark)]"}>
              Subjects
            </Link>
            <span>/</span>
            <Link href={`/subjects/${subject.slug}`} className={isFoundational ? "hover:text-[var(--primary-darker)]" : "hover:text-[var(--primary-dark)]"}>
              {subject.name}
            </Link>
            <span>/</span>
            <span className={`truncate max-w-[200px] ${isFoundational ? 'text-[var(--primary-darker)]' : 'text-gray-900'}`}>{lesson.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Video Section */}
        {lesson.videoUrl && (
          <div className="mb-8">
            <div className="relative w-full pt-[56.25%] bg-black rounded-xl overflow-hidden">
              <iframe
                src={lesson.videoUrl}
                title={lesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        )}

        {/* Lesson Content */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          {/* Header */}
          <div className="mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2 text-sm mb-2">
              <span
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: `${subject.color}15`, color: subject.color }}
              >
                {subject.name}
              </span>
              <span className="text-gray-400">&bull;</span>
              <span className="text-gray-500">{unit.title}</span>
              {completed && (
                <>
                  <span className="text-gray-400">&bull;</span>
                  <span className="text-green-600 text-xs font-medium">Completed</span>
                </>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
            <p className="text-[var(--text-muted)]">{lesson.description}</p>
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {lesson.duration} min
              </span>
              {lesson.videoUrl && (
                <span className="flex items-center gap-1 text-red-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Includes video
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />

          {/* Mark Complete Button */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            {isSignedIn ? (
              <button
                onClick={() => toggleComplete(lessonId)}
                disabled={loading}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  completed
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'btn-primary'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {loading ? 'Loading...' : completed ? 'Completed!' : 'Mark as Complete'}
              </button>
            ) : (
              <SignInButton mode="modal">
                <button className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Sign in to track progress
                </button>
              </SignInButton>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <Link
            href={`/subjects/${subject.slug}`}
            className="flex items-center gap-2 text-gray-500 hover:text-[var(--primary-dark)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {subject.name}
          </Link>

          {nextLesson && (
            <Link
              href={`/subjects/${subject.slug}/${nextLesson.id}`}
              className="flex items-center gap-2 text-[var(--primary-dark)] hover:text-[var(--primary-darker)] font-medium transition-colors"
            >
              Next: {nextLesson.title}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
