import { SabiMark } from "@/components/sabi/SabiLogo";
import "./sabi-call.css";

export type CallState = "idle" | "connecting" | "listening" | "processing" | "speaking" | "ready";

export interface CallMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ReturningStudent {
  name: string;
  total_sessions: number;
}

const PHONE_PATH =
  "M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z";

const HANG_UP_PATH =
  "M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08a.956.956 0 0 1-.29-.7c0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28a11.27 11.27 0 0 0-2.67-1.85.996.996 0 0 1-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z";

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={PHONE_PATH} />
    </svg>
  );
}

const BEFORE_YOU_CALL = [
  "Use Chrome on a laptop or an Android phone.",
  "Allow the microphone when your browser asks.",
  "Put it on speaker if a child is listening with you.",
];

function Transcript({ messages, title }: { messages: CallMessage[]; title: string }) {
  return (
    <div className="sabi-call-history">
      <p className="sabi-eyebrow">{title}</p>
      <div className="sabi-call-history-body">
        {messages.map((m, i) => (
          <p key={i} className={m.role === "user" ? "sabi-call-line sabi-call-line-child" : "sabi-call-line"}>
            <span className="sabi-call-line-role">{m.role === "user" ? "You" : "Sabi"}</span>
            {m.content}
          </p>
        ))}
      </div>
    </div>
  );
}

export function CallStartScreen({
  student,
  nameInput,
  onNameChange,
  onStart,
  onForget,
  voiceSupported,
  error,
  messages,
}: {
  student: ReturningStudent | null;
  nameInput: string;
  onNameChange: (value: string) => void;
  onStart: () => void;
  onForget: () => void;
  voiceSupported: boolean;
  error: string;
  messages: CallMessage[];
}) {
  return (
    <section className="sabi-call-start">
      <div className="sabi-call-start-grid">
        <div className="sabi-call-intro">
          <p className="sabi-eyebrow">Talk to Sabi · in your browser</p>
          <h1 className="sabi-display sabi-call-start-title">
            Say your name. <span className="sabi-call-highlight">Sabi picks up.</span>
          </h1>
          <p className="sabi-call-start-lede">
            This is the lesson a child hears on a phone call: a short market-maths scenario, one small idea at a
            time, played through your browser.
          </p>
        </div>

        <ol className="sabi-call-checklist">
          {BEFORE_YOU_CALL.map((item, i) => (
            <li key={item}>
              <span className="sabi-mono">{String(i + 1).padStart(2, "0")}</span>
              {item}
            </li>
          ))}
        </ol>

        <div className="sabi-call-start-side">
          {!voiceSupported && (
            <p className="sabi-call-alert sabi-call-alert-warn" role="alert">
              Voice isn&apos;t supported in this browser. Please open this page in Chrome.
            </p>
          )}

          <div className="sabi-call-card">
            <div className="sabi-call-card-top">
              <SabiMark size={36} />
              <div>
                <p className="sabi-call-card-name">Sabi</p>
                <p className="sabi-mono sabi-call-card-meta">{student ? "Remembers you" : "Lesson ready"}</p>
              </div>
              <span className="sabi-call-live" aria-hidden="true" />
            </div>

            <div className="sabi-call-card-body">
              {student ? (
                <>
                  <h2 className="sabi-display sabi-call-card-title">Welcome back, {student.name}.</h2>
                  <p className="sabi-call-card-lede">
                    {student.total_sessions} lesson{student.total_sessions !== 1 ? "s" : ""} saved on this device.
                    Sabi picks up where you left off.
                  </p>
                  <button onClick={onStart} disabled={!voiceSupported} className="sabi-btn-gold sabi-call-cta">
                    <PhoneIcon />
                    Continue with Sabi
                  </button>
                  <button onClick={onForget} className="sabi-call-ghost">
                    Not {student.name}? Start fresh
                  </button>
                </>
              ) : (
                <>
                  <label className="sabi-call-field">
                    <span>Your name</span>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => onNameChange(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && nameInput.trim() && onStart()}
                      placeholder="Amina"
                      autoComplete="given-name"
                    />
                  </label>
                  <button
                    onClick={onStart}
                    disabled={!nameInput.trim() || !voiceSupported}
                    className="sabi-btn-gold sabi-call-cta"
                  >
                    <PhoneIcon />
                    Call Sabi
                  </button>
                </>
              )}
            </div>
          </div>

          {error && (
            <p className="sabi-call-alert sabi-call-alert-error" role="alert">
              {error}
            </p>
          )}

          {messages.length > 0 && <Transcript messages={messages} title="Last conversation" />}
        </div>
      </div>
    </section>
  );
}

function OrbContent({ state }: { state: CallState }) {
  if (state === "listening") {
    return (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    );
  }
  if (state === "processing") {
    return (
      <span className="sabi-call-dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    );
  }
  return (
    <span className={`sabi-call-bars ${state === "speaking" ? "is-speaking" : ""}`} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

export function ActiveCallScreen({
  callState,
  status,
  time,
  messages,
  error,
  onOrbTap,
  onEnd,
}: {
  callState: CallState;
  status: string;
  time: string;
  messages: CallMessage[];
  error: string;
  onOrbTap: () => void;
  onEnd: () => void;
}) {
  return (
    <section className="sabi-call-live-screen">
      <header className="sabi-call-top">
        <p className="sabi-eyebrow">{callState === "connecting" ? "Connecting" : "In session"}</p>
        <p className="sabi-display sabi-call-top-name">Sabi</p>
        <p className="sabi-mono sabi-call-top-time">{time}</p>
      </header>

      <div className="sabi-call-centre">
        <button
          onClick={onOrbTap}
          disabled={callState !== "ready"}
          className={`sabi-call-orb is-${callState}`}
          aria-label={status}
        >
          <span className="sabi-call-orb-ring" aria-hidden="true" />
          <span className="sabi-call-orb-ring sabi-call-orb-ring-2" aria-hidden="true" />
          <span className="sabi-call-orb-core">
            <OrbContent state={callState} />
          </span>
        </button>
        <p className="sabi-call-status" role="status" aria-live="polite">
          {status}
        </p>
      </div>

      <div className="sabi-call-transcript">
        {messages.slice(-6).map((m, i) => (
          <p key={i} className={m.role === "user" ? "sabi-call-bubble sabi-call-bubble-child" : "sabi-call-bubble"}>
            <span className="sabi-call-bubble-role">{m.role === "user" ? "You" : "Sabi"}</span>
            {m.content}
          </p>
        ))}
      </div>

      {error && <p className="sabi-call-live-error" role="alert">{error}</p>}

      <div className="sabi-call-end">
        <button onClick={onEnd} className="sabi-call-end-btn" aria-label="End call">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d={HANG_UP_PATH} />
          </svg>
        </button>
        <span className="sabi-eyebrow">End call</span>
      </div>
    </section>
  );
}
