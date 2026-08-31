import { NextResponse } from 'next/server';
import { handleWorkspaceError, requireWorkspaceUser, WORK_BUCKET, workspaceDb } from '@/lib/workspace/server';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await requireWorkspaceUser();
  if (g.error) return g.error;
  const { id } = await params;
  try {
    const db = workspaceDb();
    const { data: doc, error } = await db
      .from('sabi_work_docs')
      .select('storage_path,original_filename,content_type')
      .eq('id', id)
      .single();
    if (error || !doc) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    const { data: file, error: dlErr } = await db.storage.from(WORK_BUCKET).download(doc.storage_path);
    if (dlErr || !file) return NextResponse.json({ error: 'missing_file' }, { status: 404 });
    const buf = Buffer.from(await file.arrayBuffer());
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        'Content-Type': doc.content_type || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(doc.original_filename)}"`,
      },
    });
  } catch (e) {
    return handleWorkspaceError(e);
  }
}
