import 'server-only';
import crypto from 'crypto';

// HMAC-signed, expiring tokens that let a board member sign off a task straight
// from their email — no login. The signature (keyed on a server-only secret)
// is what authorizes the action, so the link can't be forged or tampered with.

function secret(): string {
  return process.env.TASK_ACTION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
}

export interface SignOffTokenPayload {
  taskId: string;
  signer: string;
  exp: number;
}

export function createSignOffToken(taskId: string, signer: string, ttlDays = 30): string {
  const body = Buffer.from(
    JSON.stringify({ taskId, signer, exp: Date.now() + ttlDays * 86_400_000 } satisfies SignOffTokenPayload),
  ).toString('base64url');
  const sig = crypto.createHmac('sha256', secret()).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function verifySignOffToken(token: string): SignOffTokenPayload | null {
  const s = secret();
  if (!s || !token || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = crypto.createHmac('sha256', s).update(body).digest('base64url');
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as SignOffTokenPayload;
    if (!payload.taskId || typeof payload.exp !== 'number' || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}
