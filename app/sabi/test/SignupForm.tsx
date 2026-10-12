"use client";

import { useState } from "react";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredCallTime, setPreferredCallTime] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setStatus("sending");
    try {
      const response = await fetch("/api/sabi/tester-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone_number: phone,
          preferred_call_time: preferredCallTime,
          email,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }
      setStatus("done");
    } catch {
      setError("Could not reach the server. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-lg border border-[var(--sabi-gold,#CBA868)] p-6 text-center">
        <p className="text-lg font-semibold mb-2">You&apos;re on the list.</p>
        <p className="text-[var(--sabi-muted)]">
          Save <strong>+234 201 700 1459</strong> as <em>Sabi</em>. Ring once
          and hang up whenever you are ready; Sabi will call you back. Your
          scheduled calls will use the Lagos-time window you selected.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block mb-1 font-medium">
          Your name
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
          className="w-full rounded-md border px-4 py-3"
          placeholder="Oluremi"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block mb-1 font-medium">
          The number Sabi should call
        </label>
        <input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          inputMode="tel"
          autoComplete="tel"
          className="w-full rounded-md border px-4 py-3"
          placeholder="0803 123 4567"
        />
        <p className="mt-1 text-sm text-[var(--sabi-muted)]">
          The phone you&apos;ll actually answer. You are not charged to receive calls.
        </p>
      </div>

      <div>
        <label htmlFor="preferred-call-time" className="block mb-1 font-medium">
          What time should Sabi call?
        </label>
        <input
          id="preferred-call-time"
          value={preferredCallTime}
          onChange={(e) => setPreferredCallTime(e.target.value)}
          required
          type="time"
          className="w-full rounded-md border px-4 py-3"
        />
        <p className="mt-1 text-sm text-[var(--sabi-muted)]">
          Lagos time. Pick a time when you can speak for about ten minutes.
        </p>
      </div>

      <div>
        <label htmlFor="email" className="block mb-1 font-medium">
          Email <span className="font-normal text-[var(--sabi-muted)]">(optional)</span>
        </label>
        <input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          autoComplete="email"
          className="w-full rounded-md border px-4 py-3"
          placeholder="you@example.com"
        />
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="sabi-btn-gold w-full px-8 py-4 text-lg disabled:opacity-60"
      >
        {status === "sending" ? "Signing you up…" : "Sign me up"}
      </button>
    </form>
  );
}
