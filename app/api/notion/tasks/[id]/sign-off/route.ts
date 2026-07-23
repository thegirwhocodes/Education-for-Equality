import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/server';
import { boardUserDisplayName, isBoardMemberUser } from '@/lib/board-access';
import { signOffTask } from '@/lib/notion/tasks';
import { NotionError } from '@/lib/notion/client';

export const dynamic = 'force-dynamic';

// Sign off a task from the advisor board: marks it Done and records the
// signed-in board member's name + timestamp as the completion signature.
export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || !isBoardMemberUser(user)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const { id } = await ctx.params;
  if (!id) return NextResponse.json({ error: 'id_required' }, { status: 400 });

  try {
    const task = await signOffTask(id, boardUserDisplayName(user));
    return NextResponse.json({ task });
  } catch (e) {
    if (e instanceof NotionError) {
      return NextResponse.json({ error: e.message, code: e.code }, { status: e.status });
    }
    console.error('[notion/tasks sign-off] unexpected', e);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
