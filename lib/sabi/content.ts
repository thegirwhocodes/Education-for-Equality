/**
 * Copy and data for the Sabi marketing pages. Kept apart from the components so
 * a stat or citation is edited in one place and every page that shows it agrees.
 */

export type Stat = { value: string; label: string; source: string };

export const PROBLEM_STATS: Stat[] = [
  { value: "7 in 10", label: "Nigerian 10-year-olds cannot read a single sentence.", source: "World Bank, 2022" },
  { value: "98M", label: "children are out of school in Sub-Saharan Africa.", source: "UNESCO, 2024" },
  {
    value: "16%",
    label: "of planned learning actually happens in school.",
    source: "Attendance × lesson completion × teacher presence",
  },
];

export const PHONE_FACTS = [
  { value: 70, label: "of Africans have a mobile phone" },
  { value: 95, label: "of Lagos households own one" },
  { value: 99, label: "2G network coverage" },
];

export const CALL_STEPS = [
  { title: "A child calls the number", body: "Any phone works, even a $5 feature phone. No app, no data, no account." },
  { title: "Sabi greets them by name", body: "New callers introduce themselves once. Returning callers are recognised instantly." },
  {
    title: "A lesson begins",
    body: "Taught at the child's actual level, using things they know: the market, Naira, everyday Lagos life.",
  },
  {
    title: "Five to seven minutes, one idea",
    body: "Short, focused calls. Harder when the child is ready, slower when they struggle.",
  },
  {
    title: "They call back tomorrow",
    body: "Sabi remembers their name, their level and their mistakes, and picks up where they left off.",
  },
];

export type CallLine = { time: string; speaker: "Sabi" | "Child"; text: string };

export const FIRST_CALL: CallLine[] = [
  { time: "00:03", speaker: "Sabi", text: "Hello! My name is Sabi. What is your name?" },
  { time: "00:07", speaker: "Child", text: "Chidi." },
  { time: "00:09", speaker: "Sabi", text: "Hi Chidi! Do you ever help your family at the market?" },
  { time: "00:14", speaker: "Child", text: "Yes, I sell groundnuts." },
  {
    time: "00:17",
    speaker: "Sabi",
    text: "Ah, you know business! If a customer gives you ₦500, and groundnuts cost ₦350, how much change do you give back?",
  },
  { time: "00:29", speaker: "Child", text: "150." },
  {
    time: "00:31",
    speaker: "Sabi",
    text: "You got it! You already know maths, Chidi — you just don't know you know it. Now let me show you how they write that in school…",
  },
];

export const NEXT_DAY_CALL: CallLine[] = [
  {
    time: "00:02",
    speaker: "Sabi",
    text: "Welcome back, Chidi! Yesterday you learned subtraction using market change. You got 4 out of 5 right. Today, let's try adding things together…",
  },
];

export const LESSON_ANATOMY = [
  { minute: "0:00", title: "Hello, by name", body: "Sabi greets the child and recalls what they did last time." },
  { minute: "0:30", title: "Warm-up", body: "A quick question on yesterday's idea, to check it stuck." },
  { minute: "1:30", title: "One new idea", body: "Framed in something familiar: change at the market, sharing groundnuts, reading a sign." },
  { minute: "3:00", title: "Practice", body: "A few questions that get harder if the child is flying, and slower if they're stuck." },
  { minute: "5:30", title: "Wrap-up", body: "What they learned today, and a reason to call back tomorrow." },
];

export const PIPELINE = [
  {
    verb: "Hears",
    body: "Speech recognition tuned for Nigerian English and Pidgin, on noisy 2G phone lines.",
  },
  {
    verb: "Thinks",
    body: "A curriculum-aware tutor that knows this child's level, history and last mistakes.",
  },
  {
    verb: "Checks",
    body: "A child-safety layer reviews what the child said and what Sabi is about to say, on every turn.",
  },
  {
    verb: "Speaks",
    body: "A warm Nigerian voice, streamed sentence by sentence so the child isn't left waiting.",
  },
];

export const EVIDENCE = [
  {
    stat: "9×",
    title: "Market maths beats abstract maths",
    body: "Children solved comparable subtraction tasks nine times more often when framed as a market sale than in school format (48.5% vs 5.4%).",
    source: "Weber, Bogler & Vollmer 2024 · North-West Nigeria",
    informs: "Why every lesson starts in the market.",
  },
  {
    stat: "1.5–2 yrs",
    title: "of learning in six weeks",
    body: "A World Bank RCT in Nigeria found AI tutoring delivered one and a half to two years of learning gains in just six weeks.",
    source: "World Bank 2024 · benefit–cost ratio 161–260",
    informs: "Why the tutor is AI, not a recording.",
  },
  {
    stat: "7% → 45%",
    title: "Reading, with no teacher in the room",
    body: "In Tanzania, children given only tablets went from 7% to 45% reading ability in fifteen months.",
    source: "Global Learning XPRIZE",
    informs: "Why a child can learn alone, at home.",
  },
  {
    stat: "$0.50–5",
    title: "per student, per year",
    body: "Ten to a hundred times cheaper than the alternatives. At $2 a student, reaching 100,000 children costs $200,000 a year.",
    source: "Self-hosted open-source stack",
    informs: "Why it can stay free for families.",
  },
];

/** Published phone and chat tutoring results the pilot will be read against. */
export const BENCHMARKS = [
  { name: "ConnectEd (J-PAL)", effect: "0.33 SD", cost: "~$12 / child", dose: "~3 hours over 8–9 weeks, by phone" },
  { name: "Rori (Rising Academies)", effect: "0.36 SD", cost: "~$5 / child / year", dose: "~32 hours over 8 months, by chat" },
  { name: "Teaching at the Right Level", effect: "19% → 79%", cost: "Varies", dose: "Readers before and after learning camps" },
];

export const PILOT_MEASURES = [
  {
    title: "Level movement",
    body: "The share of children who move up at least one reading or maths level from their first-call placement.",
  },
  {
    title: "Learning gain",
    body: "A short baseline and endline probe, so gains are reported as an effect size beside published programmes.",
  },
  {
    title: "Dosage",
    body: "Calls answered and completed, minutes of real lesson time, and how many children call back the next week.",
  },
  {
    title: "Cost per child",
    body: "Delivery cost per learner, and learning per dollar, so funders can compare like with like.",
  },
];

export const PILOT = {
  when: "Q4 2026",
  where: "Lagos",
  size: "100–500 students",
  detail: "in high-burden local government areas",
};

export const PRINCIPLES = [
  { title: "Any phone.", body: "Works on a $5 feature phone. No smartphone, no internet, no app download. Just a phone call." },
  {
    title: "It remembers.",
    body: "Sabi remembers every child: their name, their level, their mistakes. Each call picks up where the last one ended.",
  },
  {
    title: "Free. Always.",
    body: "Toll-free calls. No subscription, no paywall. Sponsored by Education for Equality, a 501(c)(3) nonprofit.",
  },
];

export const FAMILY_STEPS = [
  { title: "Text CALL", body: "Send the word CALL by SMS or WhatsApp. Sabi rings you back, and the call is free." },
  { title: "Sabi rings you", body: "Answer, and hand the phone to your child. Each lesson takes five to seven minutes." },
  { title: "Same time tomorrow", body: "Sabi remembers where your child stopped and carries on from there." },
];

export const SAFETY_POINTS = [
  {
    title: "A tutor, not a friend",
    body: "Sabi stays on reading and maths. It is built to teach, not to chat, and it steers back to the lesson.",
  },
  {
    title: "Checked on every turn",
    body: "A safety layer reviews what your child says and what Sabi is about to say, before a single word is spoken.",
  },
  {
    title: "A real person if it matters",
    body: "If a child says something that suggests they are in danger, it goes to a named safeguarding lead for review.",
  },
  {
    title: "Never asks for money",
    body: "Sabi will never ask for money, passwords or bank details. If anyone claiming to be Sabi does, it is not us.",
  },
  {
    title: "Your child's voice stays theirs",
    body: "Recordings are only used to improve Sabi if a parent or guardian gives separate permission.",
  },
  {
    title: "One phone, many children",
    body: "Brothers and sisters can share a phone. Sabi keeps a separate place for each child.",
  },
];

export const PARTNER_WAYS = [
  {
    who: "Schools & local governments",
    title: "Host a pilot cohort",
    body: "Bring Sabi to a group of children in your schools or LGA. Sabi brings the phone line, the lessons and a progress record for every child.",
    cta: "Talk about a pilot",
    subject: "Sabi pilot",
  },
  {
    who: "Funders & foundations",
    title: "Sponsor a cohort",
    body: "At around $2 a child a year, a small grant reaches a whole community. You get per-child evidence, not anecdotes.",
    cta: "Fund a cohort",
    subject: "Funding a Sabi cohort",
  },
  {
    who: "Telecoms",
    title: "Keep the line free",
    body: "Toll-free numbers and free callbacks are what keep Sabi free for families. Help us reach every network.",
    cta: "Partner on the line",
    subject: "Sabi telecoms partnership",
  },
  {
    who: "Researchers",
    title: "Measure it with us",
    body: "Every call produces structured, consented learning data. We want independent evaluation, including an RCT.",
    cta: "Propose a study",
    subject: "Sabi research collaboration",
  },
];

export const RECOGNITION = [
  { org: "MIT Sloan Africa Business Club", title: "2nd Place", detail: "MIT Africa Business Challenge 2026, $3,000 prize" },
  { org: "Wesleyan Patricelli Center", title: "Campus-backed", detail: "$1,200 Wesleyan grant plus PCE-sponsored MIT trip" },
  { org: "Technovation + Generation Unlimited", title: "Accelerator cohort", detail: "Selected for the 2026 AI Ventures Accelerator" },
  { org: "ElevenLabs", title: "Impact Program", detail: "Voice AI credits supporting Sabi demos and testing" },
];

export const PARTNER_LOGOS = [
  { name: "ElevenLabs Impact Program", href: "https://elevenlabs.io/impact-program", src: "/partners/elevenlabs.svg", width: 156, height: 44 },
  { name: "Wesleyan Patricelli Center", href: "https://www.wesleyan.edu/patricelli/", src: "/partners/wesleyan-pce.webp", width: 104, height: 96 },
  { name: "AI Ventures Accelerator", href: "https://www.technovation.org/ai-ventures-accelerator/", src: "/partners/ai-ventures.svg", width: 210, height: 70 },
  { name: "UNICEF Generation Unlimited", href: "https://www.unicef.org/generationunlimited/", src: "/partners/generation-unlimited.svg", width: 220, height: 62 },
  { name: "Technovation", href: "https://www.technovation.org/", src: "/partners/technovation.svg", width: 210, height: 70 },
  { name: "MIT Sloan Africa Business Club", href: "https://mit-africa.com/hackathon/", src: "/partners/mit-sloan-abc.svg", width: 210, height: 70 },
];

export const ADVISORS = [
  { name: "Hon. Folasade Adefisayo", role: "Former Lagos Commissioner of Education (2019–2023), who launched EKOEXCEL across 1,016 schools" },
  { name: "Dr. Sonia Ivie", role: "Director of Schools, EKOEXCEL" },
  { name: "Rhoda Odigboh", role: "CEO, Kizazi; former NewGlobe Regional Director" },
];

export const FOUNDER_STORY = [
  "Growing up in Lagos, Nigeria, I attended my secondary school on a scholarship and a discount based on my mother's salary as a teacher. Sometimes my family didn't have food to eat.",
  "On the way to school every day, I saw children my age hawking wares or fixing cars so their families could survive. I knew there was no difference between me and them. Without the grace of God and the extreme sacrifices of my parents, I would have been one of those kids.",
  "Education gave me a way out. Now I want to extend the same opportunity to every child who didn't get one. If we can teach people across Africa to solve problems around them, we can set off a chain reaction of transformation across the continent.",
];

export const FOUNDER_QUOTE =
  "We're not building another app that sits in an app store. We're building something a mother hears about at church, dials after dinner, and hands to her child for five minutes.";

export const DEMO_VIDEO_ID = "KUGy9RsFXzA";
