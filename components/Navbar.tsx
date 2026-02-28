'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
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
            <SignedIn>
              <Link href="/dashboard" className="text-gray-600 hover:text-[var(--primary-dark)] transition-colors">
                My Progress
              </Link>
            </SignedIn>
            <Link href="/about" className="text-gray-600 hover:text-[var(--primary-dark)] transition-colors">
              About
            </Link>
            <Link href="/sabi" className="text-gray-600 hover:text-[var(--primary-dark)] transition-colors">
              Sabi
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <SignedOut>
              <Link href="/sign-in" className="text-gray-600 hover:text-[var(--primary-dark)] transition-colors">
                Log In
              </Link>
              <Link href="/sign-up" className="btn-primary text-sm">
                Sign Up Free
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9"
                  }
                }}
              />
            </SignedIn>
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
              <SignedIn>
                <Link href="/dashboard" className="text-gray-600 hover:text-[var(--primary-dark)]">
                  My Progress
                </Link>
              </SignedIn>
              <Link href="/about" className="text-gray-600 hover:text-[var(--primary-dark)]">
                About
              </Link>
              <Link href="/sabi" className="text-gray-600 hover:text-[var(--primary-dark)]">
                Sabi
              </Link>
              <hr className="border-gray-100" />
              <SignedOut>
                <Link href="/sign-in" className="text-gray-600 hover:text-[var(--primary-dark)]">
                  Log In
                </Link>
                <Link href="/sign-up" className="btn-primary text-center text-sm">
                  Sign Up Free
                </Link>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center gap-3">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-9 h-9"
                      }
                    }}
                  />
                  <span className="text-gray-600">My Account</span>
                </div>
              </SignedIn>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
