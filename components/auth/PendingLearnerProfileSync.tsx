'use client';

import { useEffect, useMemo } from 'react';
import { createBrowserSupabaseClient, hasSupabaseBrowserConfig } from '@/lib/auth/browser';
import {
  PENDING_LEARNER_PROFILE_KEY,
  normalizeLearnerMetadata,
} from '@/lib/auth/learner-onboarding';

export default function PendingLearnerProfileSync() {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  useEffect(() => {
    if (!hasSupabaseBrowserConfig()) return;

    let cancelled = false;

    async function syncPendingProfile() {
      const stored = window.localStorage.getItem(PENDING_LEARNER_PROFILE_KEY);
      if (!stored) return;

      let parsed: unknown;
      try {
        parsed = JSON.parse(stored);
      } catch {
        window.localStorage.removeItem(PENDING_LEARNER_PROFILE_KEY);
        return;
      }

      const pendingMetadata = normalizeLearnerMetadata(parsed);
      if (!pendingMetadata) {
        window.localStorage.removeItem(PENDING_LEARNER_PROFILE_KEY);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled || !user) return;

      const { error } = await supabase.auth.updateUser({
        data: {
          ...(user.user_metadata || {}),
          ...pendingMetadata,
        },
      });

      if (!error) {
        window.localStorage.removeItem(PENDING_LEARNER_PROFILE_KEY);
      }
    }

    void syncPendingProfile();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  return null;
}
