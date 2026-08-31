import { NextResponse } from 'next/server';
import {
  handleWorkspaceError,
  MAX_DOC_BYTES,
  requireWorkspaceUser,
  WORK_BUCKET,
  workspaceDb,
} from '@/lib/workspace/server';
import { DOC_TYPES } from '@/lib/workspace/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const g = await requireWorkspaceUser();
  if (g.error) return g.error;
  try {
    const { data, error } = await workspaceDb()
      .from('sabi_work_docs')
      .select('id,title,doc_type,notes,original_filename,content_type,byte_size,uploaded_by,created_at')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ docs: data ?? [] });
  } catch (e) {
    return handleWorkspaceError(e);
  }
}

export async function POST(req: Request) {
  const g = await requireWorkspaceUser();
  if (g.error) return g.error;
  const form = await req.formData();
  const file = form.get('file');
  const title = String(form.get('title') || '').trim();
  const docTypeRaw = String(form.get('docType') || 'Other');
  const notes = String(form.get('notes') || '');
  if (!(file instanceof File) || !file.size) {
    return NextResponse.json({ error: 'file_required' }, { status: 400 });
  }
  if (file.size > MAX_DOC_BYTES) {
    return NextResponse.json({ error: 'file_too_large' }, { status: 413 });
  }
  const docType = DOC_TYPES.includes(docTypeRaw as (typeof DOC_TYPES)[number]) ? docTypeRaw : 'Other';
  const id = crypto.randomUUID();
  const safeName = file.name.replace(/[^\w.\-]+/g, '_').slice(0, 80) || 'upload';
  const storagePath = `${id}/${safeName}`;
  try {
    const db = workspaceDb();
    const bytes = Buffer.from(await file.arrayBuffer());
    const { error: upErr } = await db.storage.from(WORK_BUCKET).upload(storagePath, bytes, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    });
    if (upErr) throw upErr;
    const { data, error } = await db
      .from('sabi_work_docs')
      .insert({
        id,
        title: title || file.name,
        doc_type: docType,
        notes,
        storage_path: storagePath,
        original_filename: file.name,
        content_type: file.type || 'application/octet-stream',
        byte_size: file.size,
        uploaded_by: g.actor,
      })
      .select('id,title,doc_type,notes,original_filename,content_type,byte_size,uploaded_by,created_at')
      .single();
    if (error) throw error;
    return NextResponse.json({ doc: data }, { status: 201 });
  } catch (e) {
    return handleWorkspaceError(e);
  }
}
