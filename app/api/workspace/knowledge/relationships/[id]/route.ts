import { NextResponse } from 'next/server';
import { handleWorkspaceError, requireWorkspaceUser, workspaceDb } from '@/lib/workspace/server';
import { REL_TYPES } from '@/lib/workspace/types';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await requireWorkspaceUser();
  if (g.error) return g.error;
  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  const action = String(body.action || '');
  if (!['accept', 'reject', 'edit'].includes(action)) {
    return NextResponse.json({ error: 'action_required' }, { status: 400 });
  }
  const patch: Record<string, unknown> = {};
  if (action === 'accept') {
    patch.status = 'verified';
    patch.verified_by = g.actor;
    patch.verified_at = new Date().toISOString();
    patch.confidence = body.confidence || 'high';
  } else if (action === 'reject') {
    patch.status = 'rejected';
    patch.verified_by = g.actor;
    patch.verified_at = new Date().toISOString();
  } else {
    if (typeof body.rel === 'string' && (REL_TYPES as readonly string[]).includes(body.rel)) patch.rel = body.rel;
    if (typeof body.notes === 'string') patch.notes = body.notes;
    if (typeof body.confidence === 'string') patch.confidence = body.confidence;
    if (body.status === 'verified' || body.status === 'candidate' || body.status === 'rejected') {
      patch.status = body.status;
      if (body.status === 'verified') {
        patch.verified_by = g.actor;
        patch.verified_at = new Date().toISOString();
      }
    }
  }
  try {
    const db = workspaceDb();
    const { data, error } = await db.from('sabi_knowledge_relationships').update(patch).eq('id', id).select('*').single();
    if (error) throw error;
    await db.from('sabi_knowledge_verifications').insert({
      relationship_id: id,
      action,
      reviewer: g.actor,
      notes: String(body.notes || ''),
    });
    return NextResponse.json({ relationship: data });
  } catch (e) {
    return handleWorkspaceError(e);
  }
}
