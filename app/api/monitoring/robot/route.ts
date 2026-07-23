import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// The "robot user": on every run it performs the real sign-up -> confirm ->
// login journey against production Supabase and cleans up after itself. If any
// step breaks, the flow that real users depend on is broken — and we catch it
// before a real user does. This is the check that would have caught the login
// bug proactively.
//
// The Supabase service-role key stays here on Vercel (not in GitHub) — the
// cloud monitor just calls this endpoint.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function sb(path: string, init: RequestInit, key: string) {
  return fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    cache: 'no-store',
  });
}

export async function GET(req: Request) {
  const auth = req.headers.get('authorization');
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  if (!SUPABASE_URL || !ANON || !SERVICE) {
    return NextResponse.json({ ok: false, step: 'config', error: 'supabase env missing' }, { status: 200 });
  }

  const stamp = Date.now();
  const email = `robot-monitor-${stamp}@monitor.eduforequality.org`;
  const password = `Robot-${stamp}-Chk!`;
  let userId: string | null = null;

  const fail = (step: string, error: string) =>
    NextResponse.json({ ok: false, step, error: String(error).slice(0, 200) }, { status: 200 });

  try {
    // 1) sign up (creates the user + password, exactly like the real signup flow)
    const suRes = await sb(
      '/auth/v1/admin/generate_link',
      { method: 'POST', body: JSON.stringify({ type: 'signup', email, password }) },
      SERVICE,
    );
    if (!suRes.ok) return fail('signup', await suRes.text());
    const su = await suRes.json();
    userId = su?.user?.id || su?.id || null;
    if (!userId) return fail('signup', 'no user id returned');

    // 2) confirm the email (simulates the user clicking the confirmation link)
    const cRes = await sb(
      `/auth/v1/admin/users/${userId}`,
      { method: 'PUT', body: JSON.stringify({ email_confirm: true }) },
      SERVICE,
    );
    if (!cRes.ok) return fail('confirm', await cRes.text());

    // 3) log in with the password (the exact thing that was broken before)
    const liRes = await sb(
      '/auth/v1/token?grant_type=password',
      { method: 'POST', headers: { apikey: ANON }, body: JSON.stringify({ email, password }) },
      ANON,
    );
    const li = await liRes.json();
    if (!liRes.ok || !li.access_token) return fail('login', li?.error_description || li?.msg || `HTTP ${liRes.status}`);

    return NextResponse.json({ ok: true, step: 'complete' });
  } catch (e) {
    return fail('exception', e instanceof Error ? e.message : 'unknown');
  } finally {
    // 4) always clean up the throwaway account
    if (userId) {
      try {
        await sb(`/auth/v1/admin/users/${userId}`, { method: 'DELETE' }, SERVICE);
      } catch {
        /* best effort */
      }
    }
  }
}
