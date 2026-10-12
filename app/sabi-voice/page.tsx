"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ActiveCallScreen, CallStartScreen } from "@/components/sabi/call/CallScreens";
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

  if (!callActive && callState === "idle") {
    return (
      <CallStartScreen
        student={student}
        nameInput={nameInput}
        onNameChange={setNameInput}
        onStart={startCall}
        onForget={() => {
          localStorage.removeItem("sabi_browser_id");
          setStudent(null);
        }}
        voiceSupported={voiceSupported}
        error={error}
        messages={messages}
      />
    );
  }

  return (
    <ActiveCallScreen
      callState={callState}
      status={statusText[callState]}
      time={formatTime(elapsed)}
      messages={messages}
      error={error}
      onOrbTap={handleOrbTap}
      onEnd={endCall}
    />
  );
}
