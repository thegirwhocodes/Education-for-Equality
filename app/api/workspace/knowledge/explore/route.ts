import { NextResponse } from 'next/server';
import { handleWorkspaceError, requireWorkspaceUser, workspaceDb } from '@/lib/workspace/server';
import { ITEM_SELECT } from '@/lib/workspace/types';

export const dynamic = 'force-dynamic';

function verified<T extends { status: string }>(rows: T[] | null) {
  return (rows ?? []).filter((r) => r.status === 'verified');
}

export async function GET(req: Request) {
  const g = await requireWorkspaceUser();
  if (g.error) return g.error;
  const q = (new URL(req.url).searchParams.get('q') || '').trim();
  try {
    const db = workspaceDb();
    let itemQuery = db.from('sabi_knowledge_items').select(ITEM_SELECT).order('decision_date', { ascending: false, nullsFirst: false }).limit(40);
    if (q) {
      const like = `%${q}%`;
      itemQuery = itemQuery.or(
        `title.ilike.${like},summary.ilike.${like},why_it_matters.ilike.${like},code.ilike.${like},product_area.ilike.${like}`,
      );
    } else {
      itemQuery = itemQuery.in('type', ['decision', 'principle', 'claim']);
    }
    const { data: items, error } = await itemQuery;
    if (error) throw error;
    const ids = (items ?? []).map((i) => i.id);
    if (ids.length === 0) return NextResponse.json({ q, chains: [] });

    const { data: rels, error: relErr } = await db
      .from('sabi_knowledge_relationships')
      .select(
        `id,from_id,to_id,rel,confidence,status,from_item:sabi_knowledge_items!from_id(${ITEM_SELECT}),to_item:sabi_knowledge_items!to_id(${ITEM_SELECT})`,
      )
      .or(`from_id.in.(${ids.join(',')}),to_id.in.(${ids.join(',')})`);
    if (relErr) throw relErr;
    const live = verified(rels);

    const { data: projects } = await db
      .from('sabi_work_projects')
      .select('id,title,status,linked_knowledge_id')
      .in('linked_knowledge_id', ids);

    const chains = (items ?? []).map((item) => ({
      item,
      evidence: live.filter((r) => r.from_id === item.id && ['supported_by', 'derived_from', 'informed'].includes(r.rel)).map((r) => r.to_item),
      implementations: live.filter((r) => r.to_id === item.id && r.rel === 'implements').map((r) => r.from_item),
      outcomes: live.filter((r) => r.from_id === item.id && ['tested_by', 'produced'].includes(r.rel)).map((r) => r.to_item),
      projects: (projects ?? []).filter((p) => p.linked_knowledge_id === item.id),
    }));
    return NextResponse.json({ q, chains });
  } catch (e) {
    return handleWorkspaceError(e);
  }
}
