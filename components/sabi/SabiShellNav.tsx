"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const API_MAIL = "mailto:api@eduforequality.org?subject=Sabi%20API%20access";

export default function SabiShellNav() {
  const pathname = usePathname();
  const onPricing = pathname?.startsWith("/sabi/pricing");

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
            {onPricing && (
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
          href={onPricing ? API_MAIL : "/sabi/pricing"}
          className="sabi-btn-primary px-3 sm:px-4 py-2 text-sm whitespace-nowrap"
        >
          <span className="hidden sm:inline sabi-api-key-label">{onPricing ? "Get API key" : "For developers"}</span>
          <span className="sm:hidden">{onPricing ? "API key" : "For developers"}</span>
        </Link>
      </div>
    </header>
  );
}
