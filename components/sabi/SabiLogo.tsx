type SabiMarkProps = {
  size?: number;
  className?: string;
  tone?: "ink" | "yellow";
};

/** Three voice bars inside a handset-shaped tile: Sabi is a voice, not an app. */
export function SabiMark({ size = 32, className = "", tone = "ink" }: SabiMarkProps) {
  const tile = tone === "ink" ? "var(--sabi-ink)" : "var(--sabi-yellow)";
  const bars = tone === "ink" ? "var(--sabi-yellow)" : "var(--sabi-ink)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden="true"
      className={className}
    >
      <rect width="40" height="40" rx="11" fill={tile} />
      <rect x="10" y="15" width="4.5" height="10" rx="2.25" fill={bars} />
      <rect x="17.75" y="9" width="4.5" height="22" rx="2.25" fill={bars} />
      <rect x="25.5" y="13" width="4.5" height="14" rx="2.25" fill={bars} />
    </svg>
  );
}

export function SabiLogo({ className = "", tone = "ink" }: { className?: string; tone?: "ink" | "yellow" }) {
  return (
    <span className={`sabi-logo ${className}`}>
      <SabiMark size={30} tone={tone} />
      <span className="sabi-wordmark">sabi</span>
    </span>
  );
}
