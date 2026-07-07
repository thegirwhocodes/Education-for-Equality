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
  const voiceSupported =
    typeof window === "undefined" ||
    (typeof navigator.mediaDevices?.getUserMedia === "function" &&
      typeof window.MediaRecorder !== "undefined");

  const callActiveRef = useRef(false);
  const messagesRef = useRef<Message[]>([]);
  const studentRef = useRef<{ id: string; name: string } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const callStartRef = useRef(0);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const runTurnRef = useRef<(() => void) | null>(null);
  const sessionPersistedRef = useRef(false);
  /** Latest call timer for POST /api/sabi/session (state can lag inside async). */
  const elapsedRef = useRef(0);

  type TtsPlayback =
    | { kind: "buffer"; ctx: AudioContext; source: AudioBufferSourceNode }
    | { kind: "html"; audio: HTMLAudioElement; url: string };

  const activeTtsPlaybackRef = useRef<TtsPlayback | null>(null);
  /** Resolves the in-flight `speakText` promise (used when user ends call). */
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
      if (h.kind === "buffer") {
        try {
          h.source.stop(0);
        } catch {
          /* already stopped */
        }
        void h.ctx.close().catch(() => {});
      } else {
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

  useEffect(() => {
    const onUnload = () => {
      interruptSpeakOutput();
    };
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
    if (!callActive) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    callStartRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - callStartRef.current) / 1000));
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
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

            if (!callActiveRef.current) {
              finish();
              return;
            }

            const AudioCtx =
              window.AudioContext ||
              (window as unknown as { webkitAudioContext: typeof AudioContext })
                .webkitAudioContext;
            if (AudioCtx) {
              let ctx: AudioContext | null = null;
              try {
                ctx = new AudioCtx();
                const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(ctx.destination);
                activeTtsPlaybackRef.current = { kind: "buffer", ctx, source };
                source.onended = () => {
                  activeTtsPlaybackRef.current = null;
                  void ctx?.close().catch(() => {});
                  finish();
                };
                source.start(0);
                return;
              } catch (bufErr) {
                console.warn(
                  "AudioContext decode/play failed, trying <audio>:",
                  bufErr
                );
                void ctx?.close().catch(() => {});
              }
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
        analyser.fftSize = 1024;
        source.connect(analyser);
        const dataArray = new Uint8Array(analyser.fftSize);

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
              // Keep short child utterances: names and number answers often score low on phone/laptop mics.
              if (data.confidence !== undefined && data.confidence < 0.18) {
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
        const SILENCE_THRESHOLD = 6; // RMS over centered waveform
        const SILENCE_DURATION = 900; // ms of silence after speech to stop
        const MAX_DURATION = 12000; // Max recording time
        const startTime = Date.now();

        const checkSilence = () => {
          if (!callActiveRef.current || recorder.state !== "recording") return;

          // Max duration safety
          if (Date.now() - startTime > MAX_DURATION) {
            recorder.stop();
            return;
          }

          analyser.getByteTimeDomainData(dataArray);
          const volume = Math.sqrt(
            dataArray.reduce((sum, value) => {
              const centered = value - 128;
              return sum + centered * centered;
            }, 0) / dataArray.length
          );

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

      // Handle silence or empty — auto-retry (setTimeout avoids stack buildup)
      if (!transcript) {
        if (callActiveRef.current) {
          setTimeout(() => runTurnRef.current?.(), 100);
        }
        return;
      }

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
            /* allow retry on End Call */
          }
        })();
      }

      // 5. Speak the response (TTS)
      await speakText(response);

      if (!callActiveRef.current) return;

      // 6. Auto-start next turn — no tap needed (setTimeout avoids stack buildup)
      setTimeout(() => runTurnRef.current?.(), 100);
    } catch (err) {
      console.error("Turn error:", err);
      if (callActiveRef.current) {
        setError("Something went wrong. Tap to try again.");
        setCallState("ready");
      }
    }
  }, [startListening, getSabiResponse, speakText]);

  useEffect(() => {
    runTurnRef.current = runTurn;
  }, [runTurn]);

  // Start call
  const startCall = async () => {
    setError("");
    sessionPersistedRef.current = false;
    setMessages([]);
    elapsedRef.current = 0;
    setElapsed(0);
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

    elapsedRef.current = 0;
    setElapsed(0);
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
      <>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Lexend:wght@300;400;500;600;700&display=swap"
        />
        <div className="sv-shell">
          <div className="sv-container">
            <header className="sv-brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/sabi-spark.svg" alt="" width={54} height={58} className="sv-spark" />
              <div className="sv-wordmark">Sabi</div>
              <div className="sv-byline">Voice AI Tutor · Education for Equality</div>
            </header>

            {!voiceSupported && (
              <div className="sv-alert sv-alert-warn">
                Voice not supported in this browser. Please use Chrome.
              </div>
            )}

            {!student ? (
              <div className="sv-card">
                <div className="sv-hairline" aria-hidden />
                <div className="sv-card-body">
                  <p className="sv-kicker">Start a lesson</p>
                  <h1 className="sv-display">Say hello to Sabi</h1>
                  <p className="sv-lead">
                    Sabi is a warm Nigerian-English voice tutor. Tell her your name and tap the
                    button — she&apos;ll teach through a real market scenario, one small idea at a time.
                  </p>
                  <label className="sv-field">
                    <span className="sv-field-label">Your name</span>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && nameInput.trim() && startCall()
                      }
                      placeholder="Amina"
                      className="sv-input"
                    />
                  </label>

                  <button
                    onClick={startCall}
                    disabled={!nameInput.trim() || !voiceSupported}
                    className="sv-btn-primary"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                    </svg>
                    Call Sabi
                  </button>
                  <p className="sv-hint">Tip: put your phone on speaker so both of you can hear the lesson.</p>
                </div>
              </div>
            ) : (
              <div className="sv-card">
                <div className="sv-hairline" aria-hidden />
                <div className="sv-card-body">
                  <p className="sv-kicker">Welcome back</p>
                  <h1 className="sv-display">Hi {student.name}</h1>
                  <p className="sv-lead">
                    {student.total_sessions} lesson{student.total_sessions !== 1 ? "s" : ""} saved on this
                    device. Sabi remembers where you left off.
                  </p>
                  <button
                    onClick={startCall}
                    disabled={!voiceSupported}
                    className="sv-btn-primary"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                    </svg>
                    Continue with Sabi
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem("sabi_browser_id");
                      setStudent(null);
                    }}
                    className="sv-btn-ghost"
                  >
                    Not {student.name}? Start fresh
                  </button>
                </div>
              </div>
            )}

            {error && <div className="sv-alert sv-alert-error">{error}</div>}

            {messages.length > 0 && (
              <div className="sv-transcript">
                <p className="sv-transcript-title">Last conversation</p>
                <div className="sv-transcript-body">
                  {messages.map((m, i) => (
                    <p key={i} className={m.role === "user" ? "sv-turn sv-turn-child" : "sv-turn sv-turn-sabi"}>
                      <span className="sv-turn-role">{m.role === "user" ? "You" : "Sabi"}</span>
                      {m.content}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <p className="sv-footnote">Education for Equality</p>
          </div>
        </div>

        <style jsx>{`
          .sv-shell {
            min-height: 100vh;
            padding: 44px 20px 60px;
            background:
              radial-gradient(1200px 500px at 85% -10%, rgba(203, 168, 104, 0.14), transparent 60%),
              radial-gradient(900px 480px at 12% 110%, rgba(154, 117, 54, 0.08), transparent 65%),
              #f7f2e7;
            color: #201a13;
            font-family: 'Lexend', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Arial, sans-serif;
            font-weight: 300;
            line-height: 1.55;
            font-size: 14.5px;
          }
          .sv-container {
            width: 100%;
            max-width: 460px;
            margin: 0 auto;
            display: grid;
            gap: 20px;
          }
          .sv-brand {
            text-align: center;
            display: grid;
            justify-items: center;
            gap: 4px;
            margin-bottom: 6px;
          }
          .sv-spark {
            filter: drop-shadow(0 0 16px rgba(203, 168, 104, 0.4));
            margin-bottom: 8px;
          }
          .sv-wordmark {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 32px;
            font-weight: 600;
            color: #201a13;
            line-height: 1;
            letter-spacing: 0.01em;
          }
          .sv-byline {
            font-size: 10.5px;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            color: #857a68;
            margin-top: 6px;
          }
          .sv-card {
            background: #fffdf8;
            border: 1px solid #e8dfc9;
            border-radius: 18px;
            overflow: hidden;
            box-shadow: 0 24px 60px rgba(45, 36, 20, 0.1), 0 6px 22px rgba(45, 36, 20, 0.06);
          }
          .sv-hairline {
            height: 4px;
            background: linear-gradient(90deg, #cba868 0%, #e2c88e 45%, rgba(226, 200, 142, 0) 100%);
          }
          .sv-card-body {
            padding: 30px 28px 26px;
          }
          .sv-kicker {
            margin: 0 0 10px;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            color: #9a7536;
          }
          .sv-display {
            margin: 0;
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 30px;
            font-weight: 600;
            line-height: 1.12;
            color: #201a13;
            letter-spacing: 0.005em;
          }
          .sv-lead {
            margin: 12px 0 18px;
            color: #4c4438;
            font-size: 14.5px;
            font-weight: 300;
            line-height: 1.65;
          }
          .sv-field {
            display: grid;
            gap: 6px;
            margin-bottom: 14px;
          }
          .sv-field-label {
            font-size: 12px;
            font-weight: 500;
            letter-spacing: 0.03em;
            color: #4c4438;
          }
          .sv-input {
            width: 100%;
            border: 1px solid #d9cdaf;
            border-radius: 11px;
            background: #ffffff;
            color: #201a13;
            font-family: inherit;
            font-size: 15px;
            font-weight: 300;
            padding: 13px 14px;
            outline: none;
            transition: border-color 140ms ease, box-shadow 140ms ease, background 140ms ease;
          }
          .sv-input::placeholder {
            color: #a09482;
          }
          .sv-input:focus {
            border-color: #cba868;
            box-shadow: 0 0 0 4px rgba(203, 168, 104, 0.18);
            background: #fffdf8;
          }
          .sv-btn-primary {
            width: 100%;
            min-height: 50px;
            border-radius: 12px;
            background: #1b1610;
            color: #f6efe0;
            border: 1px solid #1b1610;
            font-family: inherit;
            font-size: 14.5px;
            font-weight: 500;
            letter-spacing: 0.01em;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: background 140ms ease, box-shadow 140ms ease, transform 140ms ease;
          }
          .sv-btn-primary:hover {
            background: #33291c;
            box-shadow: 0 8px 24px rgba(32, 26, 19, 0.24);
          }
          .sv-btn-primary:active {
            transform: translateY(1px);
          }
          .sv-btn-primary:disabled {
            opacity: 0.55;
            cursor: not-allowed;
          }
          .sv-btn-ghost {
            width: 100%;
            min-height: 40px;
            margin-top: 8px;
            border-radius: 11px;
            background: transparent;
            color: #9a7536;
            border: 1px solid transparent;
            font-family: inherit;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: background 140ms ease, border-color 140ms ease, color 140ms ease;
          }
          .sv-btn-ghost:hover {
            background: #faf4e6;
            border-color: #e8dfc9;
            color: #201a13;
          }
          .sv-hint {
            margin: 12px 0 0;
            font-size: 12.5px;
            line-height: 1.55;
            color: #857a68;
            font-weight: 300;
          }
          .sv-alert {
            padding: 12px 14px;
            border-radius: 12px;
            font-size: 13px;
            line-height: 1.55;
            border: 1px solid;
            text-align: center;
          }
          .sv-alert-warn {
            background: #faf0da;
            border-color: #ecd3a2;
            color: #9b5b00;
          }
          .sv-alert-error {
            background: #fbeeec;
            border-color: #f0c1ba;
            color: #7d1810;
          }
          .sv-transcript {
            background: #fffdf8;
            border: 1px solid #e8dfc9;
            border-radius: 14px;
            padding: 16px 18px 14px;
            box-shadow: 0 6px 22px rgba(45, 36, 20, 0.05);
          }
          .sv-transcript-title {
            margin: 0 0 10px;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: #9a7536;
          }
          .sv-transcript-body {
            max-height: 180px;
            overflow-y: auto;
            display: grid;
            gap: 8px;
          }
          .sv-turn {
            margin: 0;
            font-size: 13px;
            line-height: 1.5;
            color: #4c4438;
          }
          .sv-turn-role {
            display: block;
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: #9a7536;
            margin-bottom: 2px;
          }
          .sv-turn-child {
            color: #4c4438;
          }
          .sv-turn-sabi {
            color: #201a13;
          }
          .sv-footnote {
            text-align: center;
            margin: 12px 0 0;
            font-size: 11.5px;
            letter-spacing: 0.02em;
            color: #a09482;
            font-weight: 300;
          }
        `}</style>
      </>
    );
  }

  // ─── Active Call Screen ─────────────────────────────────────────
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Lexend:wght@300;400;500;600;700&display=swap"
      />
      <div className="svc-shell">
        <div className="svc-topbar">
          <p className="svc-topbar-kicker">
            {callState === "connecting" ? "Connecting" : "In session"}
          </p>
          <h2 className="svc-topbar-title">Sabi</h2>
          <p className="svc-topbar-time">{formatTime(elapsed)}</p>
        </div>

        <div className="svc-orb-wrap">
          <button
            onClick={handleOrbTap}
            disabled={callState !== "ready"}
            className={`svc-orb svc-orb-${callState}`}
            aria-label={statusText[callState]}
          >
            <div className={`svc-orb-inner svc-orb-inner-${callState}`}>
              {callState === "listening" ? (
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="svc-icon-pulse">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              ) : callState === "speaking" ? (
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              ) : callState === "processing" ? (
                <div className="svc-dots">
                  <span />
                  <span style={{ animationDelay: "0.15s" }} />
                  <span style={{ animationDelay: "0.3s" }} />
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src="/sabi-spark.svg" alt="" width={42} height={46} className="svc-spark" />
              )}
            </div>

            {callState === "listening" && (
              <>
                <div className="svc-ring svc-ring-1" />
                <div className="svc-ring svc-ring-2" />
              </>
            )}
          </button>

          <p className="svc-status">{statusText[callState]}</p>
        </div>

        <div className="svc-transcript">
          {messages.slice(-6).map((m, i) => (
            <div key={i} className={m.role === "user" ? "svc-turn svc-turn-child" : "svc-turn svc-turn-sabi"}>
              <span className="svc-turn-role">{m.role === "user" ? "You" : "Sabi"}</span>
              <span className="svc-turn-text">{m.content}</span>
            </div>
          ))}
        </div>

        {error && <p className="svc-error">{error}</p>}

        <div className="svc-endcall">
          <button onClick={endCall} className="svc-endcall-btn" aria-label="End call">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08a.956.956 0 0 1-.29-.7c0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28a11.27 11.27 0 0 0-2.67-1.85.996.996 0 0 1-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" />
            </svg>
          </button>
          <p className="svc-endcall-label">End call</p>
        </div>
      </div>

      <style jsx>{`
        .svc-shell {
          min-height: 100vh;
          padding: 32px 20px 40px;
          background: linear-gradient(180deg, #1b1610 0%, #221b12 60%, #2a2318 100%);
          color: #f1e6cd;
          font-family: 'Lexend', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Arial, sans-serif;
          font-weight: 300;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }
        .svc-topbar {
          text-align: center;
          display: grid;
          gap: 4px;
          justify-items: center;
        }
        .svc-topbar-kicker {
          margin: 0;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(216, 205, 184, 0.62);
        }
        .svc-topbar-title {
          margin: 0;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 30px;
          font-weight: 600;
          line-height: 1;
          color: #f6ecd6;
          letter-spacing: 0.02em;
        }
        .svc-topbar-time {
          margin: 4px 0 0;
          font-size: 13px;
          font-variant-numeric: tabular-nums;
          color: rgba(216, 205, 184, 0.68);
        }
        .svc-orb-wrap {
          display: grid;
          justify-items: center;
          gap: 22px;
        }
        .svc-orb {
          position: relative;
          width: 176px;
          height: 176px;
          border-radius: 999px;
          border: 0;
          padding: 0;
          background: transparent;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          outline: none;
          transition: transform 320ms ease;
        }
        .svc-orb:disabled {
          cursor: default;
        }
        .svc-orb:focus-visible {
          outline: 2px solid #cba868;
          outline-offset: 4px;
        }
        .svc-orb-listening {
          transform: scale(1.06);
        }
        .svc-orb-inner {
          width: 132px;
          height: 132px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #f6ecd6;
          border: 1px solid rgba(203, 168, 104, 0.28);
          background: rgba(203, 168, 104, 0.1);
          transition: background 320ms ease, box-shadow 320ms ease, border-color 320ms ease;
        }
        .svc-orb-inner-listening {
          background: rgba(203, 168, 104, 0.28);
          box-shadow: inset 0 0 32px rgba(226, 200, 142, 0.25), 0 0 40px rgba(203, 168, 104, 0.28);
          border-color: rgba(226, 200, 142, 0.55);
        }
        .svc-orb-inner-speaking {
          background: rgba(226, 200, 142, 0.22);
          box-shadow: 0 0 40px rgba(226, 200, 142, 0.22);
          border-color: rgba(226, 200, 142, 0.42);
          animation: svc-pulse 1.4s ease-in-out infinite;
        }
        .svc-orb-inner-processing {
          background: rgba(203, 168, 104, 0.15);
          animation: svc-pulse 1.6s ease-in-out infinite;
        }
        .svc-orb-inner-ready:hover {
          background: rgba(203, 168, 104, 0.18);
          border-color: rgba(226, 200, 142, 0.5);
        }
        @keyframes svc-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.04); opacity: 0.9; }
        }
        .svc-spark {
          filter: drop-shadow(0 0 20px rgba(226, 200, 142, 0.55));
          display: block;
        }
        .svc-icon-pulse {
          animation: svc-icon-pulse 1.2s ease-in-out infinite;
        }
        @keyframes svc-icon-pulse {
          0%, 100% { opacity: 0.85; }
          50% { opacity: 1; }
        }
        .svc-dots {
          display: inline-flex;
          gap: 8px;
        }
        .svc-dots span {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #e2c88e;
          animation: svc-bounce 1.2s ease-in-out infinite;
        }
        @keyframes svc-bounce {
          0%, 80%, 100% { transform: scale(0.75); opacity: 0.6; }
          40% { transform: scale(1); opacity: 1; }
        }
        .svc-ring {
          position: absolute;
          border-radius: 999px;
          animation: svc-ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .svc-ring-1 {
          inset: 0;
          border: 2px solid rgba(226, 200, 142, 0.28);
        }
        .svc-ring-2 {
          inset: -14px;
          border: 1px solid rgba(203, 168, 104, 0.14);
          animation-delay: 0.5s;
        }
        @keyframes svc-ping {
          0% { transform: scale(0.92); opacity: 0.8; }
          75%, 100% { transform: scale(1.35); opacity: 0; }
        }
        .svc-status {
          margin: 0;
          font-size: 13.5px;
          letter-spacing: 0.04em;
          color: rgba(216, 205, 184, 0.78);
        }
        .svc-transcript {
          width: 100%;
          max-width: 420px;
          max-height: 220px;
          overflow-y: auto;
          display: grid;
          gap: 12px;
          padding: 0 8px;
        }
        .svc-turn {
          display: grid;
          gap: 3px;
          font-size: 13.5px;
          line-height: 1.55;
        }
        .svc-turn-role {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(226, 200, 142, 0.72);
        }
        .svc-turn-text {
          color: #f0e6cf;
        }
        .svc-turn-child {
          text-align: right;
        }
        .svc-turn-child .svc-turn-role {
          color: rgba(216, 205, 184, 0.5);
        }
        .svc-turn-child .svc-turn-text {
          color: rgba(240, 230, 207, 0.72);
        }
        .svc-error {
          color: #f4b8ac;
          font-size: 12.5px;
          margin: 0;
        }
        .svc-endcall {
          display: grid;
          justify-items: center;
          gap: 6px;
        }
        .svc-endcall-btn {
          width: 56px;
          height: 56px;
          border-radius: 999px;
          background: #c2643f;
          color: #fffdf8;
          border: 1px solid #a0522f;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(194, 100, 63, 0.35);
          transition: transform 140ms ease, background 140ms ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .svc-endcall-btn:hover {
          background: #b0552f;
          transform: translateY(-1px);
        }
        .svc-endcall-btn:active {
          transform: translateY(1px);
        }
        .svc-endcall-label {
          margin: 0;
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(216, 205, 184, 0.55);
        }
      `}</style>
    </>
  );
}
