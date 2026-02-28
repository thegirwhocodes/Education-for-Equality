"use client";

import { useState, useRef, useEffect, useCallback } from "react";

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
  const isReturning = student && student.total_sessions > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--primary-darker)] via-[#0a6b5a] to-[#1a5c3a] flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Sabi
          </h1>
          <p className="text-lg text-white/70">
            &quot;To Know&quot; in Nigerian Pidgin
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          {isReturning ? (
            <>
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-[var(--secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👋</span>
                </div>
                <h2 className="text-2xl font-bold text-[var(--primary-darker)]">
                  Welcome back, {student.name}!
                </h2>
                <p className="text-gray-600 mt-2">
                  You&apos;ve completed {student.total_sessions} lesson
                  {student.total_sessions !== 1 ? "s" : ""} so far
                </p>
              </div>

              {/* Last session info */}
              {student.last_session_summary && (
                <div className="bg-[var(--secondary)] rounded-xl p-4 mb-6">
                  <p className="text-sm font-semibold text-[var(--primary-darker)] mb-1">
                    Last time:
                  </p>
                  <p className="text-sm text-gray-700">
                    {student.last_session_summary}
                  </p>
                </div>
              )}

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-[var(--primary-darker)]">
                    {student.total_sessions}
                  </p>
                  <p className="text-xs text-gray-500">Sessions</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {student.total_correct}
                  </p>
                  <p className="text-xs text-gray-500">Correct</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-[var(--primary-darker)]">
                    {student.total_correct + student.total_wrong > 0
                      ? Math.round(
                          (student.total_correct /
                            (student.total_correct + student.total_wrong)) *
                            100
                        )
                      : 0}
                    %
                  </p>
                  <p className="text-xs text-gray-500">Accuracy</p>
                </div>
              </div>

              {/* Session history */}
              {sessions.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Session History:
                  </p>
                  <div className="space-y-2">
                    {sessions.map((s, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <span className="text-green-500 mt-0.5">●</span>
                        <span>{s.summary}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-[var(--secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📞</span>
                </div>
                <h2 className="text-2xl font-bold text-[var(--primary-darker)]">
                  Try Sabi
                </h2>
                <p className="text-gray-600 mt-2">
                  An AI tutor that teaches maths through market scenarios.
                  <br />
                  Enter your name to start a lesson.
                </p>
              </div>

              <div className="mb-6">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => onNameChange(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && nameInput.trim() && onStart()
                  }
                  placeholder="What's your name?"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg text-center focus:outline-none focus:border-[var(--primary-dark)] focus:ring-1 focus:ring-[var(--primary-dark)]"
                  autoFocus
                />
              </div>
            </>
          )}

          <button
            onClick={onStart}
            disabled={isLoading || (!isReturning && !nameInput.trim())}
            className="w-full btn-primary rounded-xl px-6 py-4 text-lg font-semibold disabled:opacity-50"
          >
            {isLoading
              ? "Loading..."
              : isReturning
                ? "Continue Learning"
                : "Start Lesson"}
          </button>

          {isReturning && (
            <button
              onClick={() => {
                localStorage.removeItem("sabi_browser_id");
                window.location.reload();
              }}
              className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600"
            >
              Not {student.name}? Start fresh
            </button>
          )}
        </div>

        <p className="text-center text-xs text-white/50 mt-6">
          Powered by Education for Equality — Free, world-class education for
          every child.
        </p>
      </div>
    </div>
  );
}

// ─── End Screen ─────────────────────────────────────────────────

function EndScreen({
  summary,
  onRestart,
}: {
  summary: SessionSummary;
  onRestart: () => void;
}) {
  const accuracy =
    summary.total_correct + summary.total_wrong > 0
      ? Math.round(
          (summary.total_correct /
            (summary.total_correct + summary.total_wrong)) *
            100
        )
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--primary-darker)] via-[#0a6b5a] to-[#1a5c3a] flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🌟</span>
            </div>
            <h2 className="text-2xl font-bold text-[var(--primary-darker)]">
              Great job!
            </h2>
            <p className="text-gray-600 mt-2">{summary.summary}</p>
          </div>

          {/* This session */}
          <div className="bg-[var(--secondary)] rounded-xl p-4 mb-4">
            <p className="text-sm font-semibold text-[var(--primary-darker)] mb-3">
              This Session:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {summary.correct_count}
                </p>
                <p className="text-xs text-gray-600">Correct</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-500">
                  {summary.wrong_count}
                </p>
                <p className="text-xs text-gray-600">To practice</p>
              </div>
            </div>
          </div>

          {/* All-time stats */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              All-Time Progress:
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-[var(--primary-darker)]">
                  {summary.total_sessions}
                </p>
                <p className="text-xs text-gray-500">Total Sessions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {summary.total_correct}
                </p>
                <p className="text-xs text-gray-500">Total Correct</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[var(--primary-darker)]">
                  {accuracy}%
                </p>
                <p className="text-xs text-gray-500">Accuracy</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Level: {summary.current_level}</span>
                <span>
                  {summary.current_level === "beginner"
                    ? "33%"
                    : summary.current_level === "intermediate"
                      ? "66%"
                      : "100%"}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-[var(--primary-dark)] h-2.5 rounded-full transition-all"
                  style={{
                    width:
                      summary.current_level === "beginner"
                        ? "33%"
                        : summary.current_level === "intermediate"
                          ? "66%"
                          : "100%",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="bg-[var(--primary-darker)] text-white rounded-xl p-4 mb-6 text-center">
            <p className="text-sm">
              In the real Sabi, you&apos;d just call the same phone number
              tomorrow — and Sabi would remember everything from today.
            </p>
          </div>

          <button
            onClick={onRestart}
            className="w-full btn-primary rounded-xl px-6 py-4 text-lg font-semibold"
          >
            Start Another Lesson
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Chat Panel ─────────────────────────────────────────────────

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
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-[var(--primary-darker)] text-white px-5 py-4">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-sm opacity-80">{subtitle}</p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[var(--primary-dark)] text-white rounded-br-md"
                  : "bg-gray-100 text-gray-800 rounded-bl-md"
              }`}
            >
              {msg.role === "assistant" && (
                <span className="font-semibold text-[var(--primary-darker)] block mb-1">
                  Sabi
                </span>
              )}
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-500 px-4 py-2.5 rounded-2xl rounded-bl-md text-sm">
              <span className="font-semibold text-[var(--primary-darker)] block mb-1">
                Sabi
              </span>
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="border-t p-3">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isLoading && onSend()}
            placeholder="Type your answer..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--primary-dark)] focus:ring-1 focus:ring-[var(--primary-dark)]"
            disabled={isLoading}
          />
          <button
            onClick={onSend}
            disabled={isLoading || !inputValue.trim()}
            className="btn-primary rounded-xl px-5 py-2.5 text-sm disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Voice Panel ────────────────────────────────────────────────

function VoicePanel({
  title,
  subtitle,
  messages,
  onSend,
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

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-[#1a5c3a] text-white px-5 py-4">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-sm opacity-80">{subtitle}</p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#1a5c3a] text-white rounded-br-md"
                  : "bg-gray-100 text-gray-800 rounded-bl-md"
              }`}
            >
              {msg.role === "assistant" && (
                <span className="font-semibold text-[#1a5c3a] block mb-1">
                  Sabi
                </span>
              )}
              {msg.role === "user" && (
                <span className="font-semibold block mb-1 opacity-80">
                  You (voice)
                </span>
              )}
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-500 px-4 py-2.5 rounded-2xl rounded-bl-md text-sm">
              <span className="font-semibold text-[#1a5c3a] block mb-1">
                Sabi
              </span>
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="border-t p-4">
        {!voiceSupported ? (
          <p className="text-center text-sm text-red-500">
            Voice not supported in this browser. Try Chrome.
          </p>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="text-xs text-gray-500 text-center">
              {isSpeaking
                ? "Sabi is speaking..."
                : isListening
                  ? "Listening... speak now"
                  : isLoading
                    ? "Sabi is thinking..."
                    : "Tap the microphone to talk to Sabi"}
            </div>
            <button
              onClick={isListening ? onStopListening : onStartListening}
              disabled={isLoading || isSpeaking}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl transition-all disabled:opacity-40 ${
                isListening
                  ? "bg-red-500 animate-pulse scale-110"
                  : isSpeaking
                    ? "bg-yellow-500"
                    : "bg-[#1a5c3a] hover:bg-[#0f3d25] hover:scale-105"
              }`}
            >
              {isSpeaking ? (
                <SpeakerIcon />
              ) : isListening ? (
                <StopIcon />
              ) : (
                <MicIcon />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Icons ──────────────────────────────────────────────────────

function MicIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}

function SpeakerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Check for returning student on mount
  useEffect(() => {
    const browserId = localStorage.getItem("sabi_browser_id");
    if (browserId) {
      loadStudent(browserId);
    } else {
      setStudentLoading(false);
    }
  }, []);

  // Check voice support
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) setVoiceSupported(false);
  }, []);

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

  // Send message to Sabi API
  const sendToSabi = useCallback(
    async (
      messages: Message[],
      setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
      setLoading: React.Dispatch<React.SetStateAction<boolean>>,
      speak?: boolean,
      studentId?: string
    ) => {
      setLoading(true);
      try {
        const res = await fetch("/api/sabi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages,
            student_id: studentId || student?.id,
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
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: data.response },
          ]);
          if (speak) speakText(data.response);
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
    },
    [student]
  );

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

    setStudentLoading(false);
    setSessionStarted(true);
    sessionStartTime.current = Date.now();

    // Initialize both chats
    sendToSabi(
      [],
      setTextMessages,
      setTextLoading,
      false,
      currentStudent?.id
    );
    sendToSabi(
      [],
      setVoiceMessages,
      setVoiceLoading,
      true,
      currentStudent?.id
    );
  };

  // End session
  const endSession = async () => {
    setEndingSession(true);

    // Use whichever conversation has more messages
    const messages =
      textMessages.length >= voiceMessages.length
        ? textMessages
        : voiceMessages;

    const duration = Math.floor(
      (Date.now() - sessionStartTime.current) / 1000
    );

    try {
      const res = await fetch("/api/sabi/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: student?.id,
          messages,
          duration_seconds: duration,
        }),
      });
      const data = await res.json();
      setSessionSummary(data);
      setSessionEnded(true);
    } catch (e) {
      console.error("Failed to save session:", e);
    }

    setEndingSession(false);
  };

  // Text chat send
  const handleTextSend = () => {
    if (!textInput.trim() || textLoading) return;
    const newMsg: Message = { role: "user", content: textInput.trim() };
    const updated = [...textMessages, newMsg];
    setTextMessages(updated);
    setTextInput("");
    sendToSabi(updated, setTextMessages, setTextLoading);
  };

  // Voice: speak text using ElevenLabs Nigerian voice (fallback to Web Speech API)
  const speakText = async (text: string) => {
    setIsSpeaking(true);
    try {
      // Try ElevenLabs first (Nigerian accent)
      const res = await fetch("/api/sabi/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer();
        // Use AudioContext for reliable playback on mobile (avoids autoplay restrictions)
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
          const source = ctx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(ctx.destination);
          source.onended = () => {
            setIsSpeaking(false);
            ctx.close();
          };
          source.start(0);
          return;
        }
        // Fallback for browsers without AudioContext: use Audio element
        const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
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
        await audio.play();
        return;
      }
      console.warn("ElevenLabs TTS returned", res.status);
    } catch (err) {
      console.warn("ElevenLabs TTS failed, falling back to browser voice:", err);
    }

    // Fallback: Web Speech API
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.includes("Female") ||
            v.name.includes("Samantha") ||
            v.name.includes("Google"))
      );
      if (preferred) utterance.voice = preferred;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
    }
  };

  // Voice: start listening
  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-NG";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript.trim()) {
        const newMsg: Message = { role: "user", content: transcript.trim() };
        setVoiceMessages((prev) => {
          const updated = [...prev, newMsg];
          sendToSabi(updated, setVoiceMessages, setVoiceLoading, true);
          return updated;
        });
      }
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const handleVoiceSend = (text: string) => {
    if (!text.trim() || voiceLoading) return;
    const newMsg: Message = { role: "user", content: text.trim() };
    const updated = [...voiceMessages, newMsg];
    setVoiceMessages(updated);
    sendToSabi(updated, setVoiceMessages, setVoiceLoading, true);
  };

  // ─── Render ───────────────────────────────────────────────────

  // Loading state
  if (studentLoading && !sessionStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--primary-darker)] via-[#0a6b5a] to-[#1a5c3a] flex items-center justify-center">
        <div className="animate-pulse text-white text-lg">
          Loading...
        </div>
      </div>
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
    <div className="min-h-screen bg-gradient-to-br from-[var(--primary-darker)] via-[#0a6b5a] to-[#1a5c3a]">
      {/* Header with student info + end button */}
      <div className="bg-[var(--primary-darker)] text-white py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Sabi Demo</h1>
            <p className="text-sm opacity-80">
              {student?.name ? `Student: ${student.name}` : "New Student"} —
              Market Math Lesson
              {student && student.total_sessions > 0 && (
                <span className="ml-2">
                  (Session #{(student.total_sessions || 0) + 1})
                </span>
              )}
            </p>
          </div>
          <button
            onClick={endSession}
            disabled={endingSession || textMessages.length < 2}
            className="bg-white text-[var(--primary-darker)] px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-100 disabled:opacity-50 transition-colors"
          >
            {endingSession ? "Saving..." : "End Lesson"}
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-sm text-white/90">
          <strong>Two channels, same AI:</strong> Text chat (left) simulates a{" "}
          <strong>smartphone app</strong>. Voice chat (right) simulates a{" "}
          <strong>phone call</strong> — tap the mic to talk. Both channels
          remember this student across sessions.
        </div>
      </div>

      {/* Dual panels */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px]">
          <ChatPanel
            title="App Channel"
            subtitle="Smartphone with internet — type to chat"
            messages={textMessages}
            onSend={handleTextSend}
            inputValue={textInput}
            onInputChange={setTextInput}
            isLoading={textLoading}
            inputRef={textInputRef}
          />
          <VoicePanel
            title="Voice Channel"
            subtitle="Any phone, no internet — speak to learn"
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
      </div>

      {/* Research callout */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
          <h3 className="font-bold text-lg text-white mb-3">
            Why Market Math?
          </h3>
          <p className="text-sm text-white/80 leading-relaxed mb-3">
            Research from <strong>Nature (2025)</strong> and a study of{" "}
            <strong>5,997 children in Sokoto, Nigeria (2024)</strong> found that
            children who sell at markets solve the{" "}
            <em>exact same arithmetic</em>{" "}
            <strong>9x more often</strong> when framed as a market transaction
            vs. abstract math (48.5% vs 5.4%).
          </p>
          <p className="text-sm text-white/80 leading-relaxed">
            <strong>Persistent memory</strong> means Sabi remembers each
            child&apos;s name, level, and mistakes across sessions — just like a
            real tutor. End this lesson and start another to see it in action.
          </p>
        </div>
      </div>
    </div>
  );
}

// Type declarations for Web Speech API
/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
