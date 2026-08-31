'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const WORLDS = [
  { href: '/workspace', label: 'Home', match: (p: string) => p === '/workspace' },
  { href: '/workspace/product', label: 'Product', match: (p: string) => p.startsWith('/workspace/product') },
  { href: '/workspace/work', label: 'Work', match: (p: string) => p.startsWith('/workspace/work') },
  { href: '/workspace/company', label: 'Company', match: (p: string) => p.startsWith('/workspace/company') },
  {
    href: '/workspace/intelligence',
    label: 'Intelligence',
    match: (p: string) => p.startsWith('/workspace/intelligence'),
  },
] as const;

const SUBNAV: Record<string, { href: string; label: string }[]> = {
  product: [
    { href: '/workspace/product', label: 'Classroom' },
    { href: '/workspace/product/architecture', label: 'Architecture' },
  ],
  work: [
    { href: '/workspace/work', label: 'My work' },
    { href: '/workspace/work/projects', label: 'Projects' },
    { href: '/workspace/work/calendar', label: 'Calendar' },
  ],
  intelligence: [
    { href: '/workspace/intelligence', label: 'Explore' },
    { href: '/workspace/intelligence/decisions', label: 'Decisions' },
    { href: '/workspace/intelligence/research', label: 'Research' },
    { href: '/workspace/intelligence/principles', label: 'Principles' },
    { href: '/workspace/intelligence/claims', label: 'Claims' },
    { href: '/workspace/intelligence/assets', label: 'Assets' },
    { href: '/workspace/intelligence/history', label: 'History' },
    { href: '/workspace/intelligence/review', label: 'Review' },
  ],
};

function worldKey(path: string) {
  if (path.startsWith('/workspace/product')) return 'product';
  if (path.startsWith('/workspace/work')) return 'work';
  if (path.startsWith('/workspace/intelligence')) return 'intelligence';
  return '';
}

export default function WorldNav() {
  const path = usePathname();
  const key = worldKey(path);
  const sub = SUBNAV[key] || [];
  return (
    <div>
      <nav className="ws-worlds">
        {WORLDS.map((w) => (
          <Link key={w.href} href={w.href} className={w.match(path) ? 'active' : ''}>
            {w.label}
          </Link>
        ))}
      </nav>
      {sub.length ? (
        <nav className="ws-subnav">
          {sub.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className={path === s.href || (s.href !== sub[0].href && path.startsWith(s.href)) ? 'active' : ''}
            >
              {s.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
