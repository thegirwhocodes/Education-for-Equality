import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/server';
import { isBoardMemberUser } from '@/lib/board-access';
import { createTask, listTasks } from '@/lib/notion/tasks';
import { NotionError } from '@/lib/notion/client';
import { sendTaskAssignmentEmails } from '@/lib/notion/task-notifications';
import type { TaskArea, TaskPriority, TaskStatus } from '@/lib/notion/types';

export const dynamic = 'force-dynamic';

async function guard() {
  const user = await getCurrentUser();
  if (!user || !isBoardMemberUser(user)) {
    return { error: NextResponse.json({ error: 'forbidden' }, { status: 403 }) };
  }
  return { user };
}

function handleError(e: unknown) {
  if (e instanceof NotionError) {
    return NextResponse.json({ error: e.message, code: e.code }, { status: e.status });
  }
  console.error('[notion/tasks] unexpected', e);
  return NextResponse.json({ error: 'internal_error' }, { status: 500 });
}

export async function GET(req: Request) {
  const g = await guard();
  if (g.error) return g.error;

  const url = new URL(req.url);
  const view = url.searchParams.get('view') ?? 'open';
  const ownerId = url.searchParams.get('ownerId') || undefined;

  try {
    let tasks;
    if (view === 'done') {
      tasks = await listTasks({ status: ['Done'], ownerId });
    } else if (view === 'all') {
      tasks = await listTasks({ ownerId });
    } else {
      tasks = await listTasks({ excludeStatus: ['Done', 'Dropped'], ownerId });
    }
    return NextResponse.json({ tasks });
  } catch (e) {
    return handleError(e);
  }
}

export async function POST(req: Request) {
  const g = await guard();
  if (g.error) return g.error;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  if (typeof body?.title !== 'string' || !body.title.trim()) {
    return NextResponse.json({ error: 'title_required' }, { status: 400 });
  }

  try {
    const task = await createTask({
      title: body.title.trim(),
      status: body.status as TaskStatus | undefined,
      priority: body.priority as TaskPriority | undefined,
      area: body.area as TaskArea | undefined,
      ownerIds: Array.isArray(body.ownerIds) ? body.ownerIds : undefined,
      dueDate: typeof body.dueDate === 'string' ? body.dueDate : undefined,
      definitionOfDone: typeof body.definitionOfDone === 'string' ? body.definitionOfDone : undefined,
      notes: typeof body.notes === 'string' ? body.notes : undefined,
    });

    const toEmails = task.owners.map((o) => o.email).filter(Boolean) as string[];
    const assignerEmail = (g.user as any)?.email ?? 'The board';
    const meEmail = String(assignerEmail).toLowerCase();
    const targets = toEmails.filter((e) => e.toLowerCase() !== meEmail);
    if (targets.length) {
      sendTaskAssignmentEmails({ task, toEmails: targets, assignerName: assignerEmail }).catch((e) =>
        console.error('[notion/tasks POST] email dispatch failed', e),
      );
    }

    return NextResponse.json({ task }, { status: 201 });
  } catch (e) {
    return handleError(e);
  }
}
