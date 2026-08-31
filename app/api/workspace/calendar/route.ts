import { NextResponse } from 'next/server';
import { handleWorkspaceError, requireWorkspaceUser, workspaceDb } from '@/lib/workspace/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const g = await requireWorkspaceUser();
  if (g.error) return g.error;
  try {
    const db = workspaceDb();
    const [{ data: tasks, error: tErr }, { data: projects, error: pErr }] = await Promise.all([
      db
        .from('sabi_work_tasks')
        .select('id,title,status,priority,due_date,assignee_id,project_id,assignee:sabi_work_people(name)')
        .not('due_date', 'is', null)
        .order('due_date'),
      db.from('sabi_work_projects').select('id,title,status,due_date').not('due_date', 'is', null).order('due_date'),
    ]);
    if (tErr) throw tErr;
    if (pErr) throw pErr;
    return NextResponse.json({ tasks: tasks ?? [], projects: projects ?? [] });
  } catch (e) {
    return handleWorkspaceError(e);
  }
}
