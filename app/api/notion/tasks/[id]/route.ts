import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/server';
import { isBoardMemberUser } from '@/lib/board-access';
import { getTask, updateTask } from '@/lib/notion/tasks';
import { NotionError } from '@/lib/notion/client';
import { sendTaskAssignmentEmails } from '@/lib/notion/task-notifications';
import type { TaskArea, TaskPriority, TaskStatus } from '@/lib/notion/types';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || !isBoardMemberUser(user)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const { id } = await ctx.params;
  if (!id) return NextResponse.json({ error: 'id_required' }, { status: 400 });

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  try {
    const priorOwnerIds = Array.isArray(body.ownerIds)
      ? new Set((await getTask(id)).owners.map((o) => o.id))
      : null;

    const task = await updateTask(id, {
      title: typeof body.title === 'string' ? body.title : undefined,
      status: body.status as TaskStatus | undefined,
      priority: body.priority as TaskPriority | undefined,
      area: body.area as TaskArea | undefined,
      ownerIds: Array.isArray(body.ownerIds) ? body.ownerIds : undefined,
      dueDate: body.dueDate === null ? null : typeof body.dueDate === 'string' ? body.dueDate : undefined,
      definitionOfDone: typeof body.definitionOfDone === 'string' ? body.definitionOfDone : undefined,
      notes: typeof body.notes === 'string' ? body.notes : undefined,
    });

    if (priorOwnerIds) {
      const newlyAssigned = task.owners.filter((o) => !priorOwnerIds.has(o.id));
      const assignerEmail = (user as any)?.email ?? 'The board';
      const meEmail = String(assignerEmail).toLowerCase();
      const targets = newlyAssigned
        .map((o) => o.email)
        .filter((e): e is string => !!e && e.toLowerCase() !== meEmail);
      if (targets.length) {
        sendTaskAssignmentEmails({ task, toEmails: targets, assignerName: assignerEmail }).catch((e) =>
          console.error('[notion/tasks PATCH] email dispatch failed', e),
        );
      }
    }

    return NextResponse.json({ task });
  } catch (e) {
    if (e instanceof NotionError) {
      return NextResponse.json({ error: e.message, code: e.code }, { status: e.status });
    }
    console.error('[notion/tasks PATCH] unexpected', e);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
