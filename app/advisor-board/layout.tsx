import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { getCurrentUser } from '@/lib/auth/server';
import { isBoardMemberUser } from '@/lib/board-access';

export const dynamic = 'force-dynamic';

function AccessLimited() {
  return (
    <main className="min-h-screen bg-[#f7fbf9]">
      <section className="border-b border-rose-100 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-rose-800">
            Board access required
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-950">This workspace is limited to board accounts.</h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Sign in with Naomi, Sonia, Richard, or Remi&apos;s approved account to view Sabi evidence and board exports.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/dashboard" className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              Account dashboard
            </Link>
            <Link href="/" className="bg-[var(--primary-dark)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-darker)]">
              Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default async function AdvisorBoardLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/sign-in?redirectTo=/advisor-board/sabi-evidence');
  if (!isBoardMemberUser(user)) return <AccessLimited />;
  return <>{children}</>;
}
