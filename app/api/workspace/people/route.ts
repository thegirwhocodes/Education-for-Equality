import { NextResponse } from 'next/server';
import { handleWorkspaceError, requireWorkspaceUser, workspaceDb } from '@/lib/workspace/server';
import { SEATS } from '@/lib/workspace/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const g = await requireWorkspaceUser();
  if (g.error) return g.error;
  try {
    const { data, error } = await workspaceDb()
      .from('sabi_work_people')
      .select('id,name,email,seat,active')
      .eq('active', true)
      .order('name');
    if (error) throw error;
    return NextResponse.json({ people: data ?? [] });
  } catch (e) {
    return handleWorkspaceError(e);
  }
}

export async function POST(req: Request) {
  const g = await requireWorkspaceUser();
  if (g.error) return g.error;
  let body: { name?: string; email?: string; seat?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  const name = String(body.name || '').trim();
  if (!name) return NextResponse.json({ error: 'name_required' }, { status: 400 });
  const seat = SEATS.includes(body.seat as (typeof SEATS)[number]) ? body.seat : 'Ops';
  try {
    const { data, error } = await workspaceDb()
      .from('sabi_work_people')
      .insert({
        name,
        email: String(body.email || '').trim() || null,
        seat,
      })
      .select('id,name,email,seat,active')
      .single();
    if (error) throw error;
    return NextResponse.json({ person: data }, { status: 201 });
  } catch (e) {
    return handleWorkspaceError(e);
  }
}
