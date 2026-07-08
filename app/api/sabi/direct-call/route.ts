import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/server';
import { isBoardMemberUser } from '@/lib/board-access';

export const runtime = 'nodejs';
export const maxDuration = 15;

type DirectCallBody = {
  phone?: string;
};

function normalizePhone(phone: string) {
  return (phone || '').replace(/[^\d+]/g, '');
}

function sabiBackendUrl() {
  return (
    process.env.SABI_BACKEND_URL ||
    process.env.NEXT_PUBLIC_SABI_BACKEND_URL ||
    'https://api.eduforequality.org'
  ).replace(/\/+$/, '');
}

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, { status });
}

async function readDirectCallBody(request: Request) {
  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return (await request.json().catch(() => ({}))) as DirectCallBody;
  }
  if (
    contentType.includes('application/x-www-form-urlencoded') ||
    contentType.includes('multipart/form-data')
  ) {
    const form = await request.formData();
    return { phone: String(form.get('phone') || '') };
  }
  return {};
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return jsonResponse({ error: 'Sign in required.' }, 401);
  }
  if (!isBoardMemberUser(user)) {
    return jsonResponse({ error: 'Advisor-board access required.' }, 403);
  }

  const apiKey = process.env.SABI_API_KEY;
  if (!apiKey) {
    return jsonResponse({ error: 'Sabi direct-call is not configured.' }, 500);
  }

  const body = await readDirectCallBody(request);
  const phone = normalizePhone(body.phone || '');
  const digitCount = phone.replace(/\D/g, '').length;
  if (digitCount < 8 || digitCount > 16) {
    return jsonResponse({ error: 'Enter a valid phone number.' }, 400);
  }

  const form = new FormData();
  form.set('phone', phone);

  const response = await fetch(`${sabiBackendUrl()}/admin/asterisk/direct-call`, {
    method: 'POST',
    headers: {
      'X-API-Key': apiKey,
    },
    body: form,
    cache: 'no-store',
  });

  const text = await response.text();
  let payload: unknown = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = { raw: text };
  }

  if (!response.ok) {
    return jsonResponse({ error: 'Sabi could not start the call.', detail: payload }, response.status);
  }

  return jsonResponse({
    ok: true,
    status: 'direct_call_initiated',
    phone,
    sabi: payload,
  });
}
