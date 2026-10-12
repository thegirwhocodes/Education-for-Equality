import { CALL_STEPS, EVIDENCE, PHONE_FACTS, PRINCIPLES, PROBLEM_STATS } from "@/lib/sabi/content";

/** One headline stat and two supporting ones, separated by heavy rules. */
export function ProblemStats() {
  const [lead, ...rest] = PROBLEM_STATS;
  return (
    <div className="grid md:grid-cols-12 gap-10 md:gap-8">
      <div className="md:col-span-6 sabi-rule-top pt-6">
        <p className="sabi-big-stat text-[6.5rem] md:text-[10rem]">{lead.value}</p>
        <p className="mt-5 text-lg max-w-sm">{lead.label}</p>
        <p className="sabi-source mt-3">{lead.source}</p>
      </div>
      {rest.map((s) => (
        <div key={s.value} className="md:col-span-3 sabi-rule-top pt-6">
          <p className="sabi-big-stat text-6xl md:text-7xl">{s.value}</p>
          <p className="mt-5 text-base">{s.label}</p>
          <p className="sabi-source mt-3">{s.source}</p>
        </div>
      ))}
    </div>
  );
}

/** Horizontal bars for phone ownership and coverage. Expects a dark (green/ink) section. */
export function PhoneCoverage() {
  return (
    <div className="flex flex-col gap-9">
      {PHONE_FACTS.map((f) => (
        <div key={f.label}>
          <div className="flex items-baseline justify-between gap-4 mb-3">
            <span className="sabi-big-stat !text-white text-5xl md:text-6xl">{f.value}%</span>
            <span className="text-white/75 text-right">{f.label}</span>
          </div>
          <div
            className="sabi-bar-track"
            role="meter"
            aria-valuenow={f.value}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={f.label}
          >
            <div className="sabi-bar-fill" style={{ width: `${f.value}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EvidenceList({ showInforms = false, limit }: { showInforms?: boolean; limit?: number }) {
  const rows = typeof limit === "number" ? EVIDENCE.slice(0, limit) : EVIDENCE;
  return (
    <div>
      {rows.map((e) => (
        <div key={e.stat} className="sabi-evidence-row">
          <p className="sabi-display text-4xl md:text-5xl">
            <span className="sabi-highlight">{e.stat}</span>
            <span className="block mt-3 text-xl md:text-2xl !font-semibold !tracking-tight">{e.title}</span>
          </p>
          <div>
            <p className="text-base leading-relaxed text-[var(--sabi-ink-soft)]">{e.body}</p>
            {showInforms && (
              <p className="mt-3 text-sm font-semibold text-[var(--sabi-green-bright)]">→ {e.informs}</p>
            )}
          </div>
          <p className="sabi-source">{e.source}</p>
        </div>
      ))}
    </div>
  );
}

export function NumberedSteps({ steps = CALL_STEPS }: { steps?: { title: string; body: string }[] }) {
  return (
    <ol className="sabi-steps">
      {steps.map((s, i) => (
        <li key={s.title}>
          <span className="sabi-step-index">{String(i + 1).padStart(2, "0")}</span>
          <div>
            <h3 className="sabi-display text-xl !font-semibold !tracking-tight">{s.title}</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--sabi-muted)]">{s.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Principles({ items = PRINCIPLES }: { items?: { title: string; body: string }[] }) {
  return (
    <div className="grid md:grid-cols-3 gap-10 md:gap-8">
      {items.map((p) => (
        <div key={p.title} className="sabi-principle">
          <h3 className="sabi-principle-title">{p.title}</h3>
          <p className="mt-4 text-base leading-relaxed text-[var(--sabi-ink-soft)] max-w-sm">{p.body}</p>
        </div>
      ))}
    </div>
  );
}
