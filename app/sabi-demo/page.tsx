"use client";

import { useState, useRef, useEffect } from "react";

import { SabiMark } from "@/components/sabi/SabiLogo";
import "@/components/sabi/call/sabi-call.css";
import "@/components/sabi/call/sabi-chat.css";
import { normalizeMoneyForSpeech } from "@/lib/voice/normalize-money-for-speech";
import {
  looksLikeLessonWrapUpAssistantMessage,
  transcriptEligibleForLessonCheckpoint,
} from "@/lib/sabi/is-lesson-wrap-up-message";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Student {
  id: string;
  browser_id: string;
  name: string;
  current_level: string;
  total_sessions: number;
  total_correct: number;
  total_wrong: number;
  last_session_summary: string | null;
  created_at: string;
}

interface SessionSummary {
  summary: string;
  correct_count: number;
  wrong_count: number;
  current_level: string;
  total_sessions: number;
  total_correct: number;
  total_wrong: number;
}

// ─── Entry Screen ───────────────────────────────────────────────

function EntryScreen({
  student,
  nameInput,
  onNameChange,
  onStart,
  isLoading,
  sessions,
}: {
  student: Student | null;
  nameInput: string;
  onNameChange: (v: string) => void;
  onStart: () => void;
  isLoading: boolean;
  sessions: { summary: string; created_at: string }[];
}) {
  // Any row from the API = returning learner (browser_id match). total_sessions can be 0
  // if they never tapped "End Lesson" or session save failed — still show welcome + stats.
  const isReturning = !!student;
  const hasCompletedSessions = !!student && student.total_sessions > 0;
  const attempts = student ? student.total_correct + student.total_wrong : 0;
  const accuracy = student && attempts > 0 ? Math.round((student.total_correct / attempts) * 100) : 0;

  return (
    <section className="sabi-call-start">
      <div className="sabi-call-start-grid">
        <div className="sabi-call-intro">
          <p className="sabi-eyebrow">Chat with Sabi · text and voice</p>
          <h1 className="sabi-display sabi-call-start-title">
            One tutor, <span className="sabi-call-highlight">two channels.</span>
          </h1>
          <p className="sabi-call-start-lede">
            Type to Sabi the way a child would on a smartphone, or talk to her the way a child would on a phone call.
            Both channels share one memory of the learner.
          </p>
        </div>

        <ol className="sabi-call-checklist">
          <li>
            <span className="sabi-mono">01</span>Enter a name. Sabi greets the learner and starts a market-maths lesson.
          </li>
          <li>
            <span className="sabi-mono">02</span>Answer in the text panel, or tap the microphone in the voice panel.
          </li>
          <li>
            <span className="sabi-mono">03</span>End the lesson and come back: Sabi remembers where you stopped.
          </li>
        </ol>

        <div className="sabi-call-start-side">
          <div className="sabi-call-card">
            <div className="sabi-call-card-top">
              <SabiMark size={36} />
              <div>
                <p className="sabi-call-card-name">Sabi</p>
                <p className="sabi-mono sabi-call-card-meta">{isReturning ? "Remembers you" : "Lesson ready"}</p>
              </div>
              <span className="sabi-call-live" aria-hidden="true" />
            </div>

            <div className="sabi-call-card-body">
              {isReturning ? (
                <>
                  <h2 className="sabi-display sabi-call-card-title">Welcome back, {student.name}.</h2>
                  <p className="sabi-call-card-lede">
                    {hasCompletedSessions ? (
                      <>
                        You&apos;ve completed {student.total_sessions} saved lesson
                        {student.total_sessions !== 1 ? "s" : ""} so far.
                      </>
                    ) : (
                      <>No saved lessons yet. When you&apos;re done, tap End lesson so your progress shows here next time.</>
                    )}
                  </p>

                  {student.last_session_summary && (
                    <div className="sabi-chat-note">
                      <p className="sabi-eyebrow">Last time</p>
                      <p>{student.last_session_summary}</p>
                    </div>
                  )}

                  <dl className="sabi-chat-stats">
                    <div>
                      <dt>Lessons saved</dt>
                      <dd>{student.total_sessions}</dd>
                    </div>
                    <div>
                      <dt>Correct</dt>
                      <dd>{student.total_correct}</dd>
                    </div>
                    <div>
                      <dt>Accuracy</dt>
                      <dd>{accuracy}%</dd>
                    </div>
                  </dl>

                  {sessions.length > 0 && (
                    <div>
                      <p className="sabi-eyebrow">Session history</p>
                      <ul className="sabi-chat-history">
                        {sessions.map((s, i) => (
                          <li key={i}>{s.summary}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <label className="sabi-call-field">
                  <span>Your name</span>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => onNameChange(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && nameInput.trim() && onStart()}
                    placeholder="Amina"
                    autoComplete="given-name"
                    autoFocus
                  />
                </label>
              )}

              <button
                onClick={onStart}
                disabled={isLoading || (!student && !nameInput.trim())}
                className="sabi-btn-gold sabi-call-cta"
              >
                {isLoading ? "Loading…" : isReturning ? "Continue learning" : "Start lesson"}
              </button>

              {isReturning && (
                <button
                  onClick={() => {
                    localStorage.removeItem("sabi_browser_id");
                    window.location.reload();
                  }}
                  className="sabi-call-ghost"
                >
                  Not {student.name}? Start fresh
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── End Screen ─────────────────────────────────────────────────

const LEVEL_PROGRESS: Record<string, number> = { beginner: 33, intermediate: 66 };

function EndScreen({
  summary,
  onRestart,
}: {
  summary: SessionSummary;
  onRestart: () => void;
}) {
  const attempts = summary.total_correct + summary.total_wrong;
  const accuracy = attempts > 0 ? Math.round((summary.total_correct / attempts) * 100) : 0;
  const progress = LEVEL_PROGRESS[summary.current_level] ?? 100;

  return (
    <section className="sabi-call-start">
      <div className="sabi-chat-end">
        <p className="sabi-eyebrow">Lesson complete</p>
        <h1 className="sabi-display sabi-call-start-title">
          Well done<span className="sabi-call-highlight">.</span>
        </h1>
        <p className="sabi-call-start-lede">{summary.summary}</p>

        <div className="sabi-call-card mt-10">
          <div className="sabi-call-card-body">
            <p className="sabi-eyebrow">This lesson</p>
            <dl className="sabi-chat-stats sabi-chat-stats-2">
              <div>
                <dt>Correct</dt>
                <dd>{summary.correct_count}</dd>
              </div>
              <div>
                <dt>To practise</dt>
                <dd>{summary.wrong_count}</dd>
              </div>
            </dl>

            <p className="sabi-eyebrow mt-4">All time</p>
            <dl className="sabi-chat-stats">
              <div>
                <dt>Lessons</dt>
                <dd>{summary.total_sessions}</dd>
              </div>
              <div>
                <dt>Correct</dt>
                <dd>{summary.total_correct}</dd>
              </div>
              <div>
                <dt>Accuracy</dt>
                <dd>{accuracy}%</dd>
              </div>
            </dl>

            <div className="sabi-chat-level">
              <div className="sabi-chat-level-label">
                <span>Level: {summary.current_level}</span>
                <span className="sabi-mono">{progress}%</span>
              </div>
              <div
                className="sabi-chat-level-track"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Level progress"
              >
                <span style={{ width: `${progress}%` }} />
              </div>
            </div>

            <p className="sabi-chat-note sabi-chat-note-ink">
              On the real line, the child calls the same number tomorrow, and Sabi remembers everything from today.
            </p>

            <button onClick={onRestart} className="sabi-btn-gold sabi-call-cta">
              Start another lesson
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Chat Panel ─────────────────────────────────────────────────

function Bubbles({
  messages,
  isLoading,
  childLabel,
  scrollRef,
}: {
  messages: Message[];
  isLoading: boolean;
  childLabel: string;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={scrollRef} className="sabi-chat-thread" aria-live="polite">
      {messages.map((msg, i) => (
        <p key={i} className={msg.role === "user" ? "sabi-chat-bubble sabi-chat-bubble-child" : "sabi-chat-bubble"}>
          <span className="sabi-call-bubble-role">{msg.role === "user" ? childLabel : "Sabi"}</span>
          {msg.content}
        </p>
      ))}
      {isLoading && (
        <p className="sabi-chat-bubble sabi-chat-thinking">
          <span className="sabi-call-bubble-role">Sabi</span>
          <span className="sabi-call-dots" aria-label="Sabi is thinking">
            <i />
            <i />
            <i />
          </span>
        </p>
      )}
    </div>
  );
}

function PanelHead({ title, subtitle, tone }: { title: string; subtitle: string; tone: "ink" | "green" }) {
  return (
    <div className={`sabi-chat-panel-head sabi-chat-panel-head-${tone}`}>
      <p className="sabi-display">{title}</p>
      <p>{subtitle}</p>
    </div>
  );
}

function ChatPanel({
  title,
  subtitle,
  messages,
  onSend,
  inputValue,
  onInputChange,
  isLoading,
  inputRef,
}: {
  title: string;
  subtitle: string;
  messages: Message[];
  onSend: () => void;
  inputValue: string;
  onInputChange: (v: string) => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  return (
    <div className="sabi-chat-panel">
      <PanelHead title={title} subtitle={subtitle} tone="ink" />
      <Bubbles messages={messages} isLoading={isLoading} childLabel="You" scrollRef={scrollRef} />
      <div className="sabi-chat-compose">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !isLoading && onSend()}
          placeholder="Type your answer…"
          aria-label="Your answer"
          disabled={isLoading}
        />
        <button onClick={onSend} disabled={isLoading || !inputValue.trim()} className="sabi-btn-primary">
          Send
        </button>
      </div>
    </div>
  );
}

// ─── Voice Panel ────────────────────────────────────────────────

function VoicePanel({
  title,
  subtitle,
  messages,
  isLoading,
  isListening,
  isSpeaking,
  onStartListening,
  onStopListening,
  voiceSupported,
}: {
  title: string;
  subtitle: string;
  messages: Message[];
  onSend: (text: string) => void;
  isLoading: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  voiceSupported: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const status = isSpeaking
    ? "Sabi is speaking…"
    : isListening
      ? "Listening… speak now"
      : isLoading
        ? "Sabi is thinking…"
        : "Tap the microphone to talk to Sabi";

  return (
    <div className="sabi-chat-panel">
      <PanelHead title={title} subtitle={subtitle} tone="green" />
      <Bubbles messages={messages} isLoading={isLoading} childLabel="You (voice)" scrollRef={scrollRef} />
      <div className="sabi-chat-voice">
        {!voiceSupported ? (
          <p className="sabi-call-alert sabi-call-alert-warn">Voice isn&apos;t supported in this browser. Try Chrome.</p>
        ) : (
          <>
            <button
              onClick={isListening ? onStopListening : onStartListening}
              disabled={isLoading || isSpeaking}
              className={`sabi-chat-mic ${isListening ? "is-listening" : isSpeaking ? "is-speaking" : ""}`}
              aria-label={isListening ? "Stop listening" : "Start talking"}
            >
              {isSpeaking ? <SpeakerIcon /> : isListening ? <StopIcon /> : <MicIcon />}
            </button>
            <p className="sabi-chat-voice-status" role="status">
              {status}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Icons ──────────────────────────────────────────────────────

function MicIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}

function SpeakerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

// ─── Main Page ──────────────────────────────────────────────────

export default function SabiDemo() {
  // Student state
  const [student, setStudent] = useState<Student | null>(null);
  const [sessions, setSessions] = useState<
    { summary: string; created_at: string }[]
  >([]);
  const [nameInput, setNameInput] = useState("");
  const [studentLoading, setStudentLoading] = useState(true);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(
    null
  );
  const [endingSession, setEndingSession] = useState(false);
  const sessionStartTime = useRef<number>(0);

  /** Prevents duplicate /api/sabi/session POSTs within one demo sitting. */
  const sessionPersistedRef = useRef(false);
  /** Last JSON from session API — used when "End Lesson" runs after checkpoint. */
  const lastPersistedSessionPayloadRef = useRef<Partial<SessionSummary> | null>(null);

  /** Refs synced for merge + synchronous checkpoint saves (avoid stale closures). */
  const textMessagesRef = useRef<Message[]>([]);
  const voiceMessagesRef = useRef<Message[]>([]);
  const studentIdRef = useRef<string | undefined>(undefined);

  // Text chat state
  const [textMessages, setTextMessages] = useState<Message[]>([]);
  const [textInput, setTextInput] = useState("");
  const [textLoading, setTextLoading] = useState(false);
  const textInputRef = useRef<HTMLInputElement>(null);

  // Voice chat state
  const [voiceMessages, setVoiceMessages] = useState<Message[]>([]);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Check for returning student on mount
  useEffect(() => {
    const browserId = localStorage.getItem("sabi_browser_id");
    if (browserId) {
      loadStudent(browserId);
    } else {
      setStudentLoading(false);
    }
  }, []);

  // Check voice support (MediaRecorder for Groq Whisper pipeline)
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setVoiceSupported(false);
    }
  }, []);

  useEffect(() => {
    studentIdRef.current = student?.id;
  }, [student?.id]);
  useEffect(() => {
    textMessagesRef.current = textMessages;
  }, [textMessages]);
  useEffect(() => {
    voiceMessagesRef.current = voiceMessages;
  }, [voiceMessages]);

  const loadStudent = async (browserId: string) => {
    try {
      const res = await fetch(
        `/api/sabi/student?browser_id=${encodeURIComponent(browserId)}`
      );
      const data = await res.json();
      if (data.student) {
        setStudent(data.student);
        setSessions(data.sessions || []);
      }
    } catch (e) {
      console.error("Failed to load student:", e);
    }
    setStudentLoading(false);
  };

  async function persistLessonSession(
    showEndScreen: boolean,
    messagesOverride?: Message[]
  ) {
    const sid = studentIdRef.current;
    const text = textMessagesRef.current;
    const voice = voiceMessagesRef.current;
    const merged =
      messagesOverride ??
      (text.length >= voice.length ? [...text] : [...voice]);

    if (!sid || merged.length < 2) {
      if (
        showEndScreen &&
        sessionPersistedRef.current &&
        lastPersistedSessionPayloadRef.current
      ) {
        setSessionSummary(lastPersistedSessionPayloadRef.current as SessionSummary);
        setSessionEnded(true);
      }
      return;
    }

    if (sessionPersistedRef.current) {
      if (showEndScreen && lastPersistedSessionPayloadRef.current) {
        setSessionSummary(lastPersistedSessionPayloadRef.current as SessionSummary);
        setSessionEnded(true);
      }
      return;
    }

    if (showEndScreen) setEndingSession(true);
    try {
      const duration = Math.floor((Date.now() - sessionStartTime.current) / 1000);
      const res = await fetch("/api/sabi/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: sid,
          messages: merged,
          duration_seconds: duration,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "session save failed");
      }
      sessionPersistedRef.current = true;
      lastPersistedSessionPayloadRef.current = data as Partial<SessionSummary>;

      const browserId = localStorage.getItem("sabi_browser_id");
      if (browserId) loadStudent(browserId);

      if (showEndScreen) {
        setSessionSummary(data as SessionSummary);
        setSessionEnded(true);
      }
    } catch (e) {
      console.error("Failed to save session:", e);
      sessionPersistedRef.current = false;
    } finally {
      if (showEndScreen) setEndingSession(false);
    }
  }

  async function sendToSabi(
    messages: Message[],
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    speak: boolean | undefined,
    studentId: string | undefined,
    channel: "text" | "voice"
  ) {
    setLoading(true);
    try {
      const res = await fetch("/api/sabi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages,
          student_id: studentId ?? studentIdRef.current,
        }),
      });
      const data = await res.json();
      if (data.error) {
        console.error(data.error);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I had a problem. Please try again!",
          },
        ]);
      } else {
        const thread = [
          ...messages,
          { role: "assistant" as const, content: data.response as string },
        ];
        if (channel === "text") {
          textMessagesRef.current = thread;
        } else {
          voiceMessagesRef.current = thread;
        }

        const textLen = textMessagesRef.current.length;
        const voiceLen = voiceMessagesRef.current.length;
        const mergedSave =
          textLen >= voiceLen
            ? textMessagesRef.current
            : voiceMessagesRef.current;

        setMessages(thread);

        if (speak) void speakText(data.response as string);

        if (
          looksLikeLessonWrapUpAssistantMessage(String(data.response)) &&
          transcriptEligibleForLessonCheckpoint(mergedSave)
        ) {
          void persistLessonSession(false, [...mergedSave]);
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Connection error. Please try again!",
        },
      ]);
    }
    setLoading(false);
  }

  // Start session
  const startSession = async () => {
    setStudentLoading(true);

    let currentStudent = student;

    if (!currentStudent) {
      // Create new student
      const browserId = crypto.randomUUID();
      localStorage.setItem("sabi_browser_id", browserId);

      try {
        const res = await fetch("/api/sabi/student", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            browser_id: browserId,
            name: nameInput.trim(),
          }),
        });
        const data = await res.json();
        if (data.student) {
          currentStudent = data.student;
          setStudent(data.student);
        }
      } catch (e) {
        console.error("Failed to create student:", e);
        setStudentLoading(false);
        return;
      }
    }

    sessionPersistedRef.current = false;
    lastPersistedSessionPayloadRef.current = null;

    setStudentLoading(false);
    setSessionStarted(true);
    sessionStartTime.current = Date.now();

    // Initialize both chats
    sendToSabi(
      [],
      setTextMessages,
      setTextLoading,
      false,
      currentStudent?.id,
      "text"
    );
    sendToSabi(
      [],
      setVoiceMessages,
      setVoiceLoading,
      true,
      currentStudent?.id,
      "voice"
    );
  };

  // End session
  const endSession = async () => {
    textMessagesRef.current = textMessages;
    voiceMessagesRef.current = voiceMessages;
    await persistLessonSession(true);
  };

  // Text chat send
  const handleTextSend = () => {
    if (!textInput.trim() || textLoading) return;
    const newMsg = { role: "user" as const, content: textInput.trim() };
    const updated = [...textMessages, newMsg];
    textMessagesRef.current = updated;
    setTextMessages(updated);
    setTextInput("");
    sendToSabi(updated, setTextMessages, setTextLoading, false, undefined, "text");
  };

  // Play base64 audio (from voice-chat pipeline)
  const playAudioBase64 = (base64: string) => {
    setIsSpeaking(true);
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const blob = new Blob([bytes], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.onended = () => {
      setIsSpeaking(false);
      URL.revokeObjectURL(url);
    };
    audio.onerror = () => {
      setIsSpeaking(false);
      URL.revokeObjectURL(url);
    };
    audio.play().catch(() => setIsSpeaking(false));
  };

  // Voice: speak text via TTS API (used by text chat panel)
  const speakText = async (text: string) => {
    setIsSpeaking(true);
    try {
      const res = await fetch("/api/sabi/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: normalizeMoneyForSpeech(text) }),
      });
      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.onended = () => { setIsSpeaking(false); URL.revokeObjectURL(url); };
        audio.onerror = () => { setIsSpeaking(false); URL.revokeObjectURL(url); };
        await audio.play();
        return;
      }
    } catch (err) {
      console.warn("TTS failed:", err);
    }
    setIsSpeaking(false);
  };

  // Voice: record audio via MediaRecorder → send to Groq Whisper via /api/sabi/voice-chat
  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        // Stop all mic tracks
        stream.getTracks().forEach((t) => t.stop());

        const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType });
        if (audioBlob.size < 1000) {
          // Too small — probably no speech
          setIsListening(false);
          return;
        }

        // Send to Groq Whisper pipeline
        setVoiceLoading(true);
        setIsListening(false);

        try {
          const formData = new FormData();
          formData.append("audio", audioBlob, "recording.webm");
          formData.append("messages", JSON.stringify(voiceMessagesRef.current));
          if (student?.id) formData.append("student_id", student.id);

          const res = await fetch("/api/sabi/voice-chat", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();

          if (data.error) {
            console.error("Voice chat error:", data.error);
            setVoiceMessages((prev) => [
              ...prev,
              { role: "assistant", content: "Sorry, I had a problem. Please try again!" },
            ]);
          } else {
            const newMessages: Message[] = [];
            if (data.transcript) {
              newMessages.push({ role: "user", content: data.transcript });
            }
            if (data.response) {
              newMessages.push({ role: "assistant", content: data.response });
            }
            const mergedVoice = [...voiceMessagesRef.current, ...newMessages];
            voiceMessagesRef.current = mergedVoice;
            setVoiceMessages(mergedVoice);

            const textT = textMessagesRef.current;
            const mergedForSave =
              mergedVoice.length >= textT.length ? mergedVoice : textT;

            const reply =
              typeof data.response === "string" ? data.response : "";
            if (
              reply &&
              looksLikeLessonWrapUpAssistantMessage(reply) &&
              transcriptEligibleForLessonCheckpoint(mergedForSave)
            ) {
              void persistLessonSession(false, [...mergedForSave]);
            }

            // Play the audio response
            if (data.audio) {
              playAudioBase64(data.audio);
            }
          }
        } catch {
          setVoiceMessages((prev) => [
            ...prev,
            { role: "assistant", content: "Connection error. Please try again!" },
          ]);
        }
        setVoiceLoading(false);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsListening(true);
    } catch (err) {
      console.error("Mic access denied:", err);
      setVoiceSupported(false);
    }
  };

  const stopListening = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
  };

  const handleVoiceSend = (text: string) => {
    if (!text.trim() || voiceLoading) return;
    const newMsg = { role: "user" as const, content: text.trim() };
    const updated = [...voiceMessages, newMsg];
    voiceMessagesRef.current = updated;
    setVoiceMessages(updated);
    sendToSabi(updated, setVoiceMessages, setVoiceLoading, true, undefined, "voice");
  };

  // ─── Render ───────────────────────────────────────────────────

  // Loading state
  if (studentLoading && !sessionStarted) {
    return (
      <section className="sabi-call-start sabi-chat-loading" aria-busy="true">
        <span className="sabi-call-dots" aria-label="Loading">
          <i />
          <i />
          <i />
        </span>
      </section>
    );
  }

  // End screen
  if (sessionEnded && sessionSummary) {
    return (
      <EndScreen
        summary={sessionSummary}
        onRestart={() => {
          setSessionStarted(false);
          setSessionEnded(false);
          sessionPersistedRef.current = false;
          lastPersistedSessionPayloadRef.current = null;
          setSessionSummary(null);
          setTextMessages([]);
          setVoiceMessages([]);
          setTextInput("");
          // Reload student data
          const browserId = localStorage.getItem("sabi_browser_id");
          if (browserId) loadStudent(browserId);
        }}
      />
    );
  }

  // Entry screen
  if (!sessionStarted) {
    return (
      <EntryScreen
        student={student}
        nameInput={nameInput}
        onNameChange={setNameInput}
        onStart={startSession}
        isLoading={studentLoading}
        sessions={sessions}
      />
    );
  }

  // Chat screen
  return (
    <section className="sabi-chat">
      <div className="sabi-chat-inner">
        <header className="sabi-chat-bar">
          <div className="flex items-center gap-3">
            <SabiMark size={40} tone="yellow" />
            <div>
              <h1 className="sabi-display sabi-chat-bar-title">Market maths lesson</h1>
              <p className="sabi-mono sabi-chat-bar-meta">
                {student?.name ? student.name : "New student"}
                {student && student.total_sessions > 0 && <> · Session #{(student.total_sessions || 0) + 1}</>}
              </p>
            </div>
          </div>
          <button
            onClick={endSession}
            disabled={endingSession || textMessages.length < 2}
            className="sabi-btn-gold sabi-chat-end-btn"
          >
            {endingSession ? "Saving…" : "End lesson"}
          </button>
        </header>

        <p className="sabi-chat-banner">
          <strong>Two channels, same tutor.</strong> The text panel simulates a smartphone app. The voice panel
          simulates a phone call: tap the mic to talk. Both remember this learner across lessons. When Sabi wraps up
          naturally, progress saves automatically, and you can still tap End lesson.
        </p>

        <div className="sabi-chat-panels">
          <ChatPanel
            title="App channel"
            subtitle="Smartphone with internet · type to chat"
            messages={textMessages}
            onSend={handleTextSend}
            inputValue={textInput}
            onInputChange={setTextInput}
            isLoading={textLoading}
            inputRef={textInputRef}
          />
          <VoicePanel
            title="Voice channel"
            subtitle="Any phone, no internet · speak to learn"
            messages={voiceMessages}
            onSend={handleVoiceSend}
            isLoading={voiceLoading}
            isListening={isListening}
            isSpeaking={isSpeaking}
            onStartListening={startListening}
            onStopListening={stopListening}
            voiceSupported={voiceSupported}
          />
        </div>

        <aside className="sabi-chat-evidence">
          <p className="sabi-eyebrow">The evidence</p>
          <h2 className="sabi-display">Why market maths?</h2>
          <p>
            Weber, Bogler &amp; Vollmer&apos;s study of <strong>5,997 children in North-West Nigeria (2024)</strong>{" "}
            found that children solved comparable subtraction tasks <strong>9× more often</strong> in market framing
            than in formal school format (48.5% vs 5.4%). A separate Nature (2025) study found the same kind of
            transfer gap among working children in India.
          </p>
          <p>
            <strong>Persistent memory</strong> means Sabi remembers each child&apos;s name, level, and mistakes
            across lessons, like a real tutor. End this lesson and start another to see it in action.
          </p>
        </aside>
      </div>
    </section>
  );
}
