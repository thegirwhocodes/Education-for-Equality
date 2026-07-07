'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { createBrowserSupabaseClient, hasSupabaseBrowserConfig } from '@/lib/auth/browser';
import { authErrorMessage } from '@/lib/auth/messages';
import { buildAuthCallbackUrl } from '@/lib/auth/url';

export default function SignInPage() {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const isGoogleAuthEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === 'true';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');

  function goToSignUp(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    window.location.assign(`/sign-up${window.location.search}`);
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authError = params.get('auth_error') || params.get('error_code') || params.get('error_description');

    if (authError) {
      const timeoutId = window.setTimeout(() => {
        setStatus('error');
        setMessage(authErrorMessage(authError));
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }
  }, []);

  function redirectPath() {
    const params = new URLSearchParams(window.location.search);
    return params.get('redirectTo') || '/dashboard';
  }

  async function signInWithPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    setMessage('');

    if (!hasSupabaseBrowserConfig()) {
      setStatus('error');
      setMessage('Supabase auth is not configured in this environment yet.');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setStatus('error');
      setMessage(authErrorMessage(error.message));
      return;
    }

    window.location.assign(redirectPath());
  }

  async function sendMagicLink() {
    setStatus('sending');
    setMessage('');

    if (!hasSupabaseBrowserConfig()) {
      setStatus('error');
      setMessage('Auth is not configured in this environment yet.');
      return;
    }

    const response = await fetch('/api/auth/email-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mode: 'magiclink',
        email,
        redirectTo: redirectPath(),
      }),
    });
    const payload = (await response.json().catch(() => ({}))) as { error?: string };

    if (!response.ok) {
      setStatus('error');
      setMessage(payload.error || 'Could not send the sign-in link right now.');
      return;
    }

    setStatus('sent');
    setMessage('Check your email for a secure Education for Equality sign-in link.');
  }

  async function signInWithGoogle() {
    if (!isGoogleAuthEnabled) {
      setStatus('error');
      setMessage(authErrorMessage('google oauth provider is not configured'));
      return;
    }

    setStatus('sending');
    setMessage('');

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: buildAuthCallbackUrl(redirectPath()),
      },
    });

    if (error) {
      setStatus('error');
      setMessage(authErrorMessage(error.message));
    }
  }

  return (
    <div className="min-h-[80vh] bg-[var(--background)] px-4 py-8 sm:py-12">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
        <aside className="rounded-lg border border-emerald-100 bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--primary-dark)]">
              Learner access
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-[var(--primary-darker)]">
              Welcome back.
            </h1>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Continue lessons, review progress, or open Sabi from the same Education for Equality account.
            </p>
          </div>

          <div className="mt-8 space-y-4 border-t border-emerald-100 pt-6">
            <div className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--secondary)] text-sm font-bold text-[var(--primary-darker)]">
                1
              </span>
              <div>
                <p className="font-semibold text-gray-950">Secure sign-in</p>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Use a password, Google, or an Education for Equality email link.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--secondary)] text-sm font-bold text-[var(--primary-darker)]">
                2
              </span>
              <div>
                <p className="font-semibold text-gray-950">Right learner</p>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Your dashboard keeps placement and Sabi setup together.
                </p>
              </div>
            </div>
          </div>
        </aside>

        <div className="rounded-lg border border-emerald-100 bg-white p-5 shadow-[0_24px_70px_rgba(7,84,73,0.10)] sm:p-7 md:p-8">
          <div className="flex flex-col gap-4 border-b border-emerald-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--primary-dark)]">
                Account
              </p>
              <h2 className="mt-2 text-2xl font-bold text-gray-950">Sign in</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                Pick up where the learner left off.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={status === 'sending'}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-lg border border-emerald-100 bg-white px-4 py-3 text-base font-semibold text-gray-800 transition-colors hover:bg-emerald-50 disabled:opacity-60"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-sm font-black text-blue-600">
              G
            </span>
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
            <span className="h-px flex-1 bg-emerald-100" />
            or with email
            <span className="h-px flex-1 bg-emerald-100" />
          </div>

          <form onSubmit={signInWithPassword} className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">
              Email address
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="mt-2 w-full rounded-lg border border-emerald-100 bg-white px-4 py-3 text-base text-gray-950 outline-none transition-colors placeholder:text-gray-400 focus:border-[var(--primary-dark)] focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            <label className="block text-sm font-semibold text-gray-700">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="current-password"
                minLength={8}
                className="mt-2 w-full rounded-lg border border-emerald-100 bg-white px-4 py-3 text-base text-gray-950 outline-none transition-colors focus:border-[var(--primary-dark)] focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60"
            >
              {status === 'sending' ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <button
            type="button"
            onClick={sendMagicLink}
            disabled={status === 'sending' || status === 'sent' || !email}
            className="mt-3 w-full rounded-lg border border-emerald-100 bg-[var(--secondary)] px-4 py-3 text-sm font-semibold text-[var(--primary-darker)] transition-colors hover:bg-emerald-100 disabled:opacity-60"
          >
            Email me a sign-in link instead
          </button>

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
            New here?{' '}
            <Link
              href="/sign-up"
              onClick={goToSignUp}
              className="font-semibold text-[var(--primary-dark)] hover:underline"
            >
              Start learning free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
