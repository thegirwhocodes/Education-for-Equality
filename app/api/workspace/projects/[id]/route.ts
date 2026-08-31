import { NextResponse } from 'next/server';
import { handleWorkspaceError, requireWorkspaceUser, workspaceDb } from '@/lib/workspace/server';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await requireWorkspaceUser();
  if (g.error) return g.error;
  const { id } = await params;
  try {
    const db = workspaceDb();
    const { data: project, error } = await db
      .from('sabi_work_projects')
      .select('*, owner:sabi_work_people(id,name,email,seat,active), linked_item:sabi_knowledge_items(id,code,type,title,status,why_it_matters)')
      .eq('id', id)
      .single();
    if (error) throw error;
    const { data: tasks } = await db
      .from('sabi_work_tasks')
      .select('*, assignee:sabi_work_people(id,name,email,seat,active)')
      .eq('project_id', id)
      .order('created_at');
    return NextResponse.json({ project: { ...project, tasks: tasks ?? [] } });
  } catch (e) {
    return handleWorkspaceError(e);
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await requireWorkspaceUser();
  if (g.error) return g.error;
  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof body.title === 'string') patch.title = body.title.trim();
  if (typeof body.status === 'string') patch.status = body.status;
  if (typeof body.summary === 'string') patch.summary = body.summary;
  if ('ownerId' in body) patch.owner_id = body.ownerId || null;
  if ('dueDate' in body) patch.due_date = body.dueDate || null;
  if ('linkedKnowledgeId' in body) patch.linked_knowledge_id = body.linkedKnowledgeId || null;
  try {
    const { data, error } = await workspaceDb()
      .from('sabi_work_projects')
      .update(patch)
      .eq('id', id)
      .select('*, owner:sabi_work_people(id,name,email,seat,active)')
      .single();
    if (error) throw error;
    return NextResponse.json({ project: data });
  } catch (e) {
    return handleWorkspaceError(e);
  }
}
