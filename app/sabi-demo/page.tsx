"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
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

export default function SabiDemo() {
  // Text chat state
  const [textMessages, setTextMessages] = useState<Message[]>([]);
  const [textInput, setTextInput] = useState("");
  const [textLoading, setTextLoading] = useState(false);
  const textInputRef = useRef<HTMLInputElement>(null);
  const textInitialized = useRef(false);

  // Voice chat state
  const [voiceMessages, setVoiceMessages] = useState<Message[]>([]);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const voiceInitialized = useRef(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Check voice support
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
    }
  }, []);

  // Send message to Sabi API
  const sendToSabi = useCallback(
    async (
      messages: Message[],
      setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
      setLoading: React.Dispatch<React.SetStateAction<boolean>>,
      speak?: boolean
    ) => {
      setLoading(true);
      try {
        const res = await fetch("/api/sabi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages }),
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
          if (speak) {
            speakText(data.response);
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
    },
    []
  );

  // Initialize both chats with Sabi's greeting
  useEffect(() => {
    if (!textInitialized.current) {
      textInitialized.current = true;
      sendToSabi([], setTextMessages, setTextLoading);
    }
  }, [sendToSabi]);

  useEffect(() => {
    if (!voiceInitialized.current) {
      voiceInitialized.current = true;
      sendToSabi([], setVoiceMessages, setVoiceLoading, true);
    }
  }, [sendToSabi]);

  // Text chat send
  const handleTextSend = () => {
    if (!textInput.trim() || textLoading) return;
    const newMsg: Message = { role: "user", content: textInput.trim() };
    const updated = [...textMessages, newMsg];
    setTextMessages(updated);
    setTextInput("");
    sendToSabi(updated, setTextMessages, setTextLoading);
  };

  // Voice: speak text using Web Speech API
  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    // Try to find a good English voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Female") ||
          v.name.includes("Samantha") ||
          v.name.includes("Google"))
    );
    if (preferred) utterance.voice = preferred;

    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Voice: start listening
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
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

  // Voice send (for programmatic use)
  const handleVoiceSend = (text: string) => {
    if (!text.trim() || voiceLoading) return;
    const newMsg: Message = { role: "user", content: text.trim() };
    const updated = [...voiceMessages, newMsg];
    setVoiceMessages(updated);
    sendToSabi(updated, setVoiceMessages, setVoiceLoading, true);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="bg-[var(--primary-darker)] text-white py-6 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-2">
            Sabi Demo — &quot;To Know&quot;
          </h1>
          <p className="text-lg opacity-90">
            Same lesson, two channels. Text (app) on the left. Voice (phone
            call) on the right.
          </p>
          <p className="text-sm opacity-70 mt-1">
            Lesson: Market Math — Addition &amp; Subtraction with Naira
          </p>
        </div>
      </div>

      {/* Info banner */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="bg-[var(--secondary)] border border-[var(--accent)] rounded-xl px-4 py-3 text-sm text-[var(--primary-darker)]">
          <strong>How it works:</strong> The left panel simulates the{" "}
          <strong>app experience</strong> (child types on a smartphone). The
          right panel simulates the <strong>phone call experience</strong> (child
          speaks on any phone — tap the mic to talk). Both teach the same lesson
          with the same AI. Try having two different conversations!
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
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="font-bold text-lg text-[var(--primary-darker)] mb-3">
            Why Market Math?
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            Research from <strong>Nature (2025)</strong> and a study of{" "}
            <strong>5,997 children in Sokoto, Nigeria (2024)</strong> found that
            children who sell at markets solve the{" "}
            <em>exact same arithmetic</em>{" "}
            <strong>9x more often</strong> when framed as a market transaction
            vs. abstract math (48.5% vs 5.4%). A child who cannot solve
            &quot;15 + 7&quot; on paper CAN solve &quot;a customer gives you
            ₦15 and then buys ₦7 more — how much does she owe?&quot;
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Sabi starts with what children already know — Naira, market
            trading, everyday life — and bridges to formal math.{" "}
            <strong>
              Every child already knows math. They just don&apos;t know they
              know it.
            </strong>
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
