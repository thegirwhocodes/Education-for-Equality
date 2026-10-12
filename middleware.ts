import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isBoardMemberUser } from '@/lib/board-access';
import { SABI_SUBDOMAIN_PAGES } from '@/lib/sabi/site';

// Served verbatim on every host — never rewritten or redirected.
const CRAWLER_FILES = new Set(['/robots.txt', '/sitemap.xml', '/favicon.ico']);

const protectedRoutes = ['/dashboard'];
const advisorBoardRoutes = ['/advisor-board', '/workspace'];
const advisorBoardApiRoutes = ['/api/advisor-board', '/api/workspace'];
const prepilotRoutes = ['/sabi/parents'];
const prepilotApiRoutes = ['/api/sabi/parents'];

function isProtectedPath(path: string) {
  return protectedRoutes.some((route) => path === route || path.startsWith(`${route}/`));
}

function isAdvisorBoardPath(path: string) {
  return advisorBoardRoutes.some((route) => path === route || path.startsWith(`${route}/`));
}

function isAdvisorBoardApiPath(path: string) {
  return advisorBoardApiRoutes.some((route) => path === route || path.startsWith(`${route}/`));
}

function isPrepilotPath(path: string) {
  return prepilotRoutes.some((route) => path === route || path.startsWith(`${route}/`));
}

function isPrepilotApiPath(path: string) {
  return prepilotApiRoutes.some((route) => path === route || path.startsWith(`${route}/`));
}

function normalizeIp(ip: string) {
  const trimmed = ip.trim();
  if (trimmed.startsWith('::ffff:')) return trimmed.slice('::ffff:'.length);
  if (/^\d+\.\d+\.\d+\.\d+:\d+$/.test(trimmed)) return trimmed.slice(0, trimmed.lastIndexOf(':'));
  return trimmed.replace(/^\[|\]$/g, '');
}

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0];
  const ip =
    forwarded ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-vercel-forwarded-for');
  return ip ? normalizeIp(ip) : '';
}

function isAdvisorBoardIpAllowed(request: NextRequest) {
  const allowedIps = (process.env.ADVISOR_BOARD_ALLOWED_IPS || '')
    .split(',')
    .map((ip) => normalizeIp(ip))
    .filter(Boolean);

  if (allowedIps.length === 0) return false;

  const clientIp = getClientIp(request);
  return Boolean(clientIp && allowedIps.includes(clientIp));
}

async function getSupabaseSession(request: NextRequest, response: NextResponse) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const path = request.nextUrl.pathname;
  const isSubdomain = host.startsWith('sabi.');
  const authError =
    request.nextUrl.searchParams.get('error_code') ||
    request.nextUrl.searchParams.get('error_description') ||
    request.nextUrl.searchParams.get('error');

  if (path === '/' && authError) {
    const url = new URL('/sign-in', request.url);
    url.searchParams.set('auth_error', authError);
    return NextResponse.redirect(url);
  }

  if (isSubdomain) {
    if (path === '/') {
      return NextResponse.rewrite(new URL('/sabi', request.url));
    }
    if (path === '/demo') {
      return NextResponse.rewrite(new URL('/sabi-voice', request.url));
    }
    if (path === '/chat') {
      return NextResponse.rewrite(new URL('/sabi-demo', request.url));
    }
    const page = path.replace(/^\/|\/$/g, '');
    if ((SABI_SUBDOMAIN_PAGES as readonly string[]).includes(page)) {
      return NextResponse.rewrite(new URL(`/sabi/${page}`, request.url));
    }
    // Crawler files must be served, not swept into the /demo catch-all below —
    // otherwise the subdomain has no reachable robots.txt or sitemap at all.
    if (!CRAWLER_FILES.has(path) && !path.startsWith('/api/') && !path.startsWith('/_next') && !path.startsWith('/sign') && !path.startsWith('/sabi')) {
      return NextResponse.redirect(new URL('/demo', request.url));
    }
  }

  const response = NextResponse.next({ request });
  const user = await getSupabaseSession(request, response);
  const isAdvisorBoardAllowed = Boolean(user && isBoardMemberUser(user)) || isAdvisorBoardIpAllowed(request);
  const isPrepilotAllowed = Boolean(user) || isAdvisorBoardIpAllowed(request);

  if (!isAdvisorBoardAllowed && isAdvisorBoardApiPath(path)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isPrepilotAllowed && isPrepilotApiPath(path)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isAdvisorBoardAllowed && isAdvisorBoardPath(path)) {
    const url = new URL('/sign-in', request.url);
    url.searchParams.set('redirectTo', `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(url);
  }

  if (!isPrepilotAllowed && isPrepilotPath(path)) {
    const url = new URL('/sign-in', request.url);
    url.searchParams.set('redirectTo', `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(url);
  }

  if (!user && isProtectedPath(path)) {
    const url = new URL('/sign-in', request.url);
    url.searchParams.set('redirectTo', `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    // `txt` and `xml` are excluded so robots.txt and sitemap.xml bypass
    // middleware entirely instead of hitting the subdomain redirect.
    '/((?!_next|monitoring|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|txt|xml|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
