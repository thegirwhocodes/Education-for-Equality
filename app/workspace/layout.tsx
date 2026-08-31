import Link from 'next/link';
import { Cormorant_Garamond, Lexend } from 'next/font/google';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { getCurrentUser } from '@/lib/auth/server';
import { boardUserDisplayName, isBoardMemberUser } from '@/lib/board-access';
import WorldNav from './WorldNav';
import './workspace.css';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Sabi Workspace',
  robots: { index: false, follow: false },
};

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--ws-serif',
});

const body = Lexend({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--ws-sans',
});

function AccessLimited() {
  return (
    <main className="min-h-screen bg-[#f7f2e7] px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#9a7536]">Workspace access required</p>
      <h1 className="mt-2 text-3xl font-bold text-[#201a13]">This desk is for Sabi workers.</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-[#4c4438]">
        Sign in with an approved Education for Equality account to open Classroom and Work.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/dashboard" className="border border-[#d9cdaf] px-4 py-2 text-sm font-semibold text-[#201a13]">
          Account dashboard
        </Link>
        <Link href="/" className="bg-[#201a13] px-4 py-2 text-sm font-semibold text-[#f6efe0]">
          Home
        </Link>
      </div>
    </main>
  );
}

export default async function WorkspaceLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/sign-in?redirectTo=/workspace');
  if (!isBoardMemberUser(user)) return <AccessLimited />;

  return (
    <div className={`sabi-workspace ${display.variable} ${body.variable}`}>
      <header className="ws-top">
        <div className="ws-top-row">
          <div>
            <p className="ws-kicker">Sabi</p>
            <h1>Workspace</h1>
          </div>
          <p className="ws-who">{boardUserDisplayName(user)}</p>
        </div>
        <WorldNav />
      </header>
      {children}
    </div>
  );
}
