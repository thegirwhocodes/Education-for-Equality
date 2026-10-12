"use client";

import { useState } from "react";
import { PlayIcon } from "@/components/sabi/marketing/Icons";

const BARS = [10, 18, 30, 22, 40, 28, 52, 34, 46, 24, 38, 56, 30, 20, 42, 48, 26, 14, 34, 44, 22, 12, 28, 36, 18];

/**
 * A designed poster that only mounts the YouTube iframe on click, so the page
 * doesn't load YouTube's player scripts until someone actually wants the video.
 */
export default function VideoFacade({ id, title, duration }: { id: string; title: string; duration?: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="sabi-video">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="sabi-video-poster group">
          <span className="sabi-video-bars" aria-hidden="true">
            {BARS.map((h, i) => (
              <i key={i} style={{ height: h * 1.6 }} />
            ))}
          </span>
          <span className="sabi-video-play">
            <PlayIcon />
            <span>
              Play the demo
              {duration && <span className="sabi-mono font-normal opacity-70"> · {duration}</span>}
            </span>
          </span>
          <span className="sr-only">{title}</span>
        </button>
      )}
    </div>
  );
}
