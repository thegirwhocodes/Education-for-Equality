import { getTask, signOffTask } from '@/lib/notion/tasks';
import { verifySignOffToken } from '@/lib/notion/task-tokens';

export const dynamic = 'force-dynamic';

// Public, no-login sign-off via an HMAC-signed email link.
// GET  -> branded confirmation page (never mutates — safe from email prefetch/scanners)
// POST -> performs the sign-off after the token is re-verified

function shell(title: string, inner: string): Response {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · Education for Equality</title>
<style>
  :root { color-scheme: light; }
  body { margin:0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; background:#f7f4ec; color:#1f2a24; }
  .wrap { max-width:520px; margin:0 auto; padding:56px 24px; }
  .card { background:#fff; border:1px solid #e7e0cf; border-radius:16px; padding:32px; box-shadow:0 10px 40px rgba(45,36,20,.08); }
  .kicker { font-size:12px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:#0a7a55; margin:0 0 10px; }
  h1 { font-size:22px; line-height:1.3; margin:0 0 8px; color:#132a20; }
  p { font-size:15px; line-height:1.6; color:#41514a; margin:8px 0; }
  .task { margin:16px 0; padding:12px 14px; border-left:3px solid #0a7a55; background:#f0f8f3; border-radius:8px; font-weight:600; color:#132a20; }
  button, .btn { display:inline-block; background:#065f46; color:#fff; border:0; padding:13px 22px; border-radius:9px; font-weight:700; font-size:15px; cursor:pointer; text-decoration:none; }
  .muted { font-size:12px; color:#8a938c; margin-top:22px; }
  form { margin-top:20px; }
</style></head><body><div class="wrap"><div class="card">${inner}</div>
<p class="muted" style="text-align:center">Education for Equality · Sabi</p></div></body></html>`;
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' }, status: 200 });
}

const INVALID = () =>
  shell(
    'Link expired',
    `<p class="kicker">Sign-off</p><h1>This link isn't valid anymore</h1>
     <p>It may have expired or already been used. Open the advisor board to sign off there instead.</p>
     <p style="margin-top:20px"><a class="btn" href="https://eduforequality.org/advisor-board">Open advisor board</a></p>`,
  );

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token') || '';
  const payload = verifySignOffToken(token);
  if (!payload) return INVALID();

  let title = 'this task';
  try {
    const task = await getTask(payload.taskId);
    title = task.title || title;
    if (task.status === 'Done' && task.signedOffBy) {
      return shell(
        'Already signed off',
        `<p class="kicker">Sign-off</p><h1>Already done ✓</h1>
         <div class="task">${escapeHtml(title)}</div>
         <p>This task was already signed off by <strong>${escapeHtml(task.signedOffBy)}</strong>. Nothing more to do.</p>`,
      );
    }
  } catch {
    /* fall through — still let them confirm */
  }

  return shell(
    'Sign off',
    `<p class="kicker">Sign-off</p><h1>Ready to sign this off?</h1>
     <div class="task">${escapeHtml(title)}</div>
     <p>Signing off marks this done and puts your name on it as <strong>${escapeHtml(payload.signer)}</strong>.</p>
     <form method="POST" action="/api/tasks/sign-off">
       <input type="hidden" name="token" value="${escapeHtml(token)}">
       <button type="submit">Yes — sign it off ✓</button>
     </form>`,
  );
}

export async function POST(req: Request) {
  let token = '';
  try {
    const ct = req.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      token = (await req.json())?.token || '';
    } else {
      token = String((await req.formData()).get('token') || '');
    }
  } catch {
    /* ignore */
  }
  const payload = verifySignOffToken(token);
  if (!payload) return INVALID();

  try {
    const task = await signOffTask(payload.taskId, payload.signer);
    return shell(
      'Signed off',
      `<p class="kicker">Sign-off</p><h1>Done ✓ Thank you, ${escapeHtml(payload.signer.split(' ')[0])}.</h1>
       <div class="task">${escapeHtml(task.title || 'Task')}</div>
       <p>Signed off just now, with your name on it. Naomi can see it on the board.</p>
       <p style="margin-top:20px"><a class="btn" href="https://eduforequality.org/advisor-board">Open advisor board</a></p>`,
    );
  } catch (e) {
    console.error('[tasks/sign-off POST]', e);
    return shell(
      'Something went wrong',
      `<p class="kicker">Sign-off</p><h1>Couldn't save that</h1>
       <p>Please try again in a moment, or sign off from the advisor board.</p>
       <p style="margin-top:20px"><a class="btn" href="https://eduforequality.org/advisor-board">Open advisor board</a></p>`,
    );
  }
}

function escapeHtml(s: string) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
