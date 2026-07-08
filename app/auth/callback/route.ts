import { NextResponse, type NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/auth/server';
import { getAppOrigin, safeRedirectPath } from '@/lib/auth/url';

function signInRedirect(authError: string, nextPath: string) {
  const url = new URL('/sign-in', getAppOrigin());
  url.searchParams.set('auth_error', authError);
  url.searchParams.set('redirectTo', nextPath);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = safeRedirectPath(requestUrl.searchParams.get('next'));
  const authError =
    requestUrl.searchParams.get('error_code') ||
    requestUrl.searchParams.get('error_description') ||
    requestUrl.searchParams.get('error');

  if (authError) {
    return signInRedirect(authError, next);
  }

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return signInRedirect(error.message, next);
    }
  }

  return NextResponse.redirect(new URL(next, getAppOrigin()));
}
