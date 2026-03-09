import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Route sabi.eduforequality.org to /sabi page
  const host = req.headers.get('host') || '';
  if (host.startsWith('sabi.') && req.nextUrl.pathname === '/') {
    return NextResponse.rewrite(new URL('/sabi', req.url));
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals, static files, and Sabi API routes (public, no auth)
    '/((?!_next|api/sabi|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes (except Sabi)
    '/(api(?!/sabi)|trpc)(.*)',
  ],
};