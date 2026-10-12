const KEYS: [string, string][] = [
  ["1", ""],
  ["2", "abc"],
  ["3", "def"],
  ["4", "ghi"],
  ["5", "jkl"],
  ["6", "mno"],
  ["7", "pqrs"],
  ["8", "tuv"],
  ["9", "wxyz"],
  ["*", ""],
  ["0", "+"],
  ["#", ""],
];

const WAVE = [6, 14, 22, 12, 26, 18, 30, 16, 24, 10, 20, 28, 14, 8, 18, 24, 12, 6];

/** A candybar handset mid-call with Sabi. Decorative: the surrounding copy carries the meaning. */
export function FeaturePhone({ timer = "02:41", label = "Lesson 4" }: { timer?: string; label?: string }) {
  return (
    <div className="sabi-phone" aria-hidden="true">
      <div className="sabi-phone-speaker" />
      <div className="sabi-phone-screen">
        <div className="flex items-center justify-between text-[9px] tracking-wider">
          <span>▮▮▮▯ 2G</span>
          <span>▭ 64%</span>
        </div>
        <p className="mt-3 text-[10px] tracking-[0.14em] uppercase opacity-70">Calling</p>
        <p className="sabi-phone-name">Sabi</p>
        <div className="sabi-phone-bars mt-3">
          {WAVE.map((h, i) => (
            <i key={i} style={{ height: h, animationDelay: `${(i % 6) * 0.12}s` }} />
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px]">
          <span>{timer}</span>
          <span className="opacity-70">{label}</span>
        </div>
      </div>
      <div className="sabi-phone-softkeys">
        <span className="bg-[#2a332d]" />
        <span className="bg-[var(--sabi-coral)]" />
      </div>
      <div className="sabi-phone-keys">
        {KEYS.map(([n, letters]) => (
          <div key={n} className="sabi-phone-key">
            {n}
            {letters && <small>{letters}</small>}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Concentric "ringing" circles, centred on the parent's origin. */
export function CallRings({ sizes, pulse }: { sizes: number[]; pulse?: number }) {
  return (
    <div className="sabi-rings" aria-hidden="true">
      {sizes.map((s) => (
        <span key={s} style={{ width: s, height: s }} />
      ))}
      {pulse && <span className="sabi-ring-pulse" style={{ width: pulse, height: pulse }} />}
    </div>
  );
}

/** Phone + rings + two speech bubbles, as used in the home hero. */
export function CallScene() {
  return (
    <div className="relative h-[540px] md:h-[600px] w-full max-w-[480px] mx-auto">
      <CallRings sizes={[300, 440, 580, 720]} pulse={300} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <FeaturePhone />
      </div>
      <div className="sabi-bubble left-0 top-6 md:-left-6 md:top-14 max-w-[210px] md:max-w-[250px]">
        <span className="sabi-bubble-label">Sabi</span>
        If a customer gives you ₦500 and groundnuts cost ₦350, how much change?
      </div>
      <div className="sabi-bubble sabi-bubble-child right-0 bottom-16 md:-right-2 md:bottom-24">
        <span className="sabi-bubble-label">Chidi</span>
        150!
      </div>
    </div>
  );
}
