import type { Metadata } from "next";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: "Test Sabi — Education for Equality",
  description:
    "Take one five-minute call a day for five days and help us find where Sabi breaks.",
};

const DAYS = [
  { day: "Day 1", focus: "Baseline", detail: "Quiet room, normal voice." },
  { day: "Day 2", focus: "Memory", detail: "Does she greet you by name and carry on where you stopped?" },
  { day: "Day 3", focus: "Noise", detail: "Call from a kitchen, traffic, a room with the TV on." },
  { day: "Day 4", focus: "Numbers", detail: "Say 13, 30, 15, 50, 32, 35, 36, 42, 48 — slow, normal, fast." },
  { day: "Day 5", focus: "Break her", detail: "Go silent. Interrupt. Be wrong on purpose." },
];

const TASKS = [
  "Say your name when she asks.",
  "Answer one question clearly.",
  "Mumble one answer, the way a tired child would.",
  "Interrupt her mid-sentence — she should stop and listen.",
  'Say "I don\'t know" — she should teach you, not mark you wrong.',
  "Give a wrong answer on purpose — she should walk you to the right one.",
];

export default function TestSabiPage() {
  return (
    <div className="flex-1">
      <section className="border-b sabi-hero">
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <p className="sabi-byline mb-3">Education for Equality</p>
          <h1 className="sabi-display text-4xl md:text-5xl mb-4">Help us test Sabi</h1>
          <p className="text-lg text-[var(--sabi-muted)] leading-relaxed">
            Sabi is a teacher children reach by phone call — no smartphone, no internet,
            no cost. We&apos;re not asking you to admire her. We&apos;re asking you to
            find out where she breaks.
          </p>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-6 py-14">
        <h2 className="sabi-display text-2xl mb-4">What we&apos;re asking</h2>
        <p className="mb-3 leading-relaxed">
          <strong>One call a day for five days.</strong> Each call is five to seven
          minutes, plus a minute to send us a voice note afterwards. Extra calls are
          welcome — more calls is more signal.
        </p>
        <p className="leading-relaxed">
          <strong>Sabi calls you, between 6pm and 8pm Lagos time.</strong> You never
          dial, and you never pay. The call comes from{" "}
          <strong>+1 715 312 2345</strong> — save it as <em>Sabi</em> so you
          don&apos;t ignore it. Incoming international calls are free to receive in
          Nigeria.
        </p>
      </section>

      <section className="max-w-2xl mx-auto px-6 pb-14">
        <h2 className="sabi-display text-2xl mb-4">Six things to do on every call</h2>
        <ol className="space-y-2 list-decimal pl-5">
          {TASKS.map((task) => (
            <li key={task} className="leading-relaxed">{task}</li>
          ))}
        </ol>
        <p className="mt-4 text-[var(--sabi-muted)]">
          Speak your natural Nigerian English. Don&apos;t try to sound American or
          British — if she only understands a fake accent, she is useless to us.
        </p>
      </section>

      <section className="max-w-2xl mx-auto px-6 pb-14">
        <h2 className="sabi-display text-2xl mb-4">What each day is for</h2>
        <ul className="space-y-3">
          {DAYS.map(({ day, focus, detail }) => (
            <li key={day} className="border-l-2 border-[var(--sabi-gold,#CBA868)] pl-4">
              <p className="font-semibold">
                {day} — {focus}
              </p>
              <p className="text-[var(--sabi-muted)]">{detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="max-w-2xl mx-auto px-6 pb-14">
        <h2 className="sabi-display text-2xl mb-4">Afterwards</h2>
        <p className="mb-3 leading-relaxed">
          Send a WhatsApp voice note to <strong>+1 860 436 7048</strong>. Speak it the
          way you&apos;d tell a friend — you don&apos;t have to write anything.
        </p>
        <p className="leading-relaxed">
          The most valuable thing you can give us is{" "}
          <strong>exactly what you said and exactly what she heard</strong>, especially
          for numbers. If she ever marks you wrong when you were right, tell us — that
          is the worst thing this product can do to a child.
        </p>
      </section>

      <section className="max-w-2xl mx-auto px-6 pb-14">
        <h2 className="sabi-display text-2xl mb-4">Before you sign up</h2>
        <ul className="space-y-2 list-disc pl-5 text-[var(--sabi-muted)]">
          <li>Every call is recorded and transcribed — that is the point of the test.</li>
          <li>Recordings stay inside the project and are never published without your written permission.</li>
          <li>You can stop at any time, and your recordings are deleted within seven days.</li>
          <li>Adults only. Please don&apos;t put a child on the phone — that round is separate.</li>
        </ul>
      </section>

      <section className="max-w-2xl mx-auto px-6 pb-20">
        <h2 className="sabi-display text-2xl mb-4">Sign up</h2>
        <SignupForm />
        <p className="mt-6 text-sm text-[var(--sabi-muted)]">
          Questions? Naomi Ivie — WhatsApp or call +1 860 436 7048 ·
          nivie@wesleyan.edu
        </p>
      </section>
    </div>
  );
}
