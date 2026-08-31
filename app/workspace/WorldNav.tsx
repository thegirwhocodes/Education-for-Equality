'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function WorldNav() {
  const path = usePathname();
  const classroom = path === '/workspace';
  const work = path.startsWith('/workspace/work');
  return (
    <nav className="ws-worlds">
      <Link href="/workspace" className={classroom ? 'active' : ''}>
        Classroom
      </Link>
      <Link href="/workspace/work" className={work ? 'active' : ''}>
        Work
      </Link>
    </nav>
  );
}
