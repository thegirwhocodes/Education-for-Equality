import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/server';
import { isBoardMemberUser } from '@/lib/board-access';
import { fetchPilotEvidenceCsv } from '@/lib/sabi-evidence';

export const dynamic = 'force-dynamic';

const EXPORT_MODES = new Set(['board', 'evaluator', 'public']);

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
  if (!isBoardMemberUser(user)) return NextResponse.json({ error: 'Board access required' }, { status: 403 });

  const url = new URL(request.url);
  const requestedMode = url.searchParams.get('mode') || 'board';
  const mode = EXPORT_MODES.has(requestedMode) ? requestedMode : 'board';
  const csv = await fetchPilotEvidenceCsv(mode);

  if (csv === null) {
    return NextResponse.json({ error: 'Evidence export unavailable' }, { status: 502 });
  }

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="sabi-pilot-evidence-${mode}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
