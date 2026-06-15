import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/advisor-board(.*)',
  '/api/advisor-board(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const host = req.headers.get('host') || '';
  const path = req.nextUrl.pathname;
  const isSubdomain = host.startsWith('sabi.');

  // Demo and Sabi API routes are open — no firewall.
  // (Rate limiting on the Hetzner server + upstream API quotas bound credit exposure.)

  // Route sabi.eduforequality.org subdomain paths
  if (isSubdomain) {
    if (path === '/') {
      return NextResponse.rewrite(new URL('/sabi', req.url));
    }
    if (path === '/demo') {
      return NextResponse.rewrite(new URL('/sabi-voice', req.url));
    }
    if (path === '/chat') {
      return NextResponse.rewrite(new URL('/sabi-demo', req.url));
    }
    if (path === '/pricing') {
      return NextResponse.rewrite(new URL('/sabi/pricing', req.url));
    }
    // Any other path on sabi subdomain → redirect to /demo
    if (!path.startsWith('/api/') && !path.startsWith('/_next') && !path.startsWith('/sign')) {
      return NextResponse.redirect(new URL('/demo', req.url));
    }
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals, static files, and Sentry tunnel route
    '/((?!_next|monitoring|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for ALL API routes (including Sabi)
    '/(api|trpc)(.*)',
  ],
};
