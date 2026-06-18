'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { MouseEvent } from 'react';
import { useCurrentUser } from '@/lib/auth/useCurrentUser';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn, user, supabase } = useCurrentUser();

  function handleLogoClick(event: MouseEvent<HTMLAnchorElement>) {
    if (window.location.hostname.startsWith('sabi.')) {
      event.preventDefault();
      window.location.href = 'https://eduforequality.org';
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" onClick={handleLogoClick} className="flex items-center gap-2">
            <Image
              src="/tree-icon.png"
              alt="Education for Equality"
              width={36}
              height={36}
              className="h-9 w-9"
              priority
            />
            <span className="font-semibold text-lg text-[var(--primary-darker)]">
              Education for Equality
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/curriculum" className="text-gray-600 hover:text-[var(--primary-dark)] transition-colors">
              Curriculum
            </Link>
            <Link href="/subjects" className="text-gray-600 hover:text-[var(--primary-dark)] transition-colors">
              Subjects
            </Link>
            {isSignedIn && (
              <>
              <Link href="/dashboard" className="text-gray-600 hover:text-[var(--primary-dark)] transition-colors">
                My Progress
              </Link>
              <Link href="/advisor-board" className="text-gray-600 hover:text-[var(--primary-dark)] transition-colors">
                Board
              </Link>
              <Link href="/sabi/prepilot" className="text-gray-600 hover:text-[var(--primary-dark)] transition-colors">
                Pilot
              </Link>
              </>
            )}
            <Link href="/about" className="text-gray-600 hover:text-[var(--primary-dark)] transition-colors">
              About
            </Link>
            <a href="https://sabi.eduforequality.org" className="text-[var(--primary-dark)] font-bold hover:text-[var(--primary-darker)] transition-colors">
              Sabi
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {!isSignedIn ? (
              <>
              <Link href="/sign-in" className="text-gray-600 hover:text-[var(--primary-dark)] transition-colors">
                Log In
              </Link>
              <Link href="/sign-up" className="btn-primary text-sm">
                Sign Up Free
              </Link>
              </>
            ) : (
              <>
                <span className="max-w-40 truncate text-sm text-gray-600">{user?.email}</span>
                <button
                  onClick={signOut}
                  className="text-sm font-semibold text-gray-600 transition-colors hover:text-[var(--primary-dark)]"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <Link href="/curriculum" className="text-gray-600 hover:text-[var(--primary-dark)]">
                Curriculum
              </Link>
              <Link href="/subjects" className="text-gray-600 hover:text-[var(--primary-dark)]">
                Subjects
              </Link>
              {isSignedIn && (
                <>
                <Link href="/dashboard" className="text-gray-600 hover:text-[var(--primary-dark)]">
                  My Progress
                </Link>
                <Link href="/advisor-board" className="text-gray-600 hover:text-[var(--primary-dark)]">
                  Board
                </Link>
                <Link href="/sabi/prepilot" className="text-gray-600 hover:text-[var(--primary-dark)]">
                  Pilot
                </Link>
                </>
              )}
              <Link href="/about" className="text-gray-600 hover:text-[var(--primary-dark)]">
                About
              </Link>
              <a href="https://sabi.eduforequality.org" className="text-[var(--primary-dark)] font-bold hover:text-[var(--primary-darker)]">
                Sabi
              </a>
              <hr className="border-gray-100" />
              {!isSignedIn ? (
                <>
                <Link href="/sign-in" className="text-gray-600 hover:text-[var(--primary-dark)]">
                  Log In
                </Link>
                <Link href="/sign-up" className="btn-primary text-center text-sm">
                  Sign Up Free
                </Link>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="truncate text-gray-600">{user?.email}</span>
                  <button onClick={signOut} className="font-semibold text-[var(--primary-dark)]">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
