import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/server';
import { isBoardMemberUser } from '@/lib/board-access';
import { findUserByEmail, listWorkspaceUsers } from '@/lib/notion/people';
import { NotionError } from '@/lib/notion/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !isBoardMemberUser(user)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  try {
    const workspaceUsers = await listWorkspaceUsers();
    const notionUser = findUserByEmail(workspaceUsers, user.email);
    return NextResponse.json({
      email: user.email,
      notionUser: notionUser ?? null,
      workspaceUsers,
    });
  } catch (e) {
    if (e instanceof NotionError) {
      return NextResponse.json({ error: e.message, code: e.code }, { status: e.status });
    }
    console.error('[notion/me] unexpected', e);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
