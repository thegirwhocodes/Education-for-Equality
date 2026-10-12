"use client";

import { useState, useRef, useEffect } from "react";

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

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative"
      style={{
        background:
          'radial-gradient(1200px 500px at 85% -10%, rgba(203,168,104,0.14), transparent 60%), radial-gradient(900px 480px at 12% 110%, rgba(154,117,54,0.08), transparent 65%), #f7f2e7',
        fontFamily: "'Lexend', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Arial, sans-serif",
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Lexend:wght@300;400;500;600;700&display=swap"
      />
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/sabi-spark.svg"
            alt=""
            width={54}
            height={58}
            style={{ margin: '0 auto 12px', filter: 'drop-shadow(0 0 16px rgba(203,168,104,0.4))' }}
          />
          <h1
            className="mb-1"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '36px',
              fontWeight: 600,
              color: '#201a13',
              lineHeight: 1,
              letterSpacing: '0.01em',
            }}
          >
            Sabi
          </h1>
          <p style={{ fontSize: '10.5px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#857a68', marginTop: '8px' }}>
            &quot;To know&quot; in Nigerian Pidgin
          </p>
        </div>

        <div
          className="p-8"
          style={{
            background: '#fffdf8',
            border: '1px solid #e8dfc9',
            borderRadius: '18px',
            boxShadow: '0 24px 60px rgba(45,36,20,0.1), 0 6px 22px rgba(45,36,20,0.06)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #cba868 0%, #e2c88e 45%, rgba(226,200,142,0) 100%)',
            }}
          />
          {isReturning ? (
            <>
              <div className="text-center mb-6">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: '#f4ead4', border: '1px solid #e0cd9f' }}
                >
                  <span className="text-3xl">👋</span>
                </div>
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '26px',
                    fontWeight: 600,
                    color: '#201a13',
                    margin: 0,
                    lineHeight: 1.15,
                  }}
                >
                  Welcome back, {student.name}!
                </h2>
                <p className="text-gray-600 mt-2">
                  {hasCompletedSessions ? (
                    <>
                      You&apos;ve completed {student.total_sessions} saved lesson
                      {student.total_sessions !== 1 ? "s" : ""} so far
                    </>
                  ) : (
                    <>
                      No saved lessons yet — when you&apos;re done, tap{" "}
                      <strong className="text-[var(--primary-darker)]">End Lesson</strong>{" "}
                      so your progress shows here next time.
                    </>
                  )}
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
                  <p className="text-xs text-gray-500">Lessons saved</p>
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
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: '#f4ead4', border: '1px solid #e0cd9f' }}
                >
                  <span className="text-3xl">📞</span>
                </div>
                <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#9a7536', margin: '0 0 8px' }}>
                  Start a lesson
                </p>
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '30px',
                    fontWeight: 600,
                    color: '#201a13',
                    margin: 0,
                    lineHeight: 1.15,
                  }}
                >
                  Try Sabi
                </h2>
                <p style={{ color: '#4c4438', marginTop: '12px', fontSize: '14.5px', lineHeight: 1.6 }}>
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
                  className="w-full text-lg text-center"
                  style={{
                    border: '1px solid #d9cdaf',
                    borderRadius: '12px',
                    background: '#ffffff',
                    color: '#201a13',
                    padding: '14px 16px',
                    fontFamily: 'inherit',
                    fontWeight: 300,
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#cba868';
                    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(203,168,104,0.18)';
                    e.currentTarget.style.background = '#fffdf8';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d9cdaf';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.background = '#ffffff';
                  }}
                  autoFocus
                />
              </div>
            </>
          )}

          <button
            onClick={onStart}
            disabled={isLoading || (!student && !nameInput.trim())}
            className="w-full text-lg"
            style={{
              background: '#1b1610',
              color: '#f6efe0',
              border: '1px solid #1b1610',
              borderRadius: '12px',
              padding: '15px 22px',
              fontFamily: 'inherit',
              fontSize: '15px',
              fontWeight: 500,
              letterSpacing: '0.01em',
              cursor: isLoading || (!student && !nameInput.trim()) ? 'not-allowed' : 'pointer',
              opacity: isLoading || (!student && !nameInput.trim()) ? 0.55 : 1,
              transition: 'background 140ms ease, box-shadow 140ms ease',
            }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.background = '#33291c';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(32,26,19,0.24)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#1b1610';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {isLoading
              ? "Loading…"
              : isReturning
                ? "Continue learning"
                : "Start lesson"}
          </button>

          {isReturning && (
            <button
              onClick={() => {
                localStorage.removeItem("sabi_browser_id");
                window.location.reload();
              }}
              className="w-full mt-3 text-sm"
              style={{ background: 'transparent', border: 0, color: '#9a7536', padding: '8px', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Not {student.name}? Start fresh
            </button>
          )}
        </div>

        <p className="text-center mt-6" style={{ fontSize: '11.5px', color: '#a09482', letterSpacing: '0.02em' }}>
          Sabi is a voice AI tutor built by Education for Equality to reach
          Nigeria&apos;s 20 million out-of-school children.
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
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          'radial-gradient(1200px 500px at 85% -10%, rgba(203,168,104,0.14), transparent 60%), radial-gradient(900px 480px at 12% 110%, rgba(154,117,54,0.08), transparent 65%), #f7f2e7',
        fontFamily: "'Lexend', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Arial, sans-serif",
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Lexend:wght@300;400;500;600;700&display=swap"
      />
      <div className="max-w-lg w-full">
        <div
          className="p-8"
          style={{
            background: '#fffdf8',
            border: '1px solid #e8dfc9',
            borderRadius: '18px',
            boxShadow: '0 24px 60px rgba(45,36,20,0.1), 0 6px 22px rgba(45,36,20,0.06)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #cba868 0%, #e2c88e 45%, rgba(226,200,142,0) 100%)',
            }}
          />
          <div className="text-center mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: '#f4ead4', border: '1px solid #e0cd9f' }}
            >
              <span className="text-3xl">🌟</span>
            </div>
            <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#9a7536', margin: '0 0 8px' }}>
              Lesson complete
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '30px',
                fontWeight: 600,
                color: '#201a13',
                margin: 0,
                lineHeight: 1.15,
              }}
            >
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
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            'radial-gradient(1200px 500px at 85% -10%, rgba(203,168,104,0.14), transparent 60%), #f7f2e7',
          fontFamily: "'Lexend', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Arial, sans-serif",
        }}
      >
        <div
          className="animate-pulse text-lg"
          style={{ color: '#9a7536', fontWeight: 500, letterSpacing: '0.05em' }}
        >
          Loading…
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
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(180deg, #1b1610 0%, #221b12 60%, #2a2318 100%)',
        color: '#f1e6cd',
        fontFamily: "'Lexend', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Arial, sans-serif",
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Lexend:wght@300;400;500;600;700&display=swap"
      />
      {/* Header with student info + end button */}
      <div
        className="py-4 px-4"
        style={{
          background: 'linear-gradient(180deg, #1b1610 0%, #221b12 100%)',
          borderBottom: '1px solid rgba(216,205,184,0.14)',
          boxShadow: 'inset 0 -1px 0 rgba(203,168,104,0.14)',
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/sabi-spark.svg"
              alt=""
              width={32}
              height={35}
              style={{ filter: 'drop-shadow(0 0 12px rgba(203,168,104,0.4))', flex: 'none' }}
            />
            <div>
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: '22px',
                  fontWeight: 600,
                  color: '#f6ecd6',
                  margin: 0,
                  lineHeight: 1,
                  letterSpacing: '0.02em',
                }}
              >
                Sabi Demo{' '}
                <span style={{ fontSize: '11px', fontWeight: 400, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(216,205,184,0.62)', fontFamily: "'Lexend', ui-sans-serif, system-ui, sans-serif" }}>
                  · Education for Equality
                </span>
              </h1>
              <p style={{ fontSize: '12.5px', color: 'rgba(216,205,184,0.72)', margin: '3px 0 0' }}>
                {student?.name ? `Student: ${student.name}` : 'New student'} — Market math lesson
                {student && student.total_sessions > 0 && (
                  <span> · Session #{(student.total_sessions || 0) + 1}</span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={endSession}
            disabled={endingSession || textMessages.length < 2}
            style={{
              background: '#fffdf8',
              color: '#201a13',
              border: '1px solid #cba868',
              borderRadius: '10px',
              padding: '10px 18px',
              fontFamily: 'inherit',
              fontSize: '13px',
              fontWeight: 500,
              cursor: endingSession || textMessages.length < 2 ? 'not-allowed' : 'pointer',
              opacity: endingSession || textMessages.length < 2 ? 0.55 : 1,
              transition: 'background 140ms ease',
            }}
          >
            {endingSession ? 'Saving…' : 'End lesson'}
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div
          className="px-4 py-3 text-sm"
          style={{
            background: 'rgba(203,168,104,0.08)',
            border: '1px solid rgba(203,168,104,0.24)',
            borderRadius: '14px',
            color: 'rgba(240,230,207,0.88)',
            lineHeight: 1.55,
          }}
        >
          <strong style={{ color: '#f6ecd6' }}>Two channels, same AI:</strong> Text chat (left) simulates a{' '}
          <strong style={{ color: '#f6ecd6' }}>smartphone app</strong>. Voice chat (right) simulates a{' '}
          <strong style={{ color: '#f6ecd6' }}>phone call</strong> — tap the mic to talk. Both channels
          remember this student across sessions.{' '}
          <span style={{ color: 'rgba(240,230,207,0.7)' }}>
            When Sabi wraps up naturally (for example saying what you&apos;ll learn next time), progress saves
            automatically — you can still tap End lesson.
          </span>
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
        <div
          className="p-6"
          style={{
            background: 'rgba(203,168,104,0.08)',
            border: '1px solid rgba(203,168,104,0.24)',
            borderRadius: '18px',
          }}
        >
          <p style={{ fontSize: '10.5px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(226,200,142,0.72)', margin: '0 0 8px' }}>
            The evidence
          </p>
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '22px',
              fontWeight: 600,
              color: '#f6ecd6',
              margin: '0 0 14px',
              lineHeight: 1.15,
            }}
          >
            Why market math?
          </h3>
          <p className="mb-3" style={{ fontSize: '13.5px', color: 'rgba(240,230,207,0.82)', lineHeight: 1.65 }}>
            Weber, Bogler &amp; Vollmer&apos;s study of{' '}
            <strong style={{ color: '#f6ecd6' }}>5,997 children in North-West Nigeria (2024)</strong> found
            that children solved comparable subtraction tasks{' '}
            <strong style={{ color: '#f6ecd6' }}>9× more often</strong> in market framing than in formal
            school format (48.5% vs 5.4%). A separate Nature (2025) study found the same kind of transfer gap
            among working children in India.
          </p>
          <p className="mb-3" style={{ fontSize: '13.5px', color: 'rgba(240,230,207,0.82)', lineHeight: 1.65 }}>
            <strong style={{ color: '#f6ecd6' }}>Persistent memory</strong> means Sabi remembers each
            child&apos;s name, level, and mistakes across sessions — just like a real tutor. End this lesson
            and start another to see it in action.
          </p>
          <p style={{ fontSize: '12.5px', color: 'rgba(216,205,184,0.62)', lineHeight: 1.65 }}>
            Sabi is built by Education for Equality to deliver AI-powered voice tutoring to every child
            in Nigeria who needs it.
          </p>
        </div>
      </div>
    </div>
  );
}
