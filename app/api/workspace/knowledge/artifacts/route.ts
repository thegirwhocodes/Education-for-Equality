import { NextResponse } from 'next/server';
import { handleWorkspaceError, requireWorkspaceUser, workspaceDb } from '@/lib/workspace/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const g = await requireWorkspaceUser();
  if (g.error) return g.error;
  const url = new URL(req.url);
  const domain = url.searchParams.get('domain');
  const format = url.searchParams.get('format');
  try {
    let q = workspaceDb()
      .from('sabi_knowledge_artifacts')
      .select('id,path,title,domain,format,sha,byte_size,purpose,last_reviewed_at')
      .order('domain')
      .order('title');
    if (domain) q = q.eq('domain', domain);
    if (format) q = q.eq('format', format);
    const { data, error } = await q;
    if (error) throw error;
    return NextResponse.json({ artifacts: data ?? [] });
  } catch (e) {
    return handleWorkspaceError(e);
  }
}
