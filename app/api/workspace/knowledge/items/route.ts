import { NextResponse } from 'next/server';
import { handleWorkspaceError, requireWorkspaceUser, workspaceDb } from '@/lib/workspace/server';
import { ITEM_SELECT, KNOWLEDGE_TYPES } from '@/lib/workspace/types';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const g = await requireWorkspaceUser();
  if (g.error) return g.error;
  const url = new URL(req.url);
  const type = url.searchParams.get('type');
  const domain = url.searchParams.get('domain');
  const q = (url.searchParams.get('q') || '').trim();
  const status = url.searchParams.get('status');
  try {
    let query = workspaceDb().from('sabi_knowledge_items').select(ITEM_SELECT).order('decision_date', { ascending: false, nullsFirst: false });
    if (type && (KNOWLEDGE_TYPES as readonly string[]).includes(type)) query = query.eq('type', type);
    if (domain) query = query.eq('domain', domain);
    if (status) query = query.eq('status', status);
    if (q) {
      const like = `%${q}%`;
      query = query.or(`title.ilike.${like},summary.ilike.${like},why_it_matters.ilike.${like},code.ilike.${like}`);
    }
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ items: data ?? [] });
  } catch (e) {
    return handleWorkspaceError(e);
  }
}
