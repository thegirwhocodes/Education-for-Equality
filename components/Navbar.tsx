'use client';

import Link from 'next/link';
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
            <div className="w-10 h-10 bg-[var(--primary-dark)] rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.18l6 3.75v7.14l-6 3.75-6-3.75V7.93l6-3.75z"/>
                <path d="M12 8a2 2 0 100 4 2 2 0 000-4zm0 6c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <span className="font-semibold text-lg text-[var(--primary-darker)]">
              Education for Equality
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/sabi" className="text-[var(--primary-dark)] font-semibold hover:text-[var(--primary-darker)] transition-colors">
              Literacy & Numeracy
            </Link>
            <Link href="/sabi-demo" className="text-gray-600 hover:text-[var(--primary-dark)] transition-colors">
              Sabi
            </Link>
            <Link href="/curriculum" className="text-gray-600 hover:text-[var(--primary-dark)] transition-colors">
              Curriculum
            </Link>
            <SignedIn>
              <Link href="/dashboard" className="text-gray-600 hover:text-[var(--primary-dark)] transition-colors">
                My Progress
              </Link>
            </SignedIn>
            <Link href="/about" className="text-gray-600 hover:text-[var(--primary-dark)] transition-colors">
              About
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
              <Link href="/sabi" className="text-[var(--primary-dark)] font-semibold hover:text-[var(--primary-darker)]">
                Literacy & Numeracy
              </Link>
              <Link href="/sabi-demo" className="text-gray-600 hover:text-[var(--primary-dark)]">
                Sabi
              </Link>
              <Link href="/curriculum" className="text-gray-600 hover:text-[var(--primary-dark)]">
                Curriculum
              </Link>
              <SignedIn>
                <Link href="/dashboard" className="text-gray-600 hover:text-[var(--primary-dark)]">
                  My Progress
                </Link>
              </SignedIn>
              <Link href="/about" className="text-gray-600 hover:text-[var(--primary-dark)]">
                About
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