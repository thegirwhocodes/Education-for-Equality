import { NextResponse } from 'next/server';
import { handleWorkspaceError, requireWorkspaceUser, workspaceDb } from '@/lib/workspace/server';
import { ITEM_SELECT } from '@/lib/workspace/types';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const g = await requireWorkspaceUser();
  if (g.error) return g.error;
  const status = new URL(req.url).searchParams.get('status') || 'candidate';
  try {
    let q = workspaceDb()
      .from('sabi_knowledge_relationships')
      .select(
        `id,from_id,to_id,rel,confidence,status,origin_session_id,origin_commit_sha,verified_by,verified_at,notes,from_item:sabi_knowledge_items!from_id(${ITEM_SELECT}),to_item:sabi_knowledge_items!to_id(${ITEM_SELECT})`,
      )
      .order('created_at', { ascending: false });
    if (status !== 'all') q = q.eq('status', status);
    const { data, error } = await q;
    if (error) throw error;
    return NextResponse.json({ relationships: data ?? [] });
  } catch (e) {
    return handleWorkspaceError(e);
  }
}
