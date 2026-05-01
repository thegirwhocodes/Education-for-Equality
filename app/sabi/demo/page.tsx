"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { normalizeMoneyForSpeech } from "@/lib/voice/normalize-money-for-speech";
import {
  looksLikeLessonWrapUpAssistantMessage,
  transcriptEligibleForLessonCheckpoint,
} from "@/lib/sabi/is-lesson-wrap-up-message";

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
  const [voiceSupported, setVoiceSupported] = useState(true);

  const callActiveRef = useRef(false);
  const messagesRef = useRef<Message[]>([]);
  const studentRef = useRef<{ id: string; name: string } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const callStartRef = useRef(0);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const silentRetriesRef = useRef(0);
  const sessionPersistedRef = useRef(false);
  const elapsedRef = useRef(0);

  type TtsPlayback = { kind: "html"; audio: HTMLAudioElement; url: string };

  const activeTtsPlaybackRef = useRef<TtsPlayback | null>(null);
  const ongoingSpeakFinishRef = useRef<(() => void) | null>(null);
  const ttsFetchAbortRef = useRef<AbortController | null>(null);
  const speechSynthTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  function interruptSpeakOutput() {
    ttsFetchAbortRef.current?.abort();
    ttsFetchAbortRef.current = null;

    window.speechSynthesis?.cancel();
    if (speechSynthTimeoutRef.current) {
      clearTimeout(speechSynthTimeoutRef.current);
      speechSynthTimeoutRef.current = null;
    }

    const h = activeTtsPlaybackRef.current;
    activeTtsPlaybackRef.current = null;
    if (h) {
      try {
        h.audio.pause();
        h.audio.removeAttribute("src");
        h.audio.load();
      } catch {
        /* ignore */
      }
      try {
        URL.revokeObjectURL(h.url);
      } catch {
        /* ignore */
      }
    }

    const fin = ongoingSpeakFinishRef.current;
    ongoingSpeakFinishRef.current = null;
    fin?.();
  }

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

  // Check voice support (need MediaRecorder + getUserMedia)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setVoiceSupported(false);
    }
  }, []);

  useEffect(() => {
    const onUnload = () => interruptSpeakOutput();
    window.addEventListener("beforeunload", onUnload);
    return () => {
      interruptSpeakOutput();
      window.removeEventListener("beforeunload", onUnload);
    };
  }, []);

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

  useEffect(() => {
    elapsedRef.current = elapsed;
  }, [elapsed]);

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

  // Play audio from TTS API and return a promise
  const speakText = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        ongoingSpeakFinishRef.current = null;
        ttsFetchAbortRef.current = null;
        activeTtsPlaybackRef.current = null;
        if (speechSynthTimeoutRef.current) {
          clearTimeout(speechSynthTimeoutRef.current);
          speechSynthTimeoutRef.current = null;
        }
        resolve();
      };

      ongoingSpeakFinishRef.current = finish;

      void (async () => {
        if (!callActiveRef.current) {
          finish();
          return;
        }

        setCallState("speaking");
        const spokenText = normalizeMoneyForSpeech(text);
        const ac = new AbortController();
        ttsFetchAbortRef.current = ac;

        try {
          const res = await fetch("/api/sabi/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: spokenText }),
            signal: ac.signal,
          });

          if (!callActiveRef.current) {
            finish();
            return;
          }

          if (res.ok) {
            const arrayBuffer = await res.arrayBuffer();
            if (arrayBuffer.byteLength > 0) {
              if (!callActiveRef.current) {
                finish();
                return;
              }

              const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
              const url = URL.createObjectURL(blob);
              const audio = new Audio(url);
              activeTtsPlaybackRef.current = { kind: "html", audio, url };
              audio.onended = () => {
                activeTtsPlaybackRef.current = null;
                try {
                  URL.revokeObjectURL(url);
                } catch {
                  /* ignore */
                }
                finish();
              };
              audio.onerror = () => {
                activeTtsPlaybackRef.current = null;
                try {
                  URL.revokeObjectURL(url);
                } catch {
                  /* ignore */
                }
                finish();
              };
              await audio.play();
              return;
            }
          }
        } catch (err) {
          if ((err as Error)?.name === "AbortError") {
            finish();
            return;
          }
          console.warn("TTS failed, falling back to browser voice:", err);
        }

        if (!callActiveRef.current) {
          finish();
          return;
        }

        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(spokenText);
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

          let synResolved = false;
          const safeResolveSynth = () => {
            if (synResolved) return;
            synResolved = true;
            if (speechSynthTimeoutRef.current) {
              clearTimeout(speechSynthTimeoutRef.current);
              speechSynthTimeoutRef.current = null;
            }
            finish();
          };
          speechSynthTimeoutRef.current = setTimeout(
            safeResolveSynth,
            Math.max(5000, spokenText.length * 80)
          );
          utterance.onend = () => {
            safeResolveSynth();
          };
          utterance.onerror = () => {
            safeResolveSynth();
          };
          window.speechSynthesis.speak(utterance);
        } else {
          finish();
        }
      })();
    });
  }, []);

  // Get Sabi's response via Claude
  const getSabiResponse = useCallback(
    async (msgs: Message[]): Promise<string> => {
      const res = await fetch("/api/sabi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: msgs,
          student_id: studentRef.current?.id,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      return data.response;
    },
    []
  );

  // Record audio with MediaRecorder + silence detection, then transcribe via Groq Whisper
  const startListening = useCallback((): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        // Get mic stream (reuse if already open)
        if (!mediaStreamRef.current) {
          mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({
            audio: { echoCancellation: true, noiseSuppression: true },
          });
        }
        const stream = mediaStreamRef.current;

        // Set up silence detection with AudioContext
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        // Recording state
        const chunks: Blob[] = [];
        let didDetectSpeech = false;
        const recorder = new MediaRecorder(stream, {
          mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
            ? "audio/webm;codecs=opus"
            : "audio/webm",
        });
        recorderRef.current = recorder;

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = async () => {
          audioCtx.close();
          if (!callActiveRef.current) { resolve(""); return; }
          if (chunks.length === 0) { resolve(""); return; }

          // Skip API call entirely if no speech was detected (saves Groq quota)
          if (!didDetectSpeech) { resolve(""); return; }

          const blob = new Blob(chunks, { type: recorder.mimeType });
          if (blob.size < 1000) { resolve(""); return; } // Too small = silence

          // Send to Groq Whisper via our API
          setCallState("processing");
          try {
            const formData = new FormData();
            formData.append("audio", blob, "recording.webm");
            const res = await fetch("/api/sabi/stt", {
              method: "POST",
              body: formData,
            });
            if (res.ok) {
              const data = await res.json();
              // Reject low-confidence transcriptions (noise/hallucination)
              if (data.confidence !== undefined && data.confidence < 0.4) {
                resolve("");
                return;
              }
              resolve(data.text?.trim() || "");
            } else {
              console.warn("STT API error:", res.status);
              resolve("");
            }
          } catch (err) {
            console.warn("STT failed:", err);
            resolve("");
          }
        };

        recorder.start(250); // Collect data every 250ms
        setCallState("listening");

        // Silence detection loop
        let speechDetected = false;
        let silenceStart = 0;
        const SILENCE_THRESHOLD = 15; // Volume level (0-255)
        const SILENCE_DURATION = 1500; // ms of silence after speech to stop
        const MAX_DURATION = 15000; // Max recording time
        const startTime = Date.now();

        const checkSilence = () => {
          if (!callActiveRef.current || recorder.state !== "recording") return;

          // Max duration safety
          if (Date.now() - startTime > MAX_DURATION) {
            recorder.stop();
            return;
          }

          analyser.getByteFrequencyData(dataArray);
          const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

          if (volume > SILENCE_THRESHOLD) {
            speechDetected = true;
            didDetectSpeech = true;
            silenceStart = 0;
          } else if (speechDetected) {
            if (!silenceStart) silenceStart = Date.now();
            if (Date.now() - silenceStart > SILENCE_DURATION) {
              recorder.stop();
              return;
            }
          }

          requestAnimationFrame(checkSilence);
        };
        requestAnimationFrame(checkSilence);
      } catch (err) {
        console.error("Mic error:", err);
        reject(new Error("Microphone access denied"));
      }
    });
  }, []);

  // One conversation turn: listen → process → speak → repeat
  const runTurn = useCallback(async () => {
    if (!callActiveRef.current) return;

    try {
      // 1. Listen — Web Speech API auto-detects speech end
      const transcript = await startListening();

      if (!callActiveRef.current) return;

      // Handle silence or empty — prompt user after 2 silent retries
      if (!transcript) {
        silentRetriesRef.current += 1;
        if (callActiveRef.current) {
          if (silentRetriesRef.current >= 2) {
            // Nudge the user so it doesn't just sit silently
            silentRetriesRef.current = 0;
            const nudge = "I didn't quite hear that. Could you try again?";
            const nudgeMsg: Message = { role: "assistant", content: nudge };
            const updated = [...messagesRef.current, nudgeMsg];
            setMessages(updated);
            messagesRef.current = updated;
            await speakText(nudge);
          }
          if (callActiveRef.current) setTimeout(runTurn, 100);
        }
        return;
      }
      silentRetriesRef.current = 0;

      // 2. Add user message
      const userMsg: Message = { role: "user", content: transcript };
      const updatedMessages = [...messagesRef.current, userMsg];
      setMessages(updatedMessages);
      messagesRef.current = updatedMessages;

      // 3. Get Sabi's response
      setCallState("processing");
      const response = await getSabiResponse(updatedMessages);

      if (!callActiveRef.current) return;

      // 4. Add assistant message
      const assistantMsg: Message = { role: "assistant", content: response };
      const finalMessages = [...updatedMessages, assistantMsg];
      setMessages(finalMessages);
      messagesRef.current = finalMessages;

      if (
        looksLikeLessonWrapUpAssistantMessage(response) &&
        transcriptEligibleForLessonCheckpoint(finalMessages) &&
        !sessionPersistedRef.current &&
        studentRef.current?.id
      ) {
        void (async () => {
          try {
            const res = await fetch("/api/sabi/session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                student_id: studentRef.current!.id,
                messages: [...finalMessages],
                duration_seconds: elapsedRef.current,
              }),
            });
            if (!res.ok) return;
            sessionPersistedRef.current = true;
            const browserId = localStorage.getItem("sabi_browser_id");
            if (browserId) {
              const sr = await fetch(
                `/api/sabi/student?browser_id=${encodeURIComponent(browserId)}`
              );
              const jd = await sr.json();
              if (jd.student) setStudent(jd.student);
            }
          } catch {
            /* retry on hang-up */
          }
        })();
      }

      // 5. Speak the response (TTS)
      await speakText(response);

      if (!callActiveRef.current) return;

      // 6. Auto-start next turn — no tap needed (setTimeout avoids stack buildup)
      setTimeout(runTurn, 100);
    } catch (err) {
      console.error("Turn error:", err);
      if (callActiveRef.current) {
        setError("Something went wrong. Tap to try again.");
        setCallState("ready");
      }
    }
  }, [startListening, getSabiResponse, speakText]);

  // Start call
  const startCall = async () => {
    setError("");
    sessionPersistedRef.current = false;
    setMessages([]);
    setCallState("connecting");

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

    setCallActive(true);
    callActiveRef.current = true;

    try {
      setCallState("processing");
      const greeting = await getSabiResponse([]);

      if (!callActiveRef.current) return;

      const initialMessages: Message[] = [
        { role: "assistant", content: greeting },
      ];
      setMessages(initialMessages);
      messagesRef.current = initialMessages;

      // Speak greeting
      await speakText(greeting);

      if (!callActiveRef.current) return;

      // Start auto-listening loop
      runTurn();
    } catch (err) {
      console.error("Init error:", err);
      setError("Failed to start. Check that API keys are configured.");
      endCall();
    }
  };

  // End call
  const endCall = async () => {
    interruptSpeakOutput();
    callActiveRef.current = false;
    setCallActive(false);
    setCallState("idle");

    // Stop recorder
    try { recorderRef.current?.stop(); } catch { /* ignore */ }
    recorderRef.current = null;
    // Release mic
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaStreamRef.current = null;

    if (
      messagesRef.current.length >= 2 &&
      studentRef.current?.id &&
      !sessionPersistedRef.current
    ) {
      try {
        const res = await fetch("/api/sabi/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student_id: studentRef.current.id,
            messages: messagesRef.current,
            duration_seconds: elapsedRef.current,
          }),
        });
        const browserId = localStorage.getItem("sabi_browser_id");
        if (res.ok && browserId) {
          sessionPersistedRef.current = true;
          const sr = await fetch(
            `/api/sabi/student?browser_id=${encodeURIComponent(browserId)}`
          );
          const data = await sr.json();
          if (data.student) setStudent(data.student);
        }
      } catch {
        // Best-effort
      }
    }
  };

  const handleOrbTap = () => {
    if (callState === "ready") {
      setError("");
      runTurn();
    }
  };

  const statusText: Record<CallState, string> = {
    idle: "Tap to call Sabi",
    connecting: "Connecting...",
    listening: "Listening...",
    processing: "Sabi is thinking...",
    speaking: "Sabi is speaking...",
    ready: "Tap to continue",
  };

  // ─── Idle Screen ────────────────────────────────────────────────
  if (!callActive && callState === "idle") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a1a15] via-[#0d2b22] to-[#0a1a15] flex flex-col items-center justify-center px-4">
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
          <p className="text-white/50 text-sm">Voice AI Tutor</p>
        </div>

        {!voiceSupported && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-3 max-w-xs mb-6">
            <p className="text-red-300 text-sm text-center">
              Voice not supported in this browser. Please use Chrome.
            </p>
          </div>
        )}

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

        {student && (
          <div className="text-center mb-8">
            <p className="text-white/70 text-sm">
              Welcome back,{" "}
              <span className="text-white font-semibold">{student.name}</span>
            </p>
            <p className="text-white/40 text-xs mt-1">
              {student.total_sessions} lesson
              {student.total_sessions !== 1 ? "s" : ""} saved on this device
            </p>
          </div>
        )}

        <button
          onClick={startCall}
          disabled={(!student && !nameInput.trim()) || !voiceSupported}
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
      <div className="text-center">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-1">
          {callState === "connecting" ? "Connecting" : "In Call"}
        </p>
        <h2 className="text-white text-xl font-semibold">Sabi</h2>
        <p className="text-white/50 text-sm mt-1">{formatTime(elapsed)}</p>
      </div>

      <div className="flex flex-col items-center gap-6">
        <button
          onClick={handleOrbTap}
          disabled={callState !== "ready"}
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
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  className="opacity-90 animate-pulse"
                >
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
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

        <p className="text-white/60 text-sm">{statusText[callState]}</p>

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

