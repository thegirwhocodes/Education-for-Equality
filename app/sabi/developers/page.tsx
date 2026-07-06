"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const API_MAIL = "api@eduforequality.org";

function ArrowIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="20" height="22" viewBox="0 0 200 212" fill="none" aria-hidden="true">
      <path d="M96 22 Q107 91 146 102 Q107 113 96 190 Q85 113 46 102 Q85 91 96 22 Z" fill="currentColor" />
      <path d="M150 30 Q155 47 166 52 Q155 57 150 74 Q145 57 134 52 Q145 47 150 30 Z" fill="currentColor" opacity="0.65" />
    </svg>
  );
}

function buildMailto(form: HTMLFormElement) {
  const data = new FormData(form);
  const value = (key: string) => String(data.get(key) || "").trim();
  const subject = `Sabi early access - ${value("organization") || value("name") || "new request"}`;
  const body = [
    "Hi Sabi team,",
    "",
    "I would love to join the Sabi developer early access list.",
    "",
    `Name: ${value("name")}`,
    `Work email: ${value("email")}`,
    `Organization / project: ${value("organization")}`,
    `What I am building: ${value("useCase")}`,
    `Expected monthly minutes: ${value("volume")}`,
    `Timeline: ${value("timeline")}`,
    "",
    "Accent, language, telephony, or launch notes:",
    value("notes") || "-",
    "",
    "Please keep me posted and invite me when the developer pilot opens.",
  ].join("\n");

  return `mailto:${API_MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const fitItems = [
  "Voice apps for Nigerian English, Pidgin, Yoruba, Hausa, or Igbo",
  "2G, noisy call-center, IVR, or feature-phone workflows",
  "Education, health, fintech, civic, and NGO pilots that need local speech",
];

const primitives = [
  { name: "transcribe", detail: "African-accent STT from phone audio" },
  { name: "speak", detail: "Nigerian voices for IVR and tutors" },
  { name: "tutor", detail: "Curriculum-aware dialogue turns" },
  { name: "identify", detail: "Shared-phone learner memory" },
];

export default function SabiDevelopersPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
    window.location.href = buildMailto(event.currentTarget);
  };

  return (
    <div className="flex-1">
      <section className="sabi-developer-hero border-b" style={{ borderColor: "var(--sabi-border)" }}>
        <div className="max-w-6xl mx-auto px-6 py-14 md:py-20 grid grid-cols-1 lg:grid-cols-[1fr_430px] gap-10 items-start">
          <div>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-widest sabi-accent-label mb-5">
              <SparkIcon />
              Developer API coming soon
            </p>
            <h1 className="sabi-display text-4xl md:text-6xl tracking-tight max-w-3xl mb-5">
              Be first in line for Sabi&apos;s African voice API.
            </h1>
            <p className="text-lg md:text-xl leading-relaxed text-[var(--sabi-muted)] max-w-2xl mb-7">
              We&apos;re opening Sabi&apos;s voice pipeline to a small group of builders first. If you&apos;re working on a tutor, hotline, IVR, or voice product for African speakers, tell us what you want to ship.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <a href="#request-access" className="sabi-btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm">
                Join early access <ArrowIcon />
              </a>
              <Link href="/sabi/pricing" className="sabi-btn-secondary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm">
                View pricing
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl">
              {[
                ["Opening", "to builders soon"],
                ["3-5", "design partners first"],
                ["1,000", "prototype minutes target"],
              ].map(([value, label]) => (
                <div key={label} className="sabi-developer-stat">
                  <div className="sabi-display text-3xl">{value}</div>
                  <p>{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="sabi-card sabi-developer-preview overflow-hidden">
            <div className="sabi-mini-terminal">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--sabi-admin-gold)]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--sabi-green)]" />
                <span className="ml-2 text-xs text-[var(--sabi-admin-muted)]">early-preview.js</span>
              </div>
              <pre className="text-xs md:text-sm leading-relaxed overflow-x-auto">
                <code>{`await sabi.voice.call({
  language: "en-NG",
  voice: "bukola",
  audio: phoneAudio,
  mode: "tutor"
});`}</code>
              </pre>
            </div>
            <div className="p-6 space-y-4">
              {primitives.map((item) => (
                <div key={item.name} className="flex items-start gap-3">
                  <span className="sabi-developer-check mt-0.5">
                    <CheckIcon />
                  </span>
                  <div>
                    <code className="text-sm font-semibold text-[var(--sabi-ink)]">{item.name}</code>
                    <p className="text-xs text-[var(--sabi-muted)] mt-1">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="sabi-section-answer border-b" style={{ borderColor: "var(--sabi-border)" }}>
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-14 grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-8 items-center">
          <div>
            <p className="text-xs uppercase tracking-widest sabi-accent-label mb-2">Best fit</p>
            <h2 className="sabi-display text-3xl md:text-4xl mb-3">For teams with a real voice problem in Africa.</h2>
            <p className="text-[var(--sabi-muted)] leading-relaxed">
              The best early partners are not browsing APIs for fun. They are trying to ship a call, hotline, tutor, or IVR that current global voice tools cannot understand well enough.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {fitItems.map((item) => (
              <div key={item} className="sabi-fit-row">
                <span className="sabi-fit-dot" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="request-access" className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8 items-start">
          <div className="lg:sticky lg:top-24">
            <p className="text-xs uppercase tracking-widest sabi-accent-label mb-2">Early access</p>
            <h2 className="sabi-display text-3xl md:text-4xl mb-3">Sign up if this is the voice layer you have been waiting for.</h2>
            <p className="text-[var(--sabi-muted)] leading-relaxed mb-6">
              We are opening to a small circle first. Join the list now, tell us what you want to ship, and we will invite the strongest fits into the developer pilot.
            </p>
            <div className="sabi-pilot-strip">
              <div>
                <span>1</span>
                <p>Join the interest list</p>
              </div>
              <div>
                <span>2</span>
                <p>Tell us the first call you want to ship</p>
              </div>
              <div>
                <span>3</span>
                <p>Get invited when the pilot opens</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="sabi-card p-6 md:p-8 sabi-access-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label>
                <span>Name</span>
                <input className="sabi-input" name="name" autoComplete="name" required />
              </label>
              <label>
                <span>Work email</span>
                <input className="sabi-input" name="email" type="email" autoComplete="email" required />
              </label>
              <label className="md:col-span-2">
                <span>Organization or project</span>
                <input className="sabi-input" name="organization" autoComplete="organization" required />
              </label>
              <label>
                <span>What are you building?</span>
                <select className="sabi-input" name="useCase" required defaultValue="">
                  <option value="" disabled>
                    Select a use case
                  </option>
                  <option>Edtech or tutoring</option>
                  <option>Health or NGO hotline</option>
                  <option>Fintech, bank, or IVR</option>
                  <option>Government digital service</option>
                  <option>Research or evaluation</option>
                  <option>Other voice app</option>
                </select>
              </label>
              <label>
                <span>Expected monthly minutes</span>
                <select className="sabi-input" name="volume" required defaultValue="">
                  <option value="" disabled>
                    Select volume
                  </option>
                  <option>Under 1,000</option>
                  <option>1,000 - 10,000</option>
                  <option>10,000 - 100,000</option>
                  <option>100,000+</option>
                  <option>Not sure yet</option>
                </select>
              </label>
              <label className="md:col-span-2">
                <span>Timeline</span>
                <select className="sabi-input" name="timeline" required defaultValue="">
                  <option value="" disabled>
                    Select timeline
                  </option>
                  <option>Exploring now</option>
                  <option>Prototype this month</option>
                  <option>Pilot in 60 days</option>
                  <option>Production use case</option>
                </select>
              </label>
              <label className="md:col-span-2">
                <span>Anything we should know?</span>
                <textarea
                  className="sabi-input sabi-textarea"
                  name="notes"
                  rows={5}
                  placeholder="Languages, accents, phone provider, sample audio, current voice stack, or the first call you want to ship."
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <p className="text-xs leading-relaxed text-[var(--sabi-muted)] max-w-md">
                This opens a pre-filled email to {API_MAIL}. No payment details, no calendar wall, just a clean way to raise your hand.
              </p>
              <button type="submit" className="sabi-btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm">
                Join the list <ArrowIcon />
              </button>
            </div>
            {sent && (
              <p className="mt-4 text-sm text-[var(--sabi-green)]">
                Your email draft is ready. Send it from your mail app and we will know you want in.
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
