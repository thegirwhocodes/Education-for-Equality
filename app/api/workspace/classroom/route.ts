import { NextResponse } from 'next/server';
import { requireWorkspaceUser, workspaceDb } from '@/lib/workspace/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const g = await requireWorkspaceUser();
  if (g.error) return g.error;

  let phone = false;
  try {
    const res = await fetch('https://api.eduforequality.org/health', {
      cache: 'no-store',
      signal: AbortSignal.timeout(4000),
    });
    phone = res.ok;
  } catch {
    phone = false;
  }

  let learners: Array<Record<string, unknown>> = [];
  try {
    const { data, error } = await workspaceDb()
      .from('sabi_students')
      .select('id,name,phone_number,total_correct,total_wrong,updated_at')
      .order('updated_at', { ascending: false })
      .limit(40);
    if (!error) learners = data ?? [];
  } catch {
    learners = [];
  }

  return NextResponse.json({
    phoneServerUp: phone,
    adminUrl: 'https://api.eduforequality.org/admin/review',
    learners,
  });
}
