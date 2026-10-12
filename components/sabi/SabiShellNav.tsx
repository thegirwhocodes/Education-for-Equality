"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SabiLogo } from "@/components/sabi/SabiLogo";

export default function SabiShellNav() {
  const pathname = usePathname();
  const onPricing = pathname?.startsWith("/sabi/pricing");
  const onDevelopers = pathname?.startsWith("/sabi/developers");
  const ctaHref = onDevelopers ? "/sabi/pricing" : "/sabi/developers";
  const ctaLabel = onDevelopers ? "View pricing" : onPricing ? "Join early access" : "For developers";
  const ctaMobileLabel = onDevelopers ? "Pricing" : onPricing ? "Join list" : "Developers";

  const linkClass = (href: string) => {
    const active = pathname === href || (href !== "/sabi" && pathname?.startsWith(href));
    return active ? "sabi-nav-link is-active" : "sabi-nav-link";
  };

  return (
    <header className="sticky top-0 z-50 sabi-shell-header">
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-4">
        <Link href="/sabi" className="flex items-center gap-2 min-w-0" aria-label="Sabi home">
          <SabiLogo />
          {(onPricing || onDevelopers) && <span className="sabi-api-tag">API</span>}
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[15px]">
          <Link href="/sabi" className={linkClass("/sabi")}>
            For families
          </Link>
          <Link href="/sabi/pricing" className={linkClass("/sabi/pricing")}>
            API &amp; pricing
          </Link>
          <a href="mailto:info@eduforequality.org" className="sabi-nav-link">
            Contact
          </a>
          <a href="https://eduforequality.org" className="sabi-nav-link">
            Education for Equality
          </a>
        </nav>

        <Link href={ctaHref} className="sabi-btn-primary px-4 py-2 text-sm whitespace-nowrap">
          <span className="hidden sm:inline">{ctaLabel}</span>
          <span className="sm:hidden">{ctaMobileLabel}</span>
        </Link>
      </div>
    </header>
  );
}
