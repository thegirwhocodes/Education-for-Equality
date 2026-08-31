import { NextResponse } from 'next/server';
import { handleWorkspaceError, requireWorkspaceUser, workspaceDb } from '@/lib/workspace/server';
import { PARTNER_KINDS } from '@/lib/workspace/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const g = await requireWorkspaceUser();
  if (g.error) return g.error;
  try {
    const { data, error } = await workspaceDb()
      .from('sabi_company_partners')
      .select('id,name,kind,status,notes,linked_knowledge_id,created_at,linked_item:sabi_knowledge_items(id,code,type,title)')
      .order('name');
    if (error) throw error;
    return NextResponse.json({ partners: data ?? [] });
  } catch (e) {
    return handleWorkspaceError(e);
  }
}

export async function POST(req: Request) {
  const g = await requireWorkspaceUser();
  if (g.error) return g.error;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  const name = String(body.name || '').trim();
  if (!name) return NextResponse.json({ error: 'name_required' }, { status: 400 });
  const kind = PARTNER_KINDS.includes(body.kind as (typeof PARTNER_KINDS)[number]) ? body.kind : 'other';
  try {
    const { data, error } = await workspaceDb()
      .from('sabi_company_partners')
      .insert({
        name,
        kind,
        notes: String(body.notes || ''),
        linked_knowledge_id: body.linkedKnowledgeId || null,
      })
      .select('*')
      .single();
    if (error) throw error;
    return NextResponse.json({ partner: data }, { status: 201 });
  } catch (e) {
    return handleWorkspaceError(e);
  }
}
