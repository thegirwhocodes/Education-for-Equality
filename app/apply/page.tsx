'use client';

import React, { useState } from 'react';

const NOTION_JOB_SPEC_URL =
  'https://app.notion.com/p/Job-Description-Software-Engineering-Intern-Sabi-Immediate-Start-4152e312927f81de90dae8d12be08e1c';
const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfqXgUh_Ec4m1vptOJ5Al50x_Ctcb2vKNsxqultswNanMO21A/viewform';

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    classYear: '',
    email: '',
    major: '',
    githubUrl: '',
    technologies: [] as string[],
    bugStory: '',
    whySabi: '',
    creditPreference: 'yes',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleTechChange = (tech: string) => {
    setFormData((prev) => {
      const exists = prev.technologies.includes(tech);
      return {
        ...prev,
        technologies: exists
          ? prev.technologies.filter((t) => t !== tech)
          : [...prev.technologies, tech],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Could not submit application automatically.');
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#ECECEC] antialiased selection:bg-[#CBA868]/30">
      {/* Top Brand Strip */}
      <header className="border-b border-[#1A1A1A] bg-[#0A0A0A]/90 sticky top-0 z-50 backdrop-blur px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Official Sabi Handset Voice Logo Mark */}
            <a href="https://sabi.eduforequality.org" className="flex items-center gap-2.5 hover:opacity-90 transition">
              <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true" className="shrink-0 rounded-xl shadow-md">
                <rect width="40" height="40" rx="11" fill="#101413" stroke="#2D3734" strokeWidth="1.5" />
                <rect x="10" y="15" width="4.5" height="10" rx="2.25" fill="#F8C544" />
                <rect x="17.75" y="9" width="4.5" height="22" rx="2.25" fill="#F8C544" />
                <rect x="25.5" y="13" width="4.5" height="14" rx="2.25" fill="#F8C544" />
              </svg>
              <span className="font-extrabold text-[28px] tracking-tight text-white lowercase" style={{ letterSpacing: '-0.04em', lineHeight: 1 }}>sabi</span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={NOTION_JOB_SPEC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#2B2B2B] bg-[#141414] hover:bg-[#1F1F1F] text-sm font-medium text-[#D4D4D4] hover:text-white transition"
            >
              <span>📄</span> Notion Job Spec ↗
            </a>
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212] border border-[#222] text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[#888]">Toll-Free Telephony:</span>
              <span className="text-white font-mono text-[12px]">+234 201 700 1459</span>
            </div>
            <a
              href="#apply"
              className="px-4 py-2 rounded-lg bg-[#CBA868] text-black font-semibold text-sm hover:bg-[#D8B97C] transition shadow-md shadow-[#CBA868]/20"
            >
              Apply Now
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-12">
        {/* Corporate Institutional Banner */}
        <div
          className="relative rounded-3xl overflow-hidden border border-[#222] shadow-2xl h-48 sm:h-60 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(7,7,7,0.15) 0%, rgba(7,7,7,0.95) 100%), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80')",
          }}
        >
          <div className="absolute bottom-6 left-6 sm:left-8 right-6 flex items-center justify-between">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#111]/85 backdrop-blur border border-[#333] text-sm text-[#DDD]">
              <span className="text-base">🏛️</span>
              <span className="font-semibold text-white tracking-wide">Education for Equality Inc.</span>
              <span className="text-[#666]">·</span>
              <span className="text-[#CBA868]">Software Engineering Internship</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="space-y-4 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-serif leading-tight">
            Sabi / Education for Equality — SWE Intern Application (Fall 2026 – Spring 2027)
          </h1>
          <h2 className="text-xl sm:text-2xl text-[#CBA868] font-medium flex items-center gap-2">
            <span className="text-2xl">🏛️</span>
            <span>Software Engineering Intern (Voice AI &amp; Distributed Telephony)</span>
          </h2>

          {/* Snapshot Specs */}
          <div className="p-6 rounded-2xl bg-[#0E0E0E] border border-[#1E1E1E] space-y-2.5 text-[15.5px] text-[#CCC]">
            <p><strong>Organization:</strong> Education for Equality / Sabi (Social Impact EdTech)</p>
            <p><strong>Location:</strong> Remote / Middletown, CT (Hybrid flexibility)</p>
            <p><strong>Hours:</strong> 5 – 10 hours/week (Fall 2026 – Spring 2027) with potential Summer 2027 full-time track</p>
            <p><strong>Compensation:</strong> Paid Stipend / Course Credit Available via Wesleyan CSPL 493 (0.25 credit)</p>
          </div>
        </section>

        {/* About Sabi & Education for Equality */}
        <section className="p-7 rounded-2xl bg-[#0E0E0E] border border-[#1E1E1E] space-y-4 shadow-xl">
          <h2 className="font-bold text-white uppercase tracking-wider text-[13px] text-[#999]">About Sabi &amp; Education for Equality:</h2>
          <p className="text-[15.5px] text-[#A6A6A6] leading-relaxed">
            Education for Equality (E4E) is a social venture founded at Wesleyan University (backed by the Patricelli Center New Venture Award and the MIT Africa Business Challenge). We are solving foundational learning poverty for 33 million children across Sub-Saharan Africa who lack smartphones and internet access.
          </p>
          <p className="text-[15.5px] text-[#A6A6A6] leading-relaxed">
            Our core product, Sabi, is a voice-first AI tutor that children talk to over standard, toll-free 2G phone calls (<strong>+234 201 700 1459</strong>). Sabi conducts interactive, adaptive math and reading lessons using localized accents and pedagogies.
          </p>
        </section>

        {/* What You’ll Work On */}
        <section className="p-7 rounded-2xl bg-[#0E0E0E] border border-[#1E1E1E] space-y-5 shadow-xl">
          <h2 className="font-bold text-white uppercase tracking-wider text-[13px] text-[#999]">What You’ll Work On:</h2>
          <ul className="space-y-3.5 text-[15.5px] text-[#CCC]">
            <li className="flex items-start gap-2.5">
              <span className="text-[#CBA868] font-bold mt-0.5">●</span>
              <span><strong>Realtime Voice Pipeline:</strong> Build and optimize WebSockets and bidirectional audio streaming using Google Gemini Live (<code>gemini-flash-live-preview</code>), Whisper, and TTS engines under high-latency network conditions.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#CBA868] font-bold mt-0.5">●</span>
              <span><strong>Telephony Infrastructure:</strong> Integrate Africa&apos;s Talking SIP trunks with Asterisk/FreePBX Linux servers hosted in South Africa to ensure 99.5% call reliability over 2G/3G telco networks.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#CBA868] font-bold mt-0.5">●</span>
              <span><strong>Data &amp; Learning Analytics:</strong> Build automated progress tracking, session scoring, and student mastery pipelines in Python, FastAPI, and Supabase (PostgreSQL).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#CBA868] font-bold mt-0.5">●</span>
              <span><strong>AI Safeguarding:</strong> Implement real-time latency monitoring, guardrails, and automated emergency escalation logging.</span>
            </li>
          </ul>
        </section>

        {/* What We’re Looking For & Bonus Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="p-7 rounded-2xl bg-[#0E0E0E] border border-[#1E1E1E] space-y-4 shadow-xl">
            <h2 className="font-bold text-white uppercase tracking-wider text-[13px] text-[#999]">What We’re Looking For:</h2>
            <ul className="space-y-3 text-[14.5px] text-[#CCC]">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span>Current Wesleyan student (majoring or interested in Computer Science, Data Analysis, or related technical fields).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span>Proficiency in Python and familiarity with backend frameworks (FastAPI, Flask) or JavaScript/Node.js.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span>Familiarity with REST APIs, WebSockets, or relational databases (PostgreSQL/Supabase).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span>A builder&apos;s mindset: you love testing your code, shipping real features to production, and measuring real-world impact.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span>Excitement for voice AI, telephony, and making frontier AI accessible to underserved global communities.</span>
              </li>
            </ul>
          </section>

          <section className="p-7 rounded-2xl bg-[#0E0E0E] border border-[#1E1E1E] space-y-4 shadow-xl">
            <h2 className="font-bold text-white uppercase tracking-wider text-[13px] text-[#999]">Bonus Points (Not Required):</h2>
            <ul className="space-y-3 text-[14.5px] text-[#CCC]">
              <li className="flex items-start gap-2">
                <span className="text-[#CBA868] font-bold mt-0.5">+</span>
                <span>Experience with Linux server administration (Docker, Ubuntu).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#CBA868] font-bold mt-0.5">+</span>
                <span>Exposure to telecom/VoIP concepts (SIP, RTP, Asterisk) or audio streaming.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#CBA868] font-bold mt-0.5">+</span>
                <span>Personal or cultural connection to the African educational landscape or West African dialects.</span>
              </li>
            </ul>
          </section>
        </div>

        {/* The Application Form */}
        <section id="apply" className="p-8 sm:p-10 rounded-3xl bg-[#0C0C0C] border border-[#222] shadow-2xl relative">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1A1A1A] pb-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif">Submit Your Application</h2>
                <p className="text-sm text-[#8E8E8E] mt-1">Takes 3 minutes. Applications reviewed on a rolling basis.</p>
              </div>
              <a
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#CBA868] hover:underline flex items-center gap-1 self-start sm:self-auto font-medium"
              >
                Prefer Google Forms? Click here ↗
              </a>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6 text-[15.5px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold uppercase tracking-wider text-[#A0A0A0] mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maya Chen"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-[#262626] text-white focus:outline-none focus:border-[#CBA868] text-base transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold uppercase tracking-wider text-[#A0A0A0] mb-2">
                      Graduation Class Year *
                    </label>
                    <select
                      required
                      value={formData.classYear}
                      onChange={(e) => setFormData({ ...formData, classYear: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-[#262626] text-white focus:outline-none focus:border-[#CBA868] text-base cursor-pointer transition"
                    >
                      <option value="" disabled>Select class year</option>
                      <option value="2025">Class of 2025</option>
                      <option value="2026">Class of 2026</option>
                      <option value="2027">Class of 2027</option>
                      <option value="2028">Class of 2028</option>
                      <option value="Grad">Graduate Student</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold uppercase tracking-wider text-[#A0A0A0] mb-2">
                      Wesleyan Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@wesleyan.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-[#262626] text-white focus:outline-none focus:border-[#CBA868] text-base transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold uppercase tracking-wider text-[#A0A0A0] mb-2">
                      Major(s) / Minor(s) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Computer Science &amp; Math"
                      value={formData.major}
                      onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-[#262626] text-white focus:outline-none focus:border-[#CBA868] text-base transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold uppercase tracking-wider text-[#A0A0A0] mb-2">
                    GitHub Profile or Project Link *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://github.com/your-username"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-[#262626] text-white focus:outline-none focus:border-[#CBA868] text-base transition"
                  />
                  <span className="text-[11px] text-[#666] mt-1 block">Link a repo, personal site, or PR where we can see real code you wrote.</span>
                </div>

                <div>
                  <label className="block text-sm font-semibold uppercase tracking-wider text-[#A0A0A0] mb-2">
                    What technologies have you worked with?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-sm text-[#CCC]">
                    {['Python', 'FastAPI/Flask', 'Supabase/SQL', 'WebSockets', 'AI-APIs', 'Docker/Linux'].map((tech) => (
                      <label key={tech} className="flex items-center gap-2 p-2 rounded-lg bg-[#141414] border border-[#222] cursor-pointer hover:border-[#333]">
                        <input
                          type="checkbox"
                          checked={formData.technologies.includes(tech)}
                          onChange={() => handleTechChange(tech)}
                          className="accent-[#CBA868]"
                        />
                        <span>{tech}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold uppercase tracking-wider text-[#A0A0A0] mb-2">
                    Why do you want to work for Sabi? What excites you about providing educational access to children? *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what draws you to our mission and what excites you about building voice AI for children who lack internet access."
                    value={formData.whySabi}
                    onChange={(e) => setFormData({ ...formData, whySabi: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-[#262626] text-white focus:outline-none focus:border-[#CBA868] text-base leading-relaxed resize-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold uppercase tracking-wider text-[#A0A0A0] mb-2">
                    The Bug Hunt: What&apos;s the nastiest technical bug you&apos;ve ever had to hunt down and fix? *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what broke, how you investigated it, and how you fixed it. We care about how you diagnose problems!"
                    value={formData.bugStory}
                    onChange={(e) => setFormData({ ...formData, bugStory: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-[#262626] text-white focus:outline-none focus:border-[#CBA868] text-base leading-relaxed resize-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold uppercase tracking-wider text-[#A0A0A0] mb-2">
                    Wesleyan Academic Credit (CSPL 493)
                  </label>
                  <select
                    value={formData.creditPreference}
                    onChange={(e) => setFormData({ ...formData, creditPreference: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-[#262626] text-white focus:outline-none focus:border-[#CBA868] text-base cursor-pointer transition"
                  >
                    <option value="yes">Yes, I want to receive 0.25 academic credit via CSPL 493</option>
                    <option value="no">No, participating for practical experience and project portfolio</option>
                    <option value="undecided">Undecided / need more information</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#CBA868] to-[#9E7734] hover:opacity-95 text-black font-bold text-base tracking-wide shadow-lg shadow-[#CBA868]/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
                >
                  <span>{isSubmitting ? 'Submitting to Pipeline...' : 'Submit Application'}</span>
                  <span>➔</span>
                </button>
              </form>
            ) : (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-white">Application Received!</h3>
                <p className="text-xs text-[#AAA] max-w-md mx-auto leading-relaxed">
                  Thank you for applying to Sabi. Naomi Ivie (&apos;27) will review your GitHub and technical background. Selected candidates will receive an invitation for a 20-minute chat in Exley / Patricelli Center.
                </p>
                <div className="pt-2">
                  <span className="text-[11px] text-emerald-400/80 font-mono">
                    ✓ Logged directly to Sabi Notion Candidate Pipeline
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-[#666] pt-8 pb-12 border-t border-[#161616] space-y-2">
          <p>© 2026 Education for Equality Inc. (501c3) · All rights reserved.</p>
          <p>
            Submit resume via Handshake or email{' '}
            <a href="mailto:naomi@eduforequality.org" className="text-[#CBA868] hover:underline">
              naomi@eduforequality.org
            </a>{' '}
            with subject line: <code className="text-gray-300">SWE Intern Application — [Your Name]</code>
          </p>
        </footer>
      </main>
    </div>
  );
}
