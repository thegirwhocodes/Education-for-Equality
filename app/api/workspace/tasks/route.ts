import { NextResponse } from 'next/server';
import { handleWorkspaceError, requireWorkspaceUser, workspaceDb } from '@/lib/workspace/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const g = await requireWorkspaceUser();
  if (g.error) return g.error;
  const url = new URL(req.url);
  const view = url.searchParams.get('view') || 'open';
  const mine = url.searchParams.get('assigneeId');
  try {
    const projectId = url.searchParams.get('projectId');
    let q = workspaceDb()
      .from('sabi_work_tasks')
      .select('*, assignee:sabi_work_people(id,name,email,seat,active), project:sabi_work_projects(id,title,status)')
      .order('due_date', { ascending: true, nullsFirst: false });
    if (view === 'done') q = q.eq('status', 'Done');
    else if (view === 'open') q = q.neq('status', 'Done');
    if (mine) q = q.eq('assignee_id', mine);
    if (projectId) q = q.eq('project_id', projectId);
    const { data, error } = await q;
    if (error) throw error;
    return NextResponse.json({ tasks: data ?? [] });
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
  const title = String(body.title || '').trim();
  if (!title) return NextResponse.json({ error: 'title_required' }, { status: 400 });
  try {
    const { data, error } = await workspaceDb()
      .from('sabi_work_tasks')
      .insert({
        title,
        status: body.status || 'Not started',
        priority: body.priority || 'P2',
        assignee_id: body.assigneeId || null,
        due_date: body.dueDate || null,
        notes: String(body.notes || ''),
        linked_doc_id: body.linkedDocId || null,
        project_id: body.projectId || null,
        linked_knowledge_id: body.linkedKnowledgeId || null,
        created_by: g.actor,
      })
      .select('*, assignee:sabi_work_people(id,name,email,seat,active)')
      .single();
    if (error) throw error;
    return NextResponse.json({ task: data }, { status: 201 });
  } catch (e) {
    return handleWorkspaceError(e);
  }
}
