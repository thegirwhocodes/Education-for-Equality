import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
]);

// Demo pages locked behind a secret key (pre-release)
const isDemoRoute = createRouteMatcher([
  '/sabi/demo(.*)',
  '/sabi-voice(.*)',
  '/sabi-demo(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Route sabi.eduforequality.org/* to /sabi/*
  const host = req.headers.get('host') || '';
  if (host.startsWith('sabi.')) {
    const path = req.nextUrl.pathname;
    // sabi.eduforequality.org/ → /sabi
    // sabi.eduforequality.org/demo → /sabi/demo
    if (path === '/') {
      return NextResponse.rewrite(new URL('/sabi', req.url));
    }
    if (!path.startsWith('/sabi')) {
      return NextResponse.rewrite(new URL(`/sabi${path}`, req.url));
    }
  }

  // Demo routes: require ?key=SECRET or sabi_demo cookie
  if (isDemoRoute(req)) {
    const secret = process.env.SABI_DEMO_KEY;
    if (secret) {
      const urlKey = req.nextUrl.searchParams.get('key');
      const cookieKey = req.cookies.get('sabi_demo')?.value;

      if (urlKey === secret) {
        // Valid key in URL — set cookie so they don't need it again
        const response = NextResponse.next();
        response.cookies.set('sabi_demo', secret, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });
        // Add noindex header
        response.headers.set('X-Robots-Tag', 'noindex, nofollow');
        return response;
      }

      if (cookieKey === secret) {
        const response = NextResponse.next();
        response.headers.set('X-Robots-Tag', 'noindex, nofollow');
        return response;
      }

      // No valid key — block access
      return new NextResponse(
        '<html><body style="background:#0a1a15;color:white;display:flex;align-items:center;justify-content:center;height:100vh;font-family:system-ui"><div style="text-align:center"><h1>Sabi Demo</h1><p style="opacity:0.5">This demo is private. Contact naomi@eduforequality.org for access.</p></div></body></html>',
        { status: 403, headers: { 'Content-Type': 'text/html' } }
      );
    }
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