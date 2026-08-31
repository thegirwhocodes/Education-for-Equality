import { NextResponse } from 'next/server';
import { handleWorkspaceError, requireWorkspaceUser, workspaceDb } from '@/lib/workspace/server';
import { ITEM_SELECT } from '@/lib/workspace/types';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await requireWorkspaceUser();
  if (g.error) return g.error;
  const { id } = await params;
  try {
    const db = workspaceDb();
    const { data: item, error } = await db.from('sabi_knowledge_items').select(ITEM_SELECT).eq('id', id).single();
    if (error) throw error;
    const [{ data: outbound }, { data: inbound }, { data: projects }, { data: byDomain }, { data: byPath }] = await Promise.all([
      db
        .from('sabi_knowledge_relationships')
        .select(`id,from_id,to_id,rel,confidence,status,origin_session_id,verified_by,verified_at,notes,to_item:sabi_knowledge_items!to_id(${ITEM_SELECT})`)
        .eq('from_id', id),
      db
        .from('sabi_knowledge_relationships')
        .select(`id,from_id,to_id,rel,confidence,status,origin_session_id,verified_by,verified_at,notes,from_item:sabi_knowledge_items!from_id(${ITEM_SELECT})`)
        .eq('to_id', id),
      db
        .from('sabi_work_projects')
        .select('id,title,status,summary,created_from,due_date,linked_knowledge_id')
        .eq('linked_knowledge_id', id),
      db
        .from('sabi_knowledge_artifacts')
        .select('id,path,title,domain,format,purpose,last_reviewed_at,byte_size,sha')
        .eq('domain', item.domain)
        .limit(20),
      item.implements_path
        ? db
            .from('sabi_knowledge_artifacts')
            .select('id,path,title,domain,format,purpose,last_reviewed_at,byte_size,sha')
            .eq('path', item.implements_path)
            .limit(5)
        : Promise.resolve({ data: [] }),
    ]);
    const artifacts = [...(byPath ?? []), ...(byDomain ?? [])].filter(
      (row, idx, all) => all.findIndex((x) => x.id === row.id) === idx,
    );
    return NextResponse.json({
      item,
      outbound: outbound ?? [],
      inbound: inbound ?? [],
      projects: projects ?? [],
      artifacts: artifacts ?? [],
    });
  } catch (e) {
    return handleWorkspaceError(e);
  }
}
