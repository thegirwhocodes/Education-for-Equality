import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
]);

// Demo pages locked behind a secret key (pre-release)
// Match both direct paths (/sabi/demo) and subdomain paths (/demo on sabi.*)
const DEMO_PATHS = ['/sabi/demo', '/sabi-voice', '/demo'];

// Sabi API routes that cost money or expose data — require auth
const PROTECTED_API_PATHS = [
  '/api/sabi/stt',
  '/api/sabi/tts',
  '/api/sabi/voice-chat',
  '/api/sabi/session',
  '/api/sabi/student',
];

// AT webhook routes — must stay open (AT calls these directly)
const isATWebhook = (path: string) =>
  path.startsWith('/api/sabi/at/') ||
  path.startsWith('/api/sabi/voice/') ||
  path.startsWith('/api/sabi/sms/');

export default clerkMiddleware(async (auth, req) => {
  const host = req.headers.get('host') || '';
  const path = req.nextUrl.pathname;
  const isSubdomain = host.startsWith('sabi.');

  // Protect expensive Sabi API routes from unauthorized access
  // Allow if: valid demo cookie, valid API key header, or AT webhook
  if (path.startsWith('/api/sabi') && !isATWebhook(path)) {
    const isExactSabiRoot = path === '/api/sabi';
    const isProtectedApi = isExactSabiRoot || PROTECTED_API_PATHS.some((p) => path.startsWith(p));

    if (isProtectedApi) {
      const apiKey = req.headers.get('x-api-key');
      const demoCookie = req.cookies.get('sabi_demo')?.value;
      const secret = process.env.SABI_DEMO_KEY;
      const sabiApiKey = process.env.SABI_API_KEY;

      const hasValidCookie = secret && demoCookie === secret;
      const hasValidApiKey = sabiApiKey && apiKey === sabiApiKey;

      if (!hasValidCookie && !hasValidApiKey) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }
  }

  // Check if this is a gated demo route (chat is gated, voice demo is public)
  const isDemoPath = DEMO_PATHS.some((p) => path.startsWith(p));

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

      // No valid key — show request access page
      return new NextResponse(
        `<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sabi - Request Access</title></head>
<body style="background:#0a1a15;color:white;display:flex;align-items:center;justify-content:center;height:100vh;font-family:system-ui;margin:0;padding:24px">
<div style="text-align:center;max-width:420px">
<div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#0f6b4f,#1a8c6a);display:flex;align-items:center;justify-content:center;margin:0 auto 24px">
<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
</div>
<h1 style="font-size:28px;margin:0 0 8px">Sabi Chat Demo</h1>
<p style="opacity:0.5;margin:0 0 32px;line-height:1.6">This demo is currently invite-only. To request access, send us an email and we'll get back to you.</p>
<a href="mailto:info@eduforequality.org?subject=Sabi%20Chat%20Demo%20Access%20Request&body=Hi%2C%20I'd%20like%20to%20try%20the%20Sabi%20chat%20demo.%20Here's%20a%20bit%20about%20me%3A%0A%0A" style="display:inline-block;background:white;color:#0a1a15;padding:14px 32px;border-radius:12px;font-weight:bold;text-decoration:none;font-size:16px">Request Access</a>
<p style="opacity:0.3;margin-top:24px;font-size:13px">Education for Equality</p>
</div></body></html>`,
        { status: 403, headers: { 'Content-Type': 'text/html' } }
      );
    }
  }

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
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for ALL API routes (including Sabi)
    '/(api|trpc)(.*)',
  ],
};