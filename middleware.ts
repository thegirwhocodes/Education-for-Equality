import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/advisor-board'];
const protectedApiRoutes = ['/api/advisor-board'];

function isProtectedPath(path: string) {
  return protectedRoutes.some((route) => path === route || path.startsWith(`${route}/`));
}

function isProtectedApiPath(path: string) {
  return protectedApiRoutes.some((route) => path === route || path.startsWith(`${route}/`));
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
    if (path === '/pricing') {
      return NextResponse.rewrite(new URL('/sabi/pricing', request.url));
    }
    if (!path.startsWith('/api/') && !path.startsWith('/_next') && !path.startsWith('/sign')) {
      return NextResponse.redirect(new URL('/demo', request.url));
    }
  }

  const response = NextResponse.next({ request });
  const user = await getSupabaseSession(request, response);

  if (!user && isProtectedApiPath(path)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    '/((?!_next|monitoring|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
