'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { createBrowserSupabaseClient, hasSupabaseBrowserConfig } from '@/lib/auth/browser';

export default function SignUpPage() {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function sendMagicLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    setMessage('');

    if (!hasSupabaseBrowserConfig()) {
      setStatus('error');
      setMessage('Magic-link auth is not configured in this environment yet.');
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const redirectTo = params.get('redirectTo') || '/dashboard';
    const callback = new URL('/auth/callback', window.location.origin);
    callback.searchParams.set('next', redirectTo);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: callback.toString(),
        shouldCreateUser: true,
      },
    });

    if (error) {
      setStatus('error');
      setMessage(error.message);
      return;
    }

    setStatus('sent');
    setMessage('Check your email for a secure sign-in link. No password needed.');
  }

  return (
    <div className="min-h-[80vh] bg-gray-50 px-4 py-12">
      <div className="mx-auto w-full max-w-md rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Start Learning Free</h1>
          <p className="mt-2 text-gray-600">Use a magic link to create your account and track progress.</p>
        </div>

        <form onSubmit={sendMagicLink} className="mt-8 space-y-4">
          <label className="block text-sm font-semibold text-gray-700">
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none focus:border-[var(--primary-dark)] focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60"
          >
            {status === 'sending' ? 'Sending...' : 'Send magic link'}
          </button>
        </form>

        {message && (
          <div
            className={`mt-5 rounded-lg border p-3 text-sm leading-6 ${
              status === 'error'
                ? 'border-red-200 bg-red-50 text-red-800'
                : 'border-emerald-200 bg-emerald-50 text-emerald-900'
            }`}
          >
            {message}
          </div>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/sign-in" className="font-semibold text-[var(--primary-dark)] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
