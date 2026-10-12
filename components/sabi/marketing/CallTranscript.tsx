import { FIRST_CALL, NEXT_DAY_CALL, type CallLine } from "@/lib/sabi/content";

function Line({ line }: { line: CallLine }) {
  return (
    <div className={`sabi-call-line ${line.speaker === "Sabi" ? "is-sabi" : "is-child"}`}>
      <span className="sabi-mono text-[var(--sabi-meta)]">{line.time}</span>
      <span className="sabi-who font-semibold text-sm pt-px">{line.speaker === "Child" ? "Chidi" : "Sabi"}</span>
      <span>{line.text}</span>
    </div>
  );
}

export default function CallTranscript({ caption = true }: { caption?: boolean }) {
  return (
    <figure>
      <div className="sabi-call-log">
        <div className="sabi-call-log-head">
          <div className="flex items-center gap-3">
            <span className="sabi-live-dot" />
            <span className="font-semibold">Call 1 · Chidi</span>
          </div>
          <span className="sabi-mono text-xs text-white/60 hidden sm:inline">Subtraction · market change</span>
        </div>
        <div>
          {FIRST_CALL.map((line) => (
            <Line key={line.time} line={line} />
          ))}
        </div>
        <div className="sabi-call-divider">
          <span className="sabi-eyebrow">Next day · Call 2</span>
        </div>
        {NEXT_DAY_CALL.map((line) => (
          <Line key={line.time} line={line} />
        ))}
      </div>
      {caption && <figcaption className="sabi-source mt-6">An example first and second call, transcribed.</figcaption>}
    </figure>
  );
}
