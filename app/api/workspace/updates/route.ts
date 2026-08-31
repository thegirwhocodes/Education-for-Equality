import { NextResponse } from 'next/server';
import { handleWorkspaceError, requireWorkspaceUser, workspaceDb } from '@/lib/workspace/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const g = await requireWorkspaceUser();
  if (g.error) return g.error;
  try {
    const { data, error } = await workspaceDb()
      .from('sabi_work_updates')
      .select('id,task_id,author,body,created_at')
      .order('created_at', { ascending: false })
      .limit(80);
    if (error) throw error;
    return NextResponse.json({ updates: data ?? [] });
  } catch (e) {
    return handleWorkspaceError(e);
  }
}

export async function POST(req: Request) {
  const g = await requireWorkspaceUser();
  if (g.error) return g.error;
  let body: { body?: string; taskId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  const text = String(body.body || '').trim();
  if (!text) return NextResponse.json({ error: 'body_required' }, { status: 400 });
  try {
    const { data, error } = await workspaceDb()
      .from('sabi_work_updates')
      .insert({
        body: text,
        task_id: body.taskId || null,
        author: g.actor,
      })
      .select('id,task_id,author,body,created_at')
      .single();
    if (error) throw error;
    return NextResponse.json({ update: data }, { status: 201 });
  } catch (e) {
    return handleWorkspaceError(e);
  }
}
