import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/server';
import { boardUserDisplayName, isBoardMemberUser } from '@/lib/board-access';

export const WORK_BUCKET = 'sabi-work';
export const MAX_DOC_BYTES = 25 * 1024 * 1024;

export function workspaceDb(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url.includes('placeholder')) {
    throw new Error('supabase_not_configured');
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function requireWorkspaceUser() {
  const user = await getCurrentUser();
  if (!user || !isBoardMemberUser(user)) {
    return {
      error: NextResponse.json({ error: 'forbidden' }, { status: 403 }),
      user: null,
      actor: '',
    };
  }
  return { error: null, user, actor: boardUserDisplayName(user) };
}

export function handleWorkspaceError(e: unknown) {
  const message = e instanceof Error ? e.message : 'internal_error';
  if (message === 'supabase_not_configured') {
    return NextResponse.json({ error: 'supabase_not_configured' }, { status: 503 });
  }
  const blob = `${message} ${JSON.stringify(e)}`;
  if (/sabi_work_|sabi_knowledge_|sabi_company_|schema cache|does not exist|PGRST/i.test(blob)) {
    return NextResponse.json({ error: 'work_tables_missing' }, { status: 503 });
  }
  console.error('[workspace]', e);
  return NextResponse.json({ error: 'internal_error' }, { status: 500 });
}
