/**
 * Route map for the Sabi marketing site.
 *
 * Pages live under app/sabi/* so they render on both hosts. Internal links use
 * the /sabi/* path because it resolves on eduforequality.org *and* on the
 * subdomain (middleware lets /sabi/* through). The subdomain also gets clean
 * aliases (/how-it-works -> /sabi/how-it-works) via SABI_SUBDOMAIN_PAGES, and
 * those clean URLs are what each page declares as canonical.
 */

export const SABI_PARENT_URL = "https://eduforequality.org";

export const SABI_ROUTES = {
  home: "/sabi",
  howItWorks: "/sabi/how-it-works",
  evidence: "/sabi/evidence",
  families: "/sabi/families",
  partners: "/sabi/partners",
  about: "/sabi/about",
  pricing: "/sabi/pricing",
  developers: "/sabi/developers",
  // Rewritten to /sabi-voice and /sabi-demo in middleware.ts, on both hosts.
  talk: "/demo",
  chat: "/chat",
} as const;

/** Subdomain paths that rewrite to /sabi/<slug>. Keep in sync with app/sabi/*. */
export const SABI_SUBDOMAIN_PAGES = [
  "how-it-works",
  "evidence",
  "families",
  "partners",
  "about",
  "pricing",
  "developers",
] as const;

export const CONTACT_EMAIL = "info@eduforequality.org";

export type SabiNavItem = { href: string; label: string };

export const SABI_PRIMARY_NAV: SabiNavItem[] = [
  { href: SABI_ROUTES.howItWorks, label: "How it works" },
  { href: SABI_ROUTES.evidence, label: "Evidence" },
  { href: SABI_ROUTES.families, label: "Families" },
  { href: SABI_ROUTES.partners, label: "Partners" },
  { href: SABI_ROUTES.about, label: "About" },
  { href: SABI_ROUTES.pricing, label: "Developers" },
];

export const SABI_FOOTER_NAV: { heading: string; items: SabiNavItem[] }[] = [
  {
    heading: "Sabi",
    items: [
      { href: SABI_ROUTES.howItWorks, label: "How it works" },
      { href: SABI_ROUTES.evidence, label: "Evidence" },
      { href: SABI_ROUTES.talk, label: "Talk to Sabi" },
      { href: SABI_ROUTES.chat, label: "Chat with Sabi" },
    ],
  },
  {
    heading: "Who it's for",
    items: [
      { href: SABI_ROUTES.families, label: "Families" },
      { href: SABI_ROUTES.partners, label: "Schools & funders" },
      { href: SABI_ROUTES.pricing, label: "API & pricing" },
      { href: SABI_ROUTES.developers, label: "Developer access" },
    ],
  },
  {
    heading: "Organisation",
    items: [
      { href: SABI_ROUTES.about, label: "About" },
      { href: "https://eduforequality.org", label: "Education for Equality" },
      { href: `mailto:${CONTACT_EMAIL}`, label: "Contact" },
    ],
  },
];

/** True when `href` is the current page or (for section roots) an ancestor of it. */
export function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === SABI_ROUTES.home) return pathname === href;
  if (href === SABI_ROUTES.pricing) {
    return pathname.startsWith(SABI_ROUTES.pricing) || pathname.startsWith(SABI_ROUTES.developers);
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
