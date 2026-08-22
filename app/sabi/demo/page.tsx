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
          if (callActiveRef.current) setTimeout(() => runTurnRef.current?.(), 100);
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
      const message = err instanceof Error ? err.message : "";
      if (/No LLM provider/i.test(message)) {
        setError("Failed to start. Check that API keys are configured.");
      } else if (/busy|try again/i.test(message)) {
        setError("Sabi is busy right now. Please try again in a moment.");
      } else {
        setError("Sabi couldn't start. Please try again in a moment.");
      }
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
        <section className="sd-hero">
          <div className="sd-hero-inner">
            <header className="sd-brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/sabi-spark.svg"
                alt=""
                width={64}
                height={70}
                className="sd-spark"
              />
              <h1 className="sd-display">Sabi</h1>
              <p className="sd-byline">
                <span>/sah&#8209;bee/</span>
                <span className="sd-dot" aria-hidden />
                <span>&ldquo;to know&rdquo; in Nigerian Pidgin</span>
              </p>
              <p className="sd-tagline">
                A voice AI tutor. Any phone, any accent, any child.
              </p>
            </header>

            {!voiceSupported && (
              <div className="sd-alert sd-alert-warn">
                Voice isn&apos;t supported in this browser. Please use Chrome for the demo.
              </div>
            )}

            <div className="sd-card">
              <div className="sd-hairline" aria-hidden />
              <div className="sd-card-body">
                {student ? (
                  <>
                    <p className="sd-kicker">Welcome back</p>
                    <h2 className="sd-card-title">Hi {student.name}</h2>
                    <p className="sd-lead">
                      {student.total_sessions} lesson{student.total_sessions !== 1 ? "s" : ""} saved on this
                      device. Sabi remembers where you left off.
                    </p>
                    <button
                      onClick={startCall}
                      disabled={!voiceSupported}
                      className="sd-btn-primary"
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
                      className="sd-btn-ghost"
                    >
                      Not {student.name}? Start fresh
                    </button>
                  </>
                ) : (
                  <>
                    <p className="sd-kicker">Start a lesson</p>
                    <h2 className="sd-card-title">Say your name, and Sabi listens</h2>
                    <p className="sd-lead">
                      Tell her who you are and tap the call button. She teaches through a warm market
                      scenario, one small idea at a time.
                    </p>
                    <label className="sd-field">
                      <span className="sd-field-label">Your name</span>
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && nameInput.trim() && startCall()}
                        placeholder="Amina"
                        className="sd-input"
                        autoFocus
                      />
                    </label>

                    <button
                      onClick={startCall}
                      disabled={!nameInput.trim() || !voiceSupported}
                      className="sd-btn-primary"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                      </svg>
                      Call Sabi
                    </button>
                    <p className="sd-hint">
                      Tip: put your phone on speaker so you and Sabi can both hear the lesson.
                    </p>
                  </>
                )}
              </div>
            </div>

            {error && <div className="sd-alert sd-alert-error">{error}</div>}

            {messages.length > 0 && (
              <div className="sd-transcript">
                <p className="sd-transcript-title">Last conversation</p>
                <div className="sd-transcript-body">
                  {messages.map((m, i) => (
                    <p key={i} className={m.role === "user" ? "sd-turn sd-turn-child" : "sd-turn sd-turn-sabi"}>
                      <span className="sd-turn-role">{m.role === "user" ? "You" : "Sabi"}</span>
                      {m.content}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <style jsx>{`
          .sd-hero {
            padding: 60px 20px 80px;
            display: flex;
            justify-content: center;
            position: relative;
            min-height: calc(100vh - 80px);
            background:
              radial-gradient(900px 420px at 50% -20%, rgba(203, 168, 104, 0.14), transparent 55%),
              var(--sabi-paper);
          }
          .sd-hero-inner {
            width: 100%;
            max-width: 500px;
            display: grid;
            gap: 22px;
          }
          .sd-brand {
            text-align: center;
            display: grid;
            justify-items: center;
            gap: 4px;
          }
          .sd-spark {
            filter: drop-shadow(0 0 22px rgba(203, 168, 104, 0.42));
            margin-bottom: 10px;
            animation: sd-spark-drift 6s ease-in-out infinite;
          }
          @keyframes sd-spark-drift {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
          }
          .sd-display {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 68px;
            font-weight: 600;
            color: var(--sabi-ink);
            line-height: 0.95;
            letter-spacing: 0.01em;
            margin: 4px 0 8px;
          }
          .sd-byline {
            display: inline-flex;
            gap: 10px;
            align-items: center;
            font-size: 11px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: var(--sabi-muted);
            font-weight: 500;
            margin: 0;
          }
          .sd-dot {
            width: 4px;
            height: 4px;
            border-radius: 999px;
            background: var(--sabi-gold);
          }
          .sd-tagline {
            margin: 14px 0 0;
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 22px;
            line-height: 1.4;
            color: var(--sabi-ink-soft);
            font-weight: 500;
            font-style: italic;
            max-width: 380px;
          }
          .sd-card {
            background: var(--sabi-card);
            border: 1px solid var(--sabi-border);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 30px 60px rgba(45, 36, 20, 0.1), 0 6px 22px rgba(45, 36, 20, 0.06);
            margin-top: 8px;
          }
          .sd-hairline {
            height: 4px;
            background: linear-gradient(90deg, var(--sabi-gold) 0%, var(--sabi-gold-light) 45%, rgba(226, 200, 142, 0) 100%);
          }
          .sd-card-body {
            padding: 34px 34px 30px;
          }
          .sd-kicker {
            margin: 0 0 10px;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            color: var(--sabi-gold-deep);
          }
          .sd-card-title {
            margin: 0;
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 30px;
            font-weight: 600;
            line-height: 1.15;
            letter-spacing: 0.005em;
            color: var(--sabi-ink);
          }
          .sd-lead {
            margin: 14px 0 22px;
            color: var(--sabi-ink-soft);
            font-size: 15px;
            font-weight: 300;
            line-height: 1.65;
          }
          .sd-field {
            display: grid;
            gap: 8px;
            margin-bottom: 18px;
          }
          .sd-field-label {
            font-size: 12px;
            font-weight: 500;
            letter-spacing: 0.03em;
            color: var(--sabi-ink-soft);
          }
          .sd-input {
            width: 100%;
            border: 1px solid var(--sabi-border-strong);
            border-radius: 12px;
            background: #ffffff;
            color: var(--sabi-ink);
            font-family: inherit;
            font-size: 16px;
            font-weight: 300;
            padding: 14px 16px;
            outline: none;
            transition: border-color 140ms ease, box-shadow 140ms ease, background 140ms ease;
          }
          .sd-input::placeholder {
            color: var(--sabi-meta);
          }
          .sd-input:focus {
            border-color: var(--sabi-gold);
            box-shadow: 0 0 0 4px rgba(203, 168, 104, 0.18);
            background: var(--sabi-card);
          }
          .sd-btn-primary {
            width: 100%;
            min-height: 52px;
            border-radius: 13px;
            background: var(--sabi-ink);
            color: #f6efe0;
            border: 1px solid var(--sabi-ink);
            font-family: inherit;
            font-size: 15px;
            font-weight: 500;
            letter-spacing: 0.01em;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: background 140ms ease, box-shadow 140ms ease, transform 140ms ease;
          }
          .sd-btn-primary:hover {
            background: #33291c;
            box-shadow: 0 10px 30px rgba(32, 26, 19, 0.28);
          }
          .sd-btn-primary:active {
            transform: translateY(1px);
          }
          .sd-btn-primary:disabled {
            opacity: 0.55;
            cursor: not-allowed;
            box-shadow: none;
          }
          .sd-btn-ghost {
            width: 100%;
            min-height: 40px;
            margin-top: 10px;
            border-radius: 11px;
            background: transparent;
            color: var(--sabi-gold-deep);
            border: 1px solid transparent;
            font-family: inherit;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: background 140ms ease, border-color 140ms ease, color 140ms ease;
          }
          .sd-btn-ghost:hover {
            background: var(--sabi-gold-wash);
            border-color: var(--sabi-border);
            color: var(--sabi-ink);
          }
          .sd-hint {
            margin: 14px 0 0;
            font-size: 12.5px;
            line-height: 1.55;
            color: var(--sabi-muted);
            font-weight: 300;
          }
          .sd-alert {
            padding: 12px 14px;
            border-radius: 12px;
            font-size: 13px;
            line-height: 1.55;
            border: 1px solid;
            text-align: center;
          }
          .sd-alert-warn {
            background: #faf0da;
            border-color: #ecd3a2;
            color: #9b5b00;
          }
          .sd-alert-error {
            background: #fbeeec;
            border-color: #f0c1ba;
            color: #7d1810;
          }
          .sd-transcript {
            background: var(--sabi-card);
            border: 1px solid var(--sabi-border);
            border-radius: 16px;
            padding: 18px 22px 16px;
            box-shadow: 0 6px 22px rgba(45, 36, 20, 0.05);
          }
          .sd-transcript-title {
            margin: 0 0 10px;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: var(--sabi-gold-deep);
          }
          .sd-transcript-body {
            max-height: 200px;
            overflow-y: auto;
            display: grid;
            gap: 8px;
          }
          .sd-turn {
            margin: 0;
            font-size: 13px;
            line-height: 1.55;
          }
          .sd-turn-role {
            display: block;
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: var(--sabi-gold-deep);
            margin-bottom: 2px;
          }
          .sd-turn-child {
            color: var(--sabi-ink-soft);
          }
          .sd-turn-sabi {
            color: var(--sabi-ink);
          }
          .sd-turn-child .sd-turn-role {
            color: var(--sabi-muted);
          }

          @media (max-width: 640px) {
            .sd-hero {
              padding: 36px 18px 56px;
            }
            .sd-display {
              font-size: 56px;
            }
            .sd-tagline {
              font-size: 19px;
            }
            .sd-card-body {
              padding: 28px 24px 24px;
            }
            .sd-card-title {
              font-size: 26px;
            }
          }
        `}</style>
      </>
    );
  }

  // ─── Active Call Screen ─────────────────────────────────────────
  return (
    <>
      <div className="sd-call">
        <div className="sd-call-top">
          <p className="sd-call-kicker">
            {callState === "connecting" ? "Connecting" : "In session"}
          </p>
          <h2 className="sd-call-title">Sabi</h2>
          <p className="sd-call-time">{formatTime(elapsed)}</p>
        </div>

        <div className="sd-call-center">
          <button
            onClick={handleOrbTap}
            disabled={callState !== "ready"}
            className={`sd-orb sd-orb-${callState}`}
            aria-label={statusText[callState]}
          >
            <div className={`sd-orb-inner sd-orb-inner-${callState}`}>
              {callState === "listening" ? (
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="sd-icon-pulse">
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
                <div className="sd-dots">
                  <span />
                  <span style={{ animationDelay: "0.15s" }} />
                  <span style={{ animationDelay: "0.3s" }} />
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src="/sabi-spark.svg" alt="" width={44} height={48} className="sd-spark-orb" />
              )}
            </div>

            {callState === "listening" && (
              <>
                <div className="sd-ring sd-ring-1" />
                <div className="sd-ring sd-ring-2" />
              </>
            )}
          </button>

          <p className="sd-status">{statusText[callState]}</p>

          <div className="sd-transcript-live">
            {messages.slice(-6).map((m, i) => (
              <div key={i} className={m.role === "user" ? "sd-live-turn sd-live-turn-child" : "sd-live-turn sd-live-turn-sabi"}>
                <span className="sd-live-role">{m.role === "user" ? "You" : "Sabi"}</span>
                <span className="sd-live-text">{m.content}</span>
              </div>
            ))}
          </div>

          {error && <p className="sd-call-error">{error}</p>}
        </div>

        <div className="sd-endcall">
          <button onClick={endCall} className="sd-endcall-btn" aria-label="End call">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08a.956.956 0 0 1-.29-.7c0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28a11.27 11.27 0 0 0-2.67-1.85.996.996 0 0 1-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" />
            </svg>
          </button>
          <p className="sd-endcall-label">End call</p>
        </div>
      </div>

      <style jsx>{`
        .sd-call {
          min-height: calc(100vh - 80px);
          margin: -22px -1px 0;
          padding: 40px 20px 48px;
          background: linear-gradient(180deg, #1b1610 0%, #221b12 60%, #2a2318 100%);
          color: #f1e6cd;
          font-family: 'Lexend', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Arial, sans-serif;
          font-weight: 300;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          border-radius: 0;
        }
        .sd-call-top {
          text-align: center;
          display: grid;
          gap: 4px;
          justify-items: center;
        }
        .sd-call-kicker {
          margin: 0;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(216, 205, 184, 0.6);
        }
        .sd-call-title {
          margin: 0;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 34px;
          font-weight: 600;
          line-height: 1;
          color: #f6ecd6;
          letter-spacing: 0.02em;
        }
        .sd-call-time {
          margin: 4px 0 0;
          font-size: 13px;
          font-variant-numeric: tabular-nums;
          color: rgba(216, 205, 184, 0.68);
        }
        .sd-call-center {
          display: grid;
          justify-items: center;
          gap: 26px;
          width: 100%;
          max-width: 460px;
        }
        .sd-orb {
          position: relative;
          width: 184px;
          height: 184px;
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
        .sd-orb:disabled {
          cursor: default;
        }
        .sd-orb:focus-visible {
          outline: 2px solid var(--sabi-gold);
          outline-offset: 4px;
        }
        .sd-orb-listening {
          transform: scale(1.06);
        }
        .sd-orb-inner {
          width: 140px;
          height: 140px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #f6ecd6;
          border: 1px solid rgba(203, 168, 104, 0.28);
          background: rgba(203, 168, 104, 0.1);
          transition: background 320ms ease, box-shadow 320ms ease, border-color 320ms ease;
        }
        .sd-orb-inner-listening {
          background: rgba(203, 168, 104, 0.3);
          box-shadow: inset 0 0 34px rgba(226, 200, 142, 0.28), 0 0 48px rgba(203, 168, 104, 0.34);
          border-color: rgba(226, 200, 142, 0.55);
        }
        .sd-orb-inner-speaking {
          background: rgba(226, 200, 142, 0.24);
          box-shadow: 0 0 44px rgba(226, 200, 142, 0.26);
          border-color: rgba(226, 200, 142, 0.42);
          animation: sd-pulse 1.4s ease-in-out infinite;
        }
        .sd-orb-inner-processing {
          background: rgba(203, 168, 104, 0.16);
          animation: sd-pulse 1.6s ease-in-out infinite;
        }
        .sd-orb-inner-ready:hover {
          background: rgba(203, 168, 104, 0.18);
          border-color: rgba(226, 200, 142, 0.5);
        }
        @keyframes sd-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.04); opacity: 0.9; }
        }
        .sd-spark-orb {
          filter: drop-shadow(0 0 22px rgba(226, 200, 142, 0.6));
          display: block;
        }
        .sd-icon-pulse {
          animation: sd-icon-pulse 1.2s ease-in-out infinite;
        }
        @keyframes sd-icon-pulse {
          0%, 100% { opacity: 0.85; }
          50% { opacity: 1; }
        }
        .sd-dots {
          display: inline-flex;
          gap: 8px;
        }
        .sd-dots span {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #e2c88e;
          animation: sd-bounce 1.2s ease-in-out infinite;
        }
        @keyframes sd-bounce {
          0%, 80%, 100% { transform: scale(0.75); opacity: 0.6; }
          40% { transform: scale(1); opacity: 1; }
        }
        .sd-ring {
          position: absolute;
          border-radius: 999px;
          animation: sd-ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .sd-ring-1 {
          inset: 0;
          border: 2px solid rgba(226, 200, 142, 0.3);
        }
        .sd-ring-2 {
          inset: -14px;
          border: 1px solid rgba(203, 168, 104, 0.16);
          animation-delay: 0.5s;
        }
        @keyframes sd-ping {
          0% { transform: scale(0.92); opacity: 0.8; }
          75%, 100% { transform: scale(1.35); opacity: 0; }
        }
        .sd-status {
          margin: 0;
          font-size: 14px;
          letter-spacing: 0.04em;
          color: rgba(216, 205, 184, 0.78);
        }
        .sd-transcript-live {
          width: 100%;
          max-width: 420px;
          max-height: 220px;
          overflow-y: auto;
          display: grid;
          gap: 14px;
          padding: 0 6px;
        }
        .sd-live-turn {
          display: grid;
          gap: 3px;
          font-size: 14px;
          line-height: 1.55;
        }
        .sd-live-role {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(226, 200, 142, 0.72);
        }
        .sd-live-text {
          color: #f0e6cf;
        }
        .sd-live-turn-child {
          text-align: right;
        }
        .sd-live-turn-child .sd-live-role {
          color: rgba(216, 205, 184, 0.5);
        }
        .sd-live-turn-child .sd-live-text {
          color: rgba(240, 230, 207, 0.72);
        }
        .sd-call-error {
          color: #f4b8ac;
          font-size: 12.5px;
          margin: 0;
        }
        .sd-endcall {
          display: grid;
          justify-items: center;
          gap: 8px;
        }
        .sd-endcall-btn {
          width: 60px;
          height: 60px;
          border-radius: 999px;
          background: #c2643f;
          color: #fffdf8;
          border: 1px solid #a0522f;
          cursor: pointer;
          box-shadow: 0 10px 28px rgba(194, 100, 63, 0.38);
          transition: transform 140ms ease, background 140ms ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .sd-endcall-btn:hover {
          background: #b0552f;
          transform: translateY(-1px);
        }
        .sd-endcall-btn:active {
          transform: translateY(1px);
        }
        .sd-endcall-label {
          margin: 0;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(216, 205, 184, 0.55);
        }
      `}</style>
    </>
  );
}
