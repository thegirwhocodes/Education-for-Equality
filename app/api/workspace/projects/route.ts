import { NextResponse } from 'next/server';
import { handleWorkspaceError, requireWorkspaceUser, workspaceDb } from '@/lib/workspace/server';
import { STT_DEFAULT_TASKS } from '@/lib/workspace/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const g = await requireWorkspaceUser();
  if (g.error) return g.error;
  try {
    const { data, error } = await workspaceDb()
      .from('sabi_work_projects')
      .select('*, owner:sabi_work_people(id,name,email,seat,active), linked_item:sabi_knowledge_items(id,code,type,title,status)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ projects: data ?? [] });
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
  const fromKnowledgeId = typeof body.fromKnowledgeId === 'string' ? body.fromKnowledgeId : null;
  let title = String(body.title || '').trim();
  let summary = String(body.summary || '');
  const createdFrom = fromKnowledgeId ? 'insight' : 'manual';
  try {
    const db = workspaceDb();
    if (fromKnowledgeId && !title) {
      const { data: item } = await db
        .from('sabi_knowledge_items')
        .select('code,title,type')
        .eq('id', fromKnowledgeId)
        .single();
      if (item) {
        title = `${item.code || item.type}: ${item.title}`.slice(0, 120);
        if (!summary) summary = `Spawned from ${item.code || item.type}.`;
      }
    }
    if (!title) return NextResponse.json({ error: 'title_required' }, { status: 400 });
    const { data: project, error } = await db
      .from('sabi_work_projects')
      .insert({
        title,
        status: 'Active',
        linked_knowledge_id: fromKnowledgeId,
        summary,
        created_from: createdFrom,
        due_date: body.dueDate || null,
      })
      .select('*, owner:sabi_work_people(id,name,email,seat,active), linked_item:sabi_knowledge_items(id,code,type,title,status)')
      .single();
    if (error) throw error;

    const seed = Array.isArray(body.tasks)
      ? (body.tasks as unknown[]).map((t) => String(t).trim()).filter(Boolean)
      : [];
    if (!seed.length && fromKnowledgeId) {
      const { data: item } = await db.from('sabi_knowledge_items').select('title,type,product_area').eq('id', fromKnowledgeId).single();
      const blob = `${item?.title || ''} ${item?.type || ''} ${item?.product_area || ''}`.toLowerCase();
      if (/stt|speech|whisper|intron/.test(blob)) seed.push(...STT_DEFAULT_TASKS);
      else seed.push('Scope the work', 'Gather evidence', 'Decide next step');
    }
    if (seed.length) {
      await db.from('sabi_work_tasks').insert(
        seed.map((t) => ({
          title: t,
          status: 'Not started',
          priority: 'P2',
          project_id: project.id,
          linked_knowledge_id: fromKnowledgeId,
          created_by: g.actor,
          notes: '',
        })),
      );
    }
    return NextResponse.json({ project }, { status: 201 });
  } catch (e) {
    return handleWorkspaceError(e);
  }
}
