'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { GoogleIcon } from '@/components/auth/GoogleIcon';
import { createBrowserSupabaseClient, hasSupabaseBrowserConfig } from '@/lib/auth/browser';
import {
  PENDING_LEARNER_PROFILE_KEY,
  type LearnerMetadata,
} from '@/lib/auth/learner-onboarding';
import { authErrorMessage } from '@/lib/auth/messages';
import { buildAuthCallbackUrl } from '@/lib/auth/url';

const inputClassName =
  'mt-2 w-full rounded-lg border border-emerald-100 bg-white px-4 py-3 text-base text-gray-950 outline-none transition-colors placeholder:text-gray-400 focus:border-[var(--primary-dark)] focus:ring-2 focus:ring-emerald-100';

const selectClassName =
  'mt-2 w-full rounded-lg border border-emerald-100 bg-white px-4 py-3 text-base text-gray-950 outline-none transition-colors focus:border-[var(--primary-dark)] focus:ring-2 focus:ring-emerald-100';

const sectionClassName = 'space-y-4 border-t border-emerald-100 pt-6 first:border-t-0 first:pt-0';

const sectionLabelClassName =
  'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--secondary)] text-sm font-bold text-[var(--primary-darker)]';

const learnerTypeOptions = [
  { value: 'child', label: 'A child I care for' },
  { value: 'self', label: 'I am learning myself' },
  { value: 'teacher_or_coordinator', label: 'A learner I support' },
];

const ageRangeOptions = [
  { value: 'under_8', label: 'Under 8' },
  { value: '8_10', label: '8-10' },
  { value: '11_14', label: '11-14' },
  { value: '15_17', label: '15-17' },
  { value: '18_plus', label: '18 or older' },
];

const schoolStatusOptions = [
  { value: 'in_school', label: 'In school' },
  { value: 'out_of_school', label: 'Not currently in school' },
  { value: 'irregular', label: 'Sometimes attends school' },
  { value: 'not_sure', label: 'Not sure' },
];

const classLevelOptions = [
  { value: 'not_started', label: 'Has not started school' },
  { value: 'primary_1_2', label: 'Primary 1-2' },
  { value: 'primary_3_4', label: 'Primary 3-4' },
  { value: 'primary_5_6', label: 'Primary 5-6' },
  { value: 'jss', label: 'Junior secondary' },
  { value: 'sss', label: 'Senior secondary' },
  { value: 'adult_or_unknown', label: 'Adult or not sure' },
];

const literacyLevelOptions = [
  { value: 'not_reading_words', label: 'Not reading words yet' },
  { value: 'letters_and_sounds', label: 'Knows some letters or sounds' },
  { value: 'simple_words', label: 'Reads simple words' },
  { value: 'short_sentences', label: 'Reads short sentences' },
  { value: 'short_passages', label: 'Reads short passages' },
  { value: 'not_sure', label: 'Not sure' },
];

const numeracyLevelOptions = [
  { value: 'learning_to_count', label: 'Learning to count' },
  { value: 'counts_compares', label: 'Counts and compares numbers' },
  { value: 'adds_subtracts', label: 'Adds or subtracts' },
  { value: 'multiplies_divides', label: 'Multiplies or divides' },
  { value: 'word_problems_grade4', label: 'Word problems or Grade 4 math' },
  { value: 'not_sure', label: 'Not sure' },
];

const homeLanguageOptions = [
  { value: 'english', label: 'English' },
  { value: 'nigerian_pidgin', label: 'Nigerian Pidgin' },
  { value: 'yoruba', label: 'Yoruba' },
  { value: 'igbo', label: 'Igbo' },
  { value: 'hausa', label: 'Hausa' },
  { value: 'other', label: 'Other' },
];

const deliveryModeOptions = [
  { value: 'web', label: 'Website lessons' },
  { value: 'sabi_phone', label: 'Sabi phone calls' },
  { value: 'both', label: 'Website and Sabi calls' },
];

const phoneAccessOptions = [
  { value: 'own_phone', label: 'Learner has their own phone' },
  { value: 'shared_family_phone', label: 'Shared family phone' },
  { value: 'caregiver_handoff', label: 'Caregiver will hand over the phone' },
  { value: 'web_only', label: 'No phone lessons yet' },
];

const preferredCallTimeOptions = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
  { value: 'weekend', label: 'Weekend' },
  { value: 'flexible', label: 'Flexible' },
];

function literacyPlacementHint(literacyLevel: string) {
  if (literacyLevel === 'short_passages') return 'grade_4_english_bridge';
  if (literacyLevel === 'short_sentences') return 'foundational_literacy_phase_2';
  if (literacyLevel === 'simple_words') return 'foundational_literacy_module_7';
  if (literacyLevel === 'letters_and_sounds') return 'foundational_literacy_module_5';
  return 'foundational_literacy_diagnostic';
}

function numeracyPlacementHint(numeracyLevel: string) {
  if (numeracyLevel === 'word_problems_grade4') return 'grade_4_math_bridge';
  if (numeracyLevel === 'multiplies_divides') return 'foundational_numeracy_module_5_or_6';
  if (numeracyLevel === 'adds_subtracts') return 'foundational_numeracy_module_3_or_4';
  if (numeracyLevel === 'counts_compares') return 'foundational_numeracy_module_2';
  return 'foundational_numeracy_diagnostic';
}

export default function SignUpPage() {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const isGoogleAuthEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === 'true';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [learnerType, setLearnerType] = useState('child');
  const [learnerName, setLearnerName] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [schoolStatus, setSchoolStatus] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [literacyLevel, setLiteracyLevel] = useState('');
  const [numeracyLevel, setNumeracyLevel] = useState('');
  const [homeLanguage, setHomeLanguage] = useState('');
  const [deliveryMode, setDeliveryMode] = useState('web');
  const [sabiPhone, setSabiPhone] = useState('');
  const [phoneAccess, setPhoneAccess] = useState('web_only');
  const [preferredCallTime, setPreferredCallTime] = useState('');
  const [guardianConsent, setGuardianConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const needsPhoneDetails = deliveryMode === 'sabi_phone' || deliveryMode === 'both';
  const isMinorLearner =
    learnerType !== 'self' ||
    ['under_8', '8_10', '11_14', '15_17'].includes(ageRange);

  function goToSignIn(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    window.location.assign(`/sign-in${window.location.search}`);
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

  function buildLearnerMetadata(): LearnerMetadata | null {
    const requiredFields = [
      learnerType,
      learnerName.trim(),
      ageRange,
      schoolStatus,
      classLevel,
      literacyLevel,
      numeracyLevel,
      homeLanguage,
      deliveryMode,
    ];

    if (requiredFields.some((field) => !field)) {
      setStatus('error');
      setMessage('Finish the learner setup first so Education for Equality can start at the right level.');
      return null;
    }

    if (needsPhoneDetails && !sabiPhone.trim()) {
      setStatus('error');
      setMessage('Add the phone number Sabi should use for lessons, or choose website lessons only.');
      return null;
    }

    if (needsPhoneDetails && !preferredCallTime) {
      setStatus('error');
      setMessage('Choose the best time for Sabi phone lessons.');
      return null;
    }

    if (isMinorLearner && !guardianConsent) {
      setStatus('error');
      setMessage('A parent, guardian, or authorized educator must consent before a child learner starts.');
      return null;
    }

    return {
      onboarding_version: 'learner-setup-2026-07-07',
      learner_type: learnerType,
      learner_first_name_or_nickname: learnerName.trim(),
      learner_age_range: ageRange,
      school_status: schoolStatus,
      class_level: classLevel,
      literacy_self_level: literacyLevel,
      numeracy_self_level: numeracyLevel,
      home_language: homeLanguage,
      delivery_mode: deliveryMode,
      sabi_phone_number: needsPhoneDetails ? sabiPhone.trim() : null,
      phone_access: needsPhoneDetails ? phoneAccess : 'web_only',
      preferred_call_time: needsPhoneDetails ? preferredCallTime : null,
      guardian_consent: isMinorLearner ? guardianConsent : false,
      guardian_consent_at: isMinorLearner ? new Date().toISOString() : null,
      literacy_placement_hint: literacyPlacementHint(literacyLevel),
      numeracy_placement_hint: numeracyPlacementHint(numeracyLevel),
      placement_source: 'signup_self_report_then_sabi_diagnostic',
      requires_sabi_diagnostic: true,
    };
  }

  async function signUpWithPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    setMessage('');

    if (!hasSupabaseBrowserConfig()) {
      setStatus('error');
      setMessage('Supabase auth is not configured in this environment yet.');
      return;
    }

    const learnerMetadata = buildLearnerMetadata();
    if (!learnerMetadata) return;

    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Those passwords do not match.');
      return;
    }

    const response = await fetch('/api/auth/email-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mode: 'signup',
        email,
        password,
        redirectTo: redirectPath(),
        metadata: learnerMetadata,
      }),
    });
    const payload = (await response.json().catch(() => ({}))) as { error?: string };

    if (!response.ok) {
      setStatus('error');
      setMessage(payload.error || 'Could not send the confirmation email right now.');
      return;
    }

    setStatus('sent');
    setMessage('Check your email to confirm your Education for Equality account.');
  }

  async function sendMagicLink() {
    setStatus('sending');
    setMessage('');

    if (!hasSupabaseBrowserConfig()) {
      setStatus('error');
      setMessage('Auth is not configured in this environment yet.');
      return;
    }

    const learnerMetadata = buildLearnerMetadata();
    if (!learnerMetadata) return;

    const response = await fetch('/api/auth/email-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mode: 'magiclink',
        email,
        redirectTo: redirectPath(),
        metadata: learnerMetadata,
      }),
    });
    const payload = (await response.json().catch(() => ({}))) as { error?: string };

    if (!response.ok) {
      setStatus('error');
      setMessage(payload.error || 'Could not send the sign-in link right now.');
      return;
    }

    setStatus('sent');
    setMessage('Check your email for a secure Education for Equality sign-in link. No password needed.');
  }

  async function signUpWithGoogle() {
    const learnerMetadata = buildLearnerMetadata();
    if (!learnerMetadata) return;

    if (!isGoogleAuthEnabled) {
      setStatus('error');
      setMessage(authErrorMessage('google oauth provider is not configured', 'oauth'));
      return;
    }

    setStatus('sending');
    setMessage('');
    window.localStorage.setItem(PENDING_LEARNER_PROFILE_KEY, JSON.stringify(learnerMetadata));

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: buildAuthCallbackUrl(redirectPath()),
      },
    });

    if (error) {
      window.localStorage.removeItem(PENDING_LEARNER_PROFILE_KEY);
      setStatus('error');
      setMessage(authErrorMessage(error.message, 'oauth'));
    }
  }

  return (
    <div className="min-h-[80vh] bg-[var(--background)] px-4 py-8 sm:py-12">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <aside className="rounded-lg border border-emerald-100 bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--primary-dark)]">
              Learner placement
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-[var(--primary-darker)]">
              Start at the right level.
            </h1>
            <p className="mt-4 text-base leading-7 text-gray-600">
              A short setup helps Education for Equality route each learner into foundational literacy,
              foundational numeracy, or the Grade 4 bridge.
            </p>
          </div>

          <div className="mt-8 space-y-4 border-t border-emerald-100 pt-6">
            <div className="flex gap-3">
              <span className={sectionLabelClassName}>1</span>
              <div>
                <p className="font-semibold text-gray-950">Profile</p>
                <p className="mt-1 text-sm leading-6 text-gray-600">Age range, school status, and class level.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className={sectionLabelClassName}>2</span>
              <div>
                <p className="font-semibold text-gray-950">Placement</p>
                <p className="mt-1 text-sm leading-6 text-gray-600">Reading and math starting points before diagnostic.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className={sectionLabelClassName}>3</span>
              <div>
                <p className="font-semibold text-gray-950">Access</p>
                <p className="mt-1 text-sm leading-6 text-gray-600">Website lessons, Sabi calls, or both.</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="rounded-lg border border-emerald-100 bg-white p-5 shadow-[0_24px_70px_rgba(7,84,73,0.10)] sm:p-7 md:p-8">
          <div className="flex flex-col gap-4 border-b border-emerald-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--primary-dark)]">
                Free account
              </p>
              <h2 className="mt-2 text-2xl font-bold text-gray-950">Create learner profile</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                Sabi will still run a short diagnostic before placing the learner.
              </p>
            </div>
          </div>

          <form onSubmit={signUpWithPassword} className="mt-6 space-y-7">
            <section className={sectionClassName}>
              <div className="flex gap-3">
                <span className={sectionLabelClassName}>1</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-950">Learner setup</h3>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    The minimum details needed to place the learner safely.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {learnerTypeOptions.map((option) => {
                  const selected = learnerType === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setLearnerType(option.value)}
                      className={`min-h-16 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition-colors ${
                        selected
                          ? 'border-[var(--primary-dark)] bg-[var(--secondary)] text-[var(--primary-darker)]'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Learner first name or nickname
                  <input
                    type="text"
                    value={learnerName}
                    onChange={(event) => setLearnerName(event.target.value)}
                    required
                    autoComplete="given-name"
                    placeholder="Amina"
                    className={inputClassName}
                  />
                </label>

                <label className="block text-sm font-semibold text-gray-700">
                  Age range
                  <select
                    value={ageRange}
                    onChange={(event) => setAgeRange(event.target.value)}
                    required
                    className={selectClassName}
                  >
                    <option value="">Select age range</option>
                    {ageRangeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm font-semibold text-gray-700">
                  School status
                  <select
                    value={schoolStatus}
                    onChange={(event) => setSchoolStatus(event.target.value)}
                    required
                    className={selectClassName}
                  >
                    <option value="">Select status</option>
                    {schoolStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm font-semibold text-gray-700">
                  Current class level
                  <select
                    value={classLevel}
                    onChange={(event) => setClassLevel(event.target.value)}
                    required
                    className={selectClassName}
                  >
                    <option value="">Select class level</option>
                    {classLevelOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </section>

            <section className={sectionClassName}>
              <div className="flex gap-3">
                <span className={sectionLabelClassName}>2</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-950">Starting level</h3>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    This routes the first diagnostic toward foundational or Grade 4 work.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Reading now
                  <select
                    value={literacyLevel}
                    onChange={(event) => setLiteracyLevel(event.target.value)}
                    required
                    className={selectClassName}
                  >
                    <option value="">Select reading level</option>
                    {literacyLevelOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm font-semibold text-gray-700">
                  Math now
                  <select
                    value={numeracyLevel}
                    onChange={(event) => setNumeracyLevel(event.target.value)}
                    required
                    className={selectClassName}
                  >
                    <option value="">Select math level</option>
                    {numeracyLevelOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm font-semibold text-gray-700">
                  Main language at home
                  <select
                    value={homeLanguage}
                    onChange={(event) => setHomeLanguage(event.target.value)}
                    required
                    className={selectClassName}
                  >
                    <option value="">Select language</option>
                    {homeLanguageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm font-semibold text-gray-700">
                  Lesson delivery
                  <select
                    value={deliveryMode}
                    onChange={(event) => {
                      const nextMode = event.target.value;
                      setDeliveryMode(nextMode);
                      if (nextMode === 'web') {
                        setPhoneAccess('web_only');
                        setPreferredCallTime('');
                      } else if (phoneAccess === 'web_only') {
                        setPhoneAccess('shared_family_phone');
                      }
                    }}
                    required
                    className={selectClassName}
                  >
                    {deliveryModeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </section>

            {needsPhoneDetails && (
              <section className="space-y-4 rounded-lg border border-emerald-100 bg-[var(--secondary)] p-5">
                <div className="flex gap-3">
                  <span className={sectionLabelClassName}>3</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-950">Sabi call delivery</h3>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Used only when phone lessons are selected.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Phone number for Sabi calls
                    <input
                      type="tel"
                      value={sabiPhone}
                      onChange={(event) => setSabiPhone(event.target.value)}
                      required={needsPhoneDetails}
                      autoComplete="tel"
                      placeholder="+234..."
                      className={inputClassName}
                    />
                  </label>

                  <label className="block text-sm font-semibold text-gray-700">
                    Phone access
                    <select
                      value={phoneAccess}
                      onChange={(event) => setPhoneAccess(event.target.value)}
                      required={needsPhoneDetails}
                      className={selectClassName}
                    >
                      {phoneAccessOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block text-sm font-semibold text-gray-700 md:col-span-2">
                    Best time for calls
                    <select
                      value={preferredCallTime}
                      onChange={(event) => setPreferredCallTime(event.target.value)}
                      required={needsPhoneDetails}
                      className={selectClassName}
                    >
                      <option value="">Select call time</option>
                      {preferredCallTimeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </section>
            )}

            {isMinorLearner && (
              <label className="flex gap-3 rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-gray-700">
                <input
                  type="checkbox"
                  checked={guardianConsent}
                  onChange={(event) => setGuardianConsent(event.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-[var(--primary-dark)]"
                />
                <span>
                  I am the parent, guardian, or authorized educator for this learner and consent to
                  Education for Equality using this account to deliver lessons and save learning progress.
                </span>
              </label>
            )}

            <section className={sectionClassName}>
              <div className="flex gap-3">
                <span className={sectionLabelClassName}>4</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-950">Account</h3>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Use a password, Google, or a secure sign-in link.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-semibold text-gray-700 md:col-span-2">
                  Email address
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={inputClassName}
                  />
                </label>

                <label className="block text-sm font-semibold text-gray-700">
                  Password
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    autoComplete="new-password"
                    minLength={8}
                    className={inputClassName}
                  />
                </label>

                <label className="block text-sm font-semibold text-gray-700">
                  Confirm password
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                    autoComplete="new-password"
                    minLength={8}
                    className={inputClassName}
                  />
                </label>

                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-pressed={showPassword}
                    className="text-sm font-semibold text-[var(--primary-dark)] hover:underline"
                  >
                    {showPassword ? 'Hide passwords' : 'Show passwords'}
                  </button>
                </div>
              </div>
            </section>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60"
            >
              {status === 'sending' ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          {message && (
            <div
              className={`mt-4 rounded-lg border p-3 text-sm leading-6 ${
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

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={signUpWithGoogle}
              disabled={status === 'sending'}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-60"
            >
              <GoogleIcon className="h-[18px] w-[18px]" />
              Continue with Google
            </button>

            <button
              type="button"
              onClick={sendMagicLink}
              disabled={status === 'sending' || status === 'sent' || !email}
              className="w-full rounded-lg border border-emerald-100 bg-[var(--secondary)] px-4 py-3 text-sm font-semibold text-[var(--primary-darker)] transition-colors hover:bg-emerald-100 disabled:opacity-60"
            >
              Email me a sign-in link instead
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link
              href="/sign-in"
              onClick={goToSignIn}
              className="font-semibold text-[var(--primary-dark)] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
