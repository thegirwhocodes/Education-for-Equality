'use client';

import { useState } from 'react';

function cleanPhoneInput(phone: string) {
  return phone.replace(/[^\d+]/g, '');
}

export function SabiDirectCallPanel({ compact = false }: { compact?: boolean }) {
  const [phone, setPhone] = useState('');
  const [callState, setCallState] = useState<'idle' | 'calling' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const normalizedPhone = cleanPhoneInput(phone);
  const canCall = callState !== 'calling' && normalizedPhone.length >= 8;

  const startSabiCall = async () => {
    if (!canCall) {
      setCallState('error');
      setMessage('Enter a phone number first.');
      return;
    }

    setCallState('calling');
    setMessage('Starting call...');

    try {
      const response = await fetch('/api/sabi/direct-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: normalizedPhone }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || 'Could not start the call.');
      }
      setCallState('success');
      setMessage(`Sabi is calling ${payload.phone || normalizedPhone} now.`);
    } catch (error) {
      setCallState('error');
      setMessage(error instanceof Error ? error.message : 'Could not start the call.');
    }
  };

  return (
    <section className={`border border-emerald-200 bg-white shadow-sm ${compact ? 'p-4' : 'p-5'}`}>
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--primary-dark)]">
            Sabi phone test
          </p>
          <h2 className="mt-1 text-xl font-bold text-gray-950">Call a test number</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
            Enter a phone number and start a live Sabi callback immediately.
          </p>
          {message && (
            <p
              className={`mt-2 text-sm font-semibold ${
                callState === 'error' ? 'text-rose-700' : 'text-[var(--primary-dark)]'
              }`}
              aria-live="polite"
            >
              {message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sr-only" htmlFor="sabi-direct-call-phone">
            Phone number
          </label>
          <input
            id="sabi-direct-call-phone"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                void startSabiCall();
              }
            }}
            placeholder="+18604367048"
            className="h-10 w-full min-w-0 border border-gray-300 px-3 text-sm outline-none focus:border-[var(--primary-dark)] sm:w-52"
          />
          <button
            type="button"
            onClick={startSabiCall}
            disabled={!canCall}
            className="h-10 bg-[var(--primary-dark)] px-4 text-sm font-semibold text-white hover:bg-[var(--primary-darker)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {callState === 'calling' ? 'Calling...' : 'Call'}
          </button>
        </div>
      </div>
    </section>
  );
}
