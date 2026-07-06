"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SabiShellNav() {
  const pathname = usePathname();
  const onPricing = pathname?.startsWith("/sabi/pricing");
  const onDevelopers = pathname?.startsWith("/sabi/developers");
  const ctaHref = onDevelopers ? "/sabi/pricing" : "/sabi/developers";
  const ctaLabel = onDevelopers ? "View pricing" : onPricing ? "Join early access" : "For developers";
  const ctaMobileLabel = onDevelopers ? "Pricing" : onPricing ? "Join list" : "For developers";

  const linkClass = (href: string) => {
    const active = pathname === href || (href !== "/sabi" && pathname?.startsWith(href));
    return active
      ? "text-[var(--sabi-ink)] font-medium"
      : "text-[var(--sabi-muted)] hover:text-[var(--sabi-ink)] transition-colors";
  };

  return (
    <header className="sticky top-0 z-50 border-b sabi-shell-header">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <Link href="/sabi" className="flex items-center gap-3 min-w-0">
          <Image src="/sabi-spark.svg" alt="" width={28} height={30} className="flex-shrink-0 sabi-spark-mark" />
          <div className="min-w-0 leading-tight flex items-baseline gap-2">
            <span className="sabi-wordmark text-xl">Sabi</span>
            {(onPricing || onDevelopers) && (
              <span
                className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{ background: "var(--sabi-gold-soft)", color: "var(--sabi-gold-deep)" }}
              >
                API
              </span>
            )}
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm">
          <Link href="/sabi" className={linkClass("/sabi")}>
            For families
          </Link>
          <Link href="/sabi/pricing" className={linkClass("/sabi/pricing")}>
            API &amp; pricing
          </Link>
          <a href="mailto:info@eduforequality.org" className="text-[var(--sabi-muted)] hover:text-[var(--sabi-ink)] transition-colors">
            Contact
          </a>
        </nav>

        <Link
          href={ctaHref}
          className="sabi-btn-primary px-3 sm:px-4 py-2 text-sm whitespace-nowrap"
        >
          <span className="hidden sm:inline sabi-api-key-label">{ctaLabel}</span>
          <span className="sm:hidden">{ctaMobileLabel}</span>
        </Link>
      </div>
    </header>
  );
}
