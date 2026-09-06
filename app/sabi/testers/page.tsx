import type { Metadata } from "next";
import SignupForm from "../test/SignupForm";

export const metadata: Metadata = {
  title: "Five days with Sabi — Adult tester guide",
  description:
    "The mobile guide for invited adults testing Sabi over five days.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

const everyCall = [
  {
    number: "01",
    title: "Say your real name",
    detail: "Use the name you normally use. Notice whether Sabi remembers it on later calls.",
  },
  {
    number: "02",
    title: "Answer normally",
    detail: "Give at least one clear answer in your natural Nigerian English.",
  },
  {
    number: "03",
    title: "Make one answer difficult",
    detail: "Mumble, speak quickly, or answer quietly—like a shy or tired child might.",
  },
  {
    number: "04",
    title: "Interrupt her",
    detail: "Start speaking while Sabi is talking. She should stop quickly and listen.",
  },
  {
    number: "05",
    title: "Say “I don’t know”",
    detail: "She should teach you a step instead of treating it as a wrong answer.",
  },
  {
    number: "06",
    title: "Give one wrong answer",
    detail: "She should help you work it out—not simply praise it or say “wrong.”",
  },
];

const days = [
  {
    day: "Day 1",
    title: "A fair first call",
    summary: "Quiet room, good signal, normal voice.",
    tasks: [
      "Let the conversation run naturally for five to seven minutes.",
      "Notice whether the lesson feels like teaching or like a quiz.",
      "Check whether the call ends properly instead of suddenly cutting off.",
    ],
  },
  {
    day: "Day 2",
    title: "Memory and a shared phone",
    summary: "Can Sabi remember the right person?",
    tasks: [
      "Use the same phone and see whether Sabi remembers your name and progress.",
      "Partway through, say: “No, this is someone else,” then give a different name.",
      "Check whether she starts fresh for the new person instead of mixing both learners.",
    ],
  },
  {
    day: "Day 3",
    title: "Real Nigerian noise",
    summary: "Try a kitchen, television, traffic, fan or generator.",
    tasks: [
      "Answer in the same way you did on Day 1.",
      "Notice whether she invents words or sentences you never said.",
      "Tell us which noise was present and whether the line itself sounded clear.",
    ],
  },
  {
    day: "Day 4",
    title: "Numbers under pressure",
    summary: "This is the most important accuracy test.",
    tasks: [
      "Use these answers when the lesson gives you an opening: 13, 30, 15, 50, 32, 35, 36, 42 and 48.",
      "Say a number slowly, naturally and quickly.",
      "Write every mismatch exactly: “I said thirty; Sabi heard thirteen.”",
    ],
  },
  {
    day: "Day 5",
    title: "Try to break her",
    summary: "Be difficult on purpose.",
    tasks: [
      "Stay silent for five seconds, interrupt repeatedly and get three answers wrong.",
      "Answer with something unrelated or ask a question she was not expecting.",
      "Keep going past seven minutes and see whether she closes the lesson gracefully.",
    ],
  },
];

const reportQuestions = [
  "What exact words or numbers did Sabi mishear?",
  "Did she ever mark a correct answer wrong—or praise an answer you did not give?",
  "When you interrupted, did she stop quickly?",
  "When you were wrong or unsure, did her response feel like help or like a test?",
  "Would you want this voice teaching a child? Why?",
  "Did the call last five to seven minutes and end properly?",
];

export default function SabiTesterGuidePage() {
  return (
    <div className="min-h-screen bg-[#f6f1e7] text-[#171713]">
      <header className="border-b border-[#d8c9a5] bg-[#112b26] text-white">
        <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d9bb72]">
            Invited adult tester guide
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[0.95] sm:text-7xl">
            Five days
            <br />
            with Sabi
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
            One short phone lesson a day. Your job is not to be polite—it is to find
            every place Sabi misunderstands, teaches badly or breaks.
          </p>
          <div className="mt-8 grid max-w-xl grid-cols-3 divide-x divide-white/20 border-y border-white/20 py-4">
            <div className="pr-4">
              <p className="text-2xl font-semibold">5</p>
              <p className="text-xs text-white/60">days</p>
            </div>
            <div className="px-4">
              <p className="text-2xl font-semibold">1+</p>
              <p className="text-xs text-white/60">call daily</p>
            </div>
            <div className="pl-4">
              <p className="text-2xl font-semibold">10</p>
              <p className="text-xs text-white/60">minutes</p>
            </div>
          </div>
          <a
            href="tel:+2342017001459"
            className="mt-8 inline-flex min-h-12 items-center justify-center bg-[#d9bb72] px-6 py-3 font-semibold text-[#112b26]"
          >
            Call Sabi: +234 201 700 1459
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-5 py-12 sm:space-y-10 sm:px-8 sm:py-16 [&>section+section]:border-t [&>section+section]:border-[#ded3bc] [&>section+section]:pt-8 sm:[&>section+section]:pt-10">
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6926]">
              What Sabi is
            </p>
            <h2 className="mt-3 font-serif text-4xl text-[#112b26]">
              A teacher reached by phone call.
            </h2>
          </div>
          <div className="space-y-4 text-base leading-7 text-[#46443c]">
            <p>
              Sabi is an AI tutor that teaches foundational numeracy through a
              natural voice conversation. She asks questions, listens to the
              learner&apos;s answers and changes how she teaches when they need help.
            </p>
            <p>
              She is built for children who may not have a smartphone, internet or
              reliable access to a classroom. All they need is an ordinary phone.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6926]">
              Getting your call
            </p>
            <h2 className="mt-3 font-serif text-4xl text-[#112b26]">You should not pay.</h2>
          </div>
          <div className="space-y-4 text-base leading-7 text-[#46443c]">
            <p>
              Use the Nigerian Sabi number Naomi sent you. Let it ring once, then hang
              up. Sabi will call you back. Answer the callback and begin.
            </p>
            <p>
              If Naomi arranged a daily time instead, simply answer when Sabi rings.
              If the callback does not arrive, message Naomi with your network—MTN,
              Airtel, Glo or 9mobile—and the time you tried.
            </p>
            <div className="border-l-4 border-[#c99c3d] bg-white px-5 py-4 text-sm">
              Save the number as <strong>Sabi</strong>. There is no automatic second
              attempt if you miss the callback.
            </div>
          </div>
        </section>

        <section>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6926]">
            On every call
          </p>
          <h2 className="mt-3 max-w-2xl font-serif text-4xl text-[#112b26]">
            Six small tests that reveal big problems
          </h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {everyCall.map((item) => (
              <article key={item.number} className="border border-[#ded3bc] bg-white p-5">
                <div className="flex gap-4">
                  <span className="font-mono text-sm font-bold text-[#a87920]">{item.number}</span>
                  <div>
                    <h3 className="font-semibold text-[#112b26]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#625f55]">{item.detail}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6926]">
            The five-day plan
          </p>
          <h2 className="mt-3 font-serif text-4xl text-[#112b26]">A different pressure each day</h2>
          <div className="mt-7 divide-y divide-[#ded3bc] border-y border-[#ded3bc]">
            {days.map((item, index) => (
              <details key={item.day} className="group bg-white/50" open={index === 0}>
                <summary className="flex cursor-pointer list-none items-center gap-4 px-4 py-5 sm:px-6">
                  <span className="min-w-16 text-xs font-bold uppercase tracking-[0.14em] text-[#a87920]">
                    {item.day}
                  </span>
                  <span className="flex-1">
                    <span className="block text-lg font-semibold text-[#112b26]">{item.title}</span>
                    <span className="mt-1 block text-sm text-[#6c685e]">{item.summary}</span>
                  </span>
                  <span aria-hidden className="text-2xl text-[#8a6926] group-open:rotate-45">
                    +
                  </span>
                </summary>
                <ul className="space-y-3 px-4 pb-6 pl-24 text-sm leading-6 text-[#514e46] sm:px-6 sm:pl-28">
                  {item.tasks.map((task) => (
                    <li key={task} className="list-disc pl-1">
                      {task}
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </section>

        <section className="grid gap-8 bg-[#112b26] px-5 py-8 text-white sm:px-8 sm:py-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9bb72]">
              After every call
            </p>
            <h2 className="mt-3 font-serif text-4xl">Tell us what really happened.</h2>
            <p className="mt-4 text-sm leading-6 text-white/70">
              Send Naomi a WhatsApp voice note for how the call felt. For every
              misheard number, also send one typed sentence with what you said and
              what Sabi heard.
            </p>
          </div>
          <ol className="space-y-3">
            {reportQuestions.map((question, index) => (
              <li key={question} className="flex gap-3 text-sm leading-6">
                <span className="font-mono text-[#d9bb72]">{String(index + 1).padStart(2, "0")}</span>
                <span>{question}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="border border-[#d4c49e] bg-[#efe4ca] p-5 sm:p-7">
          <h2 className="font-serif text-3xl text-[#112b26]">Before you begin</h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-[#514e46]">
            <p>
              This round is for adults. Do not put a child on the phone. Every call is
              recorded and automatically transcribed so the team can inspect what
              happened.
            </p>
            <p>
              Do not share bank details or anything you would not want captured in a
              recording. You may stop testing at any time; message Naomi if you want
              your recordings removed.
            </p>
            <p>
              Do not test crisis or abuse phrases without arranging a monitored test
              with Naomi first, because those phrases trigger Sabi&apos;s safeguarding
              process.
            </p>
          </div>
        </section>

        <section className="grid gap-7 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6926]">
              Join the five-day test
            </p>
            <h2 className="mt-3 font-serif text-4xl text-[#112b26]">Tell us who to call.</h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-[#625f55]">
              Enter your name, Nigerian phone number and preferred call time. Your
              details stay private and are used only to organise Sabi&apos;s adult
              testing calls.
            </p>
          </div>
          <div className="border border-[#ded3bc] bg-white p-5 sm:p-7">
            <SignupForm />
          </div>
        </section>
      </main>
    </div>
  );
}
