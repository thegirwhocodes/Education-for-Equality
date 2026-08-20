"use client";

import { useState } from "react";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
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
        body: JSON.stringify({ name, phone_number: phone, email }),
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
          Sabi will call you in your evening window, between{" "}
          <strong>6pm and 8pm Lagos time</strong>, starting tomorrow. Save{" "}
          <strong>+1 715 312 2345</strong> as <em>Sabi</em> so you don&apos;t ignore it.
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
          The phone you&apos;ll actually answer. Calls are free to receive.
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
