"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { CallRings, FeaturePhone } from "./FeaturePhone";
import { PlayIcon } from "./Icons";

const TURNS = [
  {
    time: "00:17",
    speaker: "Sabi",
    text: "If a customer gives you ₦500 and groundnuts cost ₦350, how much change?",
  },
  { time: "00:29", speaker: "Chidi", text: "₦150." },
  {
    time: "00:31",
    speaker: "Sabi",
    text: "You got it! You already know maths, Chidi.",
  },
  {
    time: "NEXT DAY",
    speaker: "Sabi",
    text: "Welcome back, Chidi. Let’s build on yesterday.",
  },
] as const;

const WAVEFORM = [8, 16, 23, 12, 30, 18, 34, 22, 14, 28, 38, 20, 12, 30, 18, 26, 36, 16, 10, 24, 32, 18, 12, 28];

export default function VoiceCallDemo() {
  const [playing, setPlaying] = useState(false);
  const [activeTurn, setActiveTurn] = useState(0);

  useEffect(() => {
    if (!playing) return;

    const interval = window.setInterval(() => {
      setActiveTurn((turn) => (turn + 1) % TURNS.length);
    }, 2200);

    return () => window.clearInterval(interval);
  }, [playing]);

  function toggleTranscript() {
    if (playing) {
      setPlaying(false);
      return;
    }

    setActiveTurn(0);
    setPlaying(true);
  }

  return (
    <section className="sabi-v2-call-demo" aria-label="Scripted example call with Sabi">
      <div className="sabi-v2-call-demo__top">
        <span className="sabi-v2-call-demo__status">
          <i aria-hidden="true" />
          CALL SAMPLE / CHIDI
        </span>
        <span className="sabi-v2-call-demo__network">2G <span>·</span> 00:31</span>
      </div>

      <div className="sabi-v2-call-demo__grid">
        <div className="sabi-v2-call-demo__phone">
          <CallRings sizes={[250, 350, 450]} pulse={250} />
          <FeaturePhone timer="00:31" label="Subtraction" />
          <span className="sabi-v2-call-demo__phone-note">A $5 handset is enough</span>
        </div>

        <div className="sabi-v2-call-demo__wave-column" aria-hidden="true">
          <span className="sabi-v2-call-demo__wave-label">VOICE<br />PIPELINE</span>
          <div className={`sabi-v2-call-demo__wave ${playing ? "is-playing" : ""}`}>
            {WAVEFORM.map((height, index) => {
              const style = {
                "--wave-height": `${height}px`,
                "--wave-delay": `${(index % 8) * 75}ms`,
              } as CSSProperties;

              return <i key={index} style={style} />;
            })}
          </div>
          <span className="sabi-v2-call-demo__wave-note">LOW-BANDWIDTH</span>
        </div>

        <div className="sabi-v2-call-demo__transcript">
          <div className="sabi-v2-call-demo__transcript-head">
            <div>
              <span className="sabi-v2-call-demo__eyebrow">LIVE TRANSCRIPT</span>
              <p>Market maths</p>
            </div>
            <span className="sabi-v2-call-demo__lesson-tag">LESSON 01</span>
          </div>

          <ol className="sabi-v2-call-demo__turns">
            {TURNS.map((turn, index) => (
              <li
                key={turn.time}
                className={index === activeTurn ? "is-active" : ""}
                aria-current={index === activeTurn ? "step" : undefined}
              >
                <div className="sabi-v2-call-demo__turn-meta">
                  <span>{turn.speaker}</span>
                  <time>{turn.time}</time>
                </div>
                <p>{turn.text}</p>
              </li>
            ))}
          </ol>

          <div className="sabi-v2-call-demo__controls">
            <button type="button" onClick={toggleTranscript} aria-pressed={playing}>
              <span className={`sabi-v2-call-demo__play-icon ${playing ? "is-playing" : ""}`} aria-hidden="true">
                {playing ? <><i /><i /></> : <PlayIcon size={13} />}
              </span>
              {playing ? "Pause transcript" : "Play transcript"}
            </button>
            <span>Scripted preview</span>
          </div>
        </div>
      </div>

      <div className="sabi-v2-call-demo__footer">
        <span>SIMULATED CALL · NO AUDIO STREAMED</span>
        <span>5–7 MINUTES · ONE IDEA</span>
      </div>
    </section>
  );
}
