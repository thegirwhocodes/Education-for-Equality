"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type CallState =
  | "idle"
  | "connecting"
  | "listening"
  | "processing"
  | "speaking"
  | "ready";

export default function SabiVoice() {
  const [student, setStudent] = useState<{
    id: string;
    name: string;
    total_sessions: number;
  } | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [callActive, setCallActive] = useState(false);
  const [callState, setCallState] = useState<CallState>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState("");

  const callActiveRef = useRef(false);
  const messagesRef = useRef<Message[]>([]);
  const studentRef = useRef<{ id: string; name: string } | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const callStartRef = useRef(0);
  const resolveRecordingRef = useRef<((blob: Blob) => void) | null>(null);

  // Keep refs in sync
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  useEffect(() => {
    studentRef.current = student;
  }, [student]);
  useEffect(() => {
    callActiveRef.current = callActive;
  }, [callActive]);

  // Load returning student
  useEffect(() => {
    const browserId = localStorage.getItem("sabi_browser_id");
    if (browserId) {
      fetch(`/api/sabi/student?browser_id=${encodeURIComponent(browserId)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.student) setStudent(data.student);
        })
        .catch(() => {});
    }
  }, []);

  // Timer
  useEffect(() => {
    if (callActive) {
      callStartRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - callStartRef.current) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setElapsed(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callActive]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  // Play base64 audio and return a promise
  const playAudio = useCallback((base64: string): Promise<void> => {
    return new Promise((resolve) => {
      const bytes = atob(base64);
      const buffer = new Uint8Array(bytes.length);
      for (let i = 0; i < bytes.length; i++) buffer[i] = bytes.charCodeAt(i);

      const blob = new Blob([buffer], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      audio.onended = () => {
        URL.revokeObjectURL(url);
        resolve();
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        resolve();
      };
      audio.play().catch(() => resolve());
    });
  }, []);

  // Start recording — returns a promise that resolves when stopRecording is called
  const startRecording = useCallback((): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!streamRef.current) {
        reject(new Error("No microphone stream"));
        return;
      }

      audioChunksRef.current = [];
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const recorder = new MediaRecorder(streamRef.current, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        resolve(blob);
      };

      recorder.onerror = () => reject(new Error("Recording failed"));
      recorder.start();
      resolveRecordingRef.current = null; // will be set when we want to stop
    });
  }, []);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  // Send audio through full pipeline
  const sendToPipeline = useCallback(
    async (audioBlob: Blob | null, currentMessages: Message[]) => {
      const formData = new FormData();
      if (audioBlob) formData.append("audio", audioBlob);
      formData.append("messages", JSON.stringify(currentMessages));
      if (studentRef.current?.id)
        formData.append("student_id", studentRef.current.id);

      const res = await fetch("/api/sabi/voice-chat", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Pipeline failed");
      return res.json();
    },
    []
  );

  // Handle one turn: listen → process → speak
  const handleTurn = useCallback(async () => {
    if (!callActiveRef.current) return;

    try {
      // 1. Listen
      setCallState("listening");
      const recordPromise = startRecording();

      // Wait for user to tap stop (stopRecording will be called by button)
      // But also set a max timeout of 15 seconds
      const timeoutPromise = new Promise<Blob>((resolve) => {
        setTimeout(() => {
          stopRecording();
          // The recordPromise will resolve from onstop
          recordPromise.then(resolve);
        }, 15000);
      });

      const audioBlob = await Promise.race([recordPromise, timeoutPromise]);

      if (!callActiveRef.current) return;

      // 2. Process
      setCallState("processing");
      const result = await sendToPipeline(audioBlob, messagesRef.current);

      if (!callActiveRef.current) return;

      if (result.error) {
        setError(result.error);
        setCallState("ready");
        return;
      }

      // 3. Update messages
      const newMessages = [...messagesRef.current];
      if (result.transcript) {
        newMessages.push({ role: "user", content: result.transcript });
      }
      newMessages.push({ role: "assistant", content: result.response });
      setMessages(newMessages);

      // 4. Speak
      if (result.audio) {
        setCallState("speaking");
        await playAudio(result.audio);
      }

      if (!callActiveRef.current) return;

      // 5. Ready for next turn — auto-start listening
      setCallState("ready");
      // Small delay before auto-listening
      setTimeout(() => {
        if (callActiveRef.current) {
          handleTurn();
        }
      }, 500);
    } catch (err) {
      console.error("Turn error:", err);
      if (callActiveRef.current) {
        setError("Something went wrong. Tap the mic to try again.");
        setCallState("ready");
      }
    }
  }, [startRecording, stopRecording, sendToPipeline, playAudio]);

  // Start call
  const startCall = async () => {
    setError("");
    setMessages([]);
    setCallState("connecting");

    // Create student if needed
    let currentStudent = student;
    if (!currentStudent) {
      const browserId =
        localStorage.getItem("sabi_browser_id") || crypto.randomUUID();
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
      } catch {
        setError("Failed to connect. Check your internet.");
        setCallState("idle");
        return;
      }
    }

    // Get microphone
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
    } catch {
      setError("Microphone access denied. Please allow microphone access.");
      setCallState("idle");
      return;
    }

    setCallActive(true);
    callActiveRef.current = true;

    // Get Sabi's greeting
    try {
      setCallState("processing");
      const result = await sendToPipeline(null, []);

      if (result.error) {
        setError(result.error);
        endCall();
        return;
      }

      const initialMessages: Message[] = [
        { role: "assistant", content: result.response },
      ];
      setMessages(initialMessages);
      messagesRef.current = initialMessages;

      // Play greeting
      if (result.audio) {
        setCallState("speaking");
        await playAudio(result.audio);
      }

      // Start listening loop
      if (callActiveRef.current) {
        handleTurn();
      }
    } catch (err) {
      console.error("Init error:", err);
      setError("Failed to start. Check that API keys are configured.");
      endCall();
    }
  };

  // End call
  const endCall = async () => {
    callActiveRef.current = false;
    setCallActive(false);
    setCallState("idle");

    // Stop recording
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }

    // Stop mic
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    // Save session
    if (messagesRef.current.length >= 2 && studentRef.current?.id) {
      try {
        await fetch("/api/sabi/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student_id: studentRef.current.id,
            messages: messagesRef.current,
            duration_seconds: elapsed,
          }),
        });
      } catch {
        // Best-effort
      }
    }
  };

  // Tap mic during listening → stop recording early
  const handleMicTap = () => {
    if (callState === "listening") {
      stopRecording();
    } else if (callState === "ready") {
      handleTurn();
    }
  };

  const statusText: Record<CallState, string> = {
    idle: "Tap to call Sabi",
    connecting: "Connecting...",
    listening: "Listening... tap when done",
    processing: "Sabi is thinking...",
    speaking: "Sabi is speaking...",
    ready: "Tap to speak",
  };

  // ─── Idle Screen ────────────────────────────────────────────────
  if (!callActive && callState === "idle") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a1a15] via-[#0d2b22] to-[#0a1a15] flex flex-col items-center justify-center px-4">
        {/* Branding */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0f6b4f] to-[#1a8c6a] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#0f6b4f]/30">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Sabi</h1>
          <p className="text-white/50 text-sm">
            Voice AI Tutor — Full Pipeline Test
          </p>
          <p className="text-white/30 text-xs mt-1">
            Groq STT → Claude Haiku → YarnGPT TTS
          </p>
        </div>

        {/* Name input for new users */}
        {!student && (
          <div className="w-full max-w-xs mb-8">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && nameInput.trim() && startCall()
              }
              placeholder="Enter your name"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-center placeholder-white/40 focus:outline-none focus:border-[#1a8c6a] focus:ring-1 focus:ring-[#1a8c6a]"
            />
          </div>
        )}

        {/* Returning student */}
        {student && (
          <div className="text-center mb-8">
            <p className="text-white/70 text-sm">
              Welcome back,{" "}
              <span className="text-white font-semibold">{student.name}</span>
            </p>
            <p className="text-white/40 text-xs mt-1">
              {student.total_sessions} session
              {student.total_sessions !== 1 ? "s" : ""} completed
            </p>
          </div>
        )}

        {/* Call button */}
        <button
          onClick={startCall}
          disabled={!student && !nameInput.trim()}
          className="w-20 h-20 rounded-full bg-green-500 hover:bg-green-400 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg shadow-green-500/30"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
          </svg>
        </button>
        <p className="text-white/40 text-xs mt-4">Tap to start a call</p>

        {error && (
          <div className="mt-6 bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-3 max-w-xs">
            <p className="text-red-300 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Previous conversation */}
        {messages.length > 0 && (
          <div className="mt-8 w-full max-w-md">
            <p className="text-white/40 text-xs text-center mb-3">
              Last conversation:
            </p>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 max-h-40 overflow-y-auto space-y-2">
              {messages.map((m, i) => (
                <p
                  key={i}
                  className={`text-xs ${m.role === "user" ? "text-white/60" : "text-[#4ade80]/80"}`}
                >
                  <span className="font-semibold">
                    {m.role === "user" ? "You" : "Sabi"}:
                  </span>{" "}
                  {m.content}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Not me */}
        {student && (
          <button
            onClick={() => {
              localStorage.removeItem("sabi_browser_id");
              setStudent(null);
            }}
            className="mt-6 text-white/30 text-xs hover:text-white/50"
          >
            Not {student.name}? Start fresh
          </button>
        )}

        <p className="absolute bottom-6 text-white/20 text-xs">
          Education for Equality
        </p>
      </div>
    );
  }

  // ─── Active Call Screen ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1a15] via-[#0d2b22] to-[#0a1a15] flex flex-col items-center justify-between px-4 py-8">
      {/* Top bar */}
      <div className="text-center">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-1">
          {callState === "connecting" ? "Connecting" : "In Call"}
        </p>
        <h2 className="text-white text-xl font-semibold">Sabi</h2>
        <p className="text-white/50 text-sm mt-1">{formatTime(elapsed)}</p>
      </div>

      {/* Center — orb + status */}
      <div className="flex flex-col items-center gap-6">
        {/* Interactive orb */}
        <button
          onClick={handleMicTap}
          disabled={
            callState === "processing" ||
            callState === "speaking" ||
            callState === "connecting"
          }
          className="relative focus:outline-none disabled:cursor-default"
        >
          <div
            className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-500 ${
              callState === "listening"
                ? "bg-red-500/20 scale-110"
                : callState === "speaking"
                  ? "bg-[#1a8c6a]/20"
                  : callState === "processing"
                    ? "bg-yellow-500/10"
                    : "bg-white/5 hover:bg-white/10"
            }`}
          >
            {/* Inner circle */}
            <div
              className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 ${
                callState === "listening"
                  ? "bg-red-500/30"
                  : callState === "speaking"
                    ? "bg-[#1a8c6a]/30 animate-pulse"
                    : callState === "processing"
                      ? "bg-yellow-500/20 animate-pulse"
                      : "bg-white/10"
              }`}
            >
              {callState === "listening" ? (
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="opacity-90"
                >
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : callState === "speaking" ? (
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  className="opacity-90"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              ) : callState === "processing" ? (
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/60 animate-bounce" />
                  <div
                    className="w-2.5 h-2.5 rounded-full bg-white/60 animate-bounce"
                    style={{ animationDelay: "0.15s" }}
                  />
                  <div
                    className="w-2.5 h-2.5 rounded-full bg-white/60 animate-bounce"
                    style={{ animationDelay: "0.3s" }}
                  />
                </div>
              ) : (
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  className="opacity-70"
                >
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              )}
            </div>
          </div>

          {/* Pulse rings when listening */}
          {callState === "listening" && (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-red-500/30 animate-ping" />
              <div
                className="absolute -inset-3 rounded-full border border-red-500/15 animate-ping"
                style={{ animationDelay: "0.5s" }}
              />
            </>
          )}
        </button>

        {/* Status */}
        <p className="text-white/60 text-sm">{statusText[callState]}</p>

        {/* Transcript */}
        <div className="w-full max-w-sm space-y-3 max-h-56 overflow-y-auto px-2">
          {messages.slice(-6).map((m, i) => (
            <div
              key={i}
              className={`text-sm leading-relaxed ${
                m.role === "user"
                  ? "text-white/50 text-right"
                  : "text-[#4ade80]/90 text-left"
              }`}
            >
              <span className="text-[10px] uppercase tracking-wide opacity-50 block mb-0.5">
                {m.role === "user" ? "You" : "Sabi"}
              </span>
              {m.content}
            </div>
          ))}
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}
      </div>

      {/* End call */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={endCall}
          className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-500/30"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08a.956.956 0 0 1-.29-.7c0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28a11.27 11.27 0 0 0-2.67-1.85.996.996 0 0 1-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" />
          </svg>
        </button>
        <p className="text-white/30 text-xs">End Call</p>
      </div>
    </div>
  );
}
