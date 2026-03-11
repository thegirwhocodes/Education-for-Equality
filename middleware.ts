import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
]);

// Demo pages locked behind a secret key (pre-release)
// Match both direct paths (/sabi/demo) and subdomain paths (/demo on sabi.*)
const DEMO_PATHS = ['/sabi/demo', '/sabi-voice', '/sabi-demo', '/demo'];

export default clerkMiddleware(async (auth, req) => {
  const host = req.headers.get('host') || '';
  const path = req.nextUrl.pathname;
  const isSubdomain = host.startsWith('sabi.');

  // Check if this is a demo route (before rewrite)
  const isDemoPath = DEMO_PATHS.some((p) => path.startsWith(p)) ||
    (isSubdomain && path.startsWith('/demo'));

  // Demo routes: require ?key=SECRET or sabi_demo cookie (check BEFORE rewrite)
  if (isDemoPath) {
    const secret = process.env.SABI_DEMO_KEY;
    if (secret) {
      const urlKey = req.nextUrl.searchParams.get('key');
      const cookieKey = req.cookies.get('sabi_demo')?.value;

      if (urlKey === secret) {
        // Valid key in URL — set cookie so they don't need it again
        // On subdomain, rewrite /demo → /sabi/demo so the page resolves
        const url = isSubdomain && (path === '/demo' || path.startsWith('/demo/'))
          ? new URL(`/sabi${path}`, req.url)
          : req.url;
        const response = isSubdomain && (path === '/demo' || path.startsWith('/demo/'))
          ? NextResponse.rewrite(url)
          : NextResponse.next();
        response.cookies.set('sabi_demo', secret, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });
        response.headers.set('X-Robots-Tag', 'noindex, nofollow');
        return response;
      }

      if (cookieKey === secret) {
        // On subdomain, rewrite /demo → /sabi/demo so the page resolves
        const response = isSubdomain && (path === '/demo' || path.startsWith('/demo/'))
          ? NextResponse.rewrite(new URL(`/sabi${path}`, req.url))
          : NextResponse.next();
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

  // Route sabi.eduforequality.org to /sabi landing page
  // Only rewrite root and /demo — other paths (sign-in, dashboard, etc.) pass through normally
  if (isSubdomain) {
    if (path === '/') {
      return NextResponse.rewrite(new URL('/sabi', req.url));
    }
    if (path === '/demo' || path.startsWith('/demo/')) {
      return NextResponse.rewrite(new URL(`/sabi${path}`, req.url));
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