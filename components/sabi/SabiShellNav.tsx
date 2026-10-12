"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SabiLogo } from "@/components/sabi/SabiLogo";
import { MenuIcon, MicIcon } from "@/components/sabi/marketing/Icons";
import { SABI_PARENT_URL, SABI_PRIMARY_NAV, SABI_ROUTES, isActivePath } from "@/lib/sabi/site";

export default function SabiShellNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const onApi = isActivePath(pathname, SABI_ROUTES.pricing);

  // Close the mobile menu whenever the route changes.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const cta = onApi
    ? { href: SABI_ROUTES.developers, label: "Request API access", short: "API access" }
    : { href: SABI_ROUTES.talk, label: "Talk to Sabi", short: "Talk to Sabi" };

  return (
    <>
    <div className="sabi-parent-strip">
      <p className="max-w-7xl mx-auto px-5 md:px-8">
        Sabi is an initiative of{" "}
        <a href={SABI_PARENT_URL}>
          Education for Equality <span aria-hidden="true">↗</span>
        </a>
      </p>
    </div>
    <header className="sticky top-0 z-50 sabi-shell-header">
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-4">
        <Link href={SABI_ROUTES.home} className="flex items-center gap-2 min-w-0" aria-label="Sabi home">
          <SabiLogo />
          {onApi && <span className="sabi-api-tag">API</span>}
        </Link>

        <nav aria-label="Main" className="hidden lg:flex items-center gap-7 text-[15px]">
          {SABI_PRIMARY_NAV.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`sabi-nav-link ${active ? "is-active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link href={cta.href} className="sabi-btn-primary px-4 py-2 text-sm whitespace-nowrap">
            {!onApi && <MicIcon size={15} />}
            <span className="hidden sm:inline">{cta.label}</span>
            <span className="sm:hidden">{cta.short}</span>
          </Link>
          <button
            type="button"
            className="lg:hidden sabi-menu-button"
            aria-expanded={open}
            aria-controls="sabi-mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>

      <nav
        id="sabi-mobile-nav"
        aria-label="Main"
        hidden={!open}
        className="lg:hidden sabi-mobile-nav"
      >
        <ul className="max-w-7xl mx-auto px-5 md:px-8 py-4">
          {SABI_PRIMARY_NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
                className="sabi-mobile-link"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
    </>
  );
}
