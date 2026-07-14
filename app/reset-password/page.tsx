'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { createBrowserSupabaseClient, hasSupabaseBrowserConfig } from '@/lib/auth/browser';
import { authErrorMessage } from '@/lib/auth/messages';

export default function ResetPasswordPage() {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [checking, setChecking] = useState(true);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!hasSupabaseBrowserConfig()) {
      setChecking(false);
      setStatus('error');
      setMessage('Auth is not configured in this environment yet.');
      return;
    }

    let cancelled = false;

    // Arriving from the reset email, /auth/callback has already exchanged the
    // recovery code for a session, so getUser() is the reliable signal here.
    async function confirmRecoverySession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled) return;
      setHasRecoverySession(Boolean(user));
      setChecking(false);
      if (!user) {
        setStatus('error');
        setMessage('Open the password reset link from your email to set a new password.');
      }
    }

    // Belt-and-braces for the implicit (hash) recovery flow.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session?.user) {
        setHasRecoverySession(true);
        setChecking(false);
      }
    });

    void confirmRecoverySession();

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function updatePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('saving');
    setMessage('');

    if (password.length < 8) {
      setStatus('error');
      setMessage('Choose a password with at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Those passwords do not match.');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setStatus('error');
      setMessage(authErrorMessage(error.message, 'reset'));
      return;
    }

    setStatus('saved');
    setMessage('Your password is updated. Taking you to your dashboard...');
    window.setTimeout(() => window.location.assign('/dashboard'), 1200);
  }

  return (
    <div className="min-h-[80vh] bg-[var(--background)] px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-lg border border-emerald-100 bg-white p-5 shadow-[0_24px_70px_rgba(7,84,73,0.10)] sm:p-7 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--primary-dark)]">Account</p>
          <h1 className="mt-2 text-2xl font-bold text-gray-950">Set a new password</h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Choose a new password for your Education for Equality account.
          </p>

          {checking ? (
            <p className="mt-6 text-sm text-gray-500">Checking your reset link...</p>
          ) : hasRecoverySession ? (
            <form onSubmit={updatePassword} className="mt-6 space-y-4">
              <div>
                <label htmlFor="reset-password" className="block text-sm font-semibold text-gray-700">
                  New password
                </label>
                <div className="relative mt-2">
                  <input
                    id="reset-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    autoComplete="new-password"
                    minLength={8}
                    className="w-full rounded-lg border border-emerald-100 bg-white px-4 py-3 pr-16 text-base text-gray-950 outline-none transition-colors focus:border-[var(--primary-dark)] focus:ring-2 focus:ring-emerald-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute inset-y-0 right-2 my-auto h-8 rounded-md px-2 text-xs font-semibold text-[var(--primary-dark)] hover:bg-emerald-50"
                    aria-pressed={showPassword}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="reset-confirm-password" className="block text-sm font-semibold text-gray-700">
                  Confirm new password
                </label>
                <input
                  id="reset-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  autoComplete="new-password"
                  minLength={8}
                  className="mt-2 w-full rounded-lg border border-emerald-100 bg-white px-4 py-3 text-base text-gray-950 outline-none transition-colors focus:border-[var(--primary-dark)] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'saving' || status === 'saved'}
                className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60"
              >
                {status === 'saving' ? 'Saving...' : 'Update password'}
              </button>
            </form>
          ) : (
            <div className="mt-6">
              <Link
                href="/sign-in"
                className="btn-primary inline-flex w-full justify-center py-3 text-base"
              >
                Back to sign in
              </Link>
            </div>
          )}

          {message && (
            <div
              className={`mt-5 rounded-lg border p-3 text-sm leading-6 ${
                status === 'error'
                  ? 'border-red-200 bg-red-50 text-red-800'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-900'
              }`}
              role="status"
              aria-live="polite"
            >
              {message}
            </div>
          )}

          <p className="mt-6 text-center text-sm text-gray-500">
            Remembered it?{' '}
            <Link href="/sign-in" className="font-semibold text-[var(--primary-dark)] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
