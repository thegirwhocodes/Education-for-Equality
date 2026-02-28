'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';

interface Completion {
  lesson_id: string;
  completed_at: string;
}

export function useProgress() {
  const { isSignedIn } = useAuth();
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!isSignedIn) {
      setCompletions([]);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/progress');
      if (res.ok) {
        const data = await res.json();
        setCompletions(data.completions || []);
      }
    } catch {
      // silently fail — progress just won't show
    } finally {
      setLoading(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const isCompleted = useCallback(
    (lessonId: string) => completions.some((c) => c.lesson_id === lessonId),
    [completions]
  );

  const toggleComplete = useCallback(
    async (lessonId: string) => {
      if (!isSignedIn) return false;

      const alreadyDone = isCompleted(lessonId);
      const method = alreadyDone ? 'DELETE' : 'POST';

      // Optimistic update
      if (alreadyDone) {
        setCompletions((prev) => prev.filter((c) => c.lesson_id !== lessonId));
      } else {
        setCompletions((prev) => [
          ...prev,
          { lesson_id: lessonId, completed_at: new Date().toISOString() },
        ]);
      }

      try {
        const res = await fetch('/api/progress', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lessonId }),
        });
        if (!res.ok) {
          // Revert on failure
          await fetchProgress();
          return false;
        }
        return true;
      } catch {
        await fetchProgress();
        return false;
      }
    },
    [isSignedIn, isCompleted, fetchProgress]
  );

  const completedCount = completions.length;

  const completedBySubject = useCallback(
    (lessonIds: string[]) => {
      return lessonIds.filter((id) => isCompleted(id)).length;
    },
    [isCompleted]
  );

  return {
    completions,
    loading,
    isCompleted,
    toggleComplete,
    completedCount,
    completedBySubject,
    isSignedIn,
  };
}
