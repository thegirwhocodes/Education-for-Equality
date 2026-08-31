import { NextResponse } from 'next/server';
import { handleWorkspaceError, requireWorkspaceUser, workspaceDb } from '@/lib/workspace/server';

export const dynamic = 'force-dynamic';

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
  if (typeof body.status === 'string') {
    patch.status = body.status;
    if (body.status === 'Done' && body.signOff) {
      patch.signed_off_by = g.actor;
      patch.signed_off_at = new Date().toISOString();
    }
    if (body.status !== 'Done') {
      patch.signed_off_by = null;
      patch.signed_off_at = null;
    }
  }
  if (typeof body.priority === 'string') patch.priority = body.priority;
  if ('assigneeId' in body) patch.assignee_id = body.assigneeId || null;
  if ('dueDate' in body) patch.due_date = body.dueDate || null;
  if (typeof body.notes === 'string') patch.notes = body.notes;
  try {
    const { data, error } = await workspaceDb()
      .from('sabi_work_tasks')
      .update(patch)
      .eq('id', id)
      .select('*, assignee:sabi_work_people(id,name,email,seat,active)')
      .single();
    if (error) throw error;
    return NextResponse.json({ task: data });
  } catch (e) {
    return handleWorkspaceError(e);
  }
}
