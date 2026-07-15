import 'server-only';
import { getDefaultFromEmail, getResendClient } from '@/lib/email/resend';
import type { TaskRecord } from './types';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || 'https://eduforequality.org';

function priorityLine(t: TaskRecord) {
  const bits: string[] = [];
  if (t.priority) bits.push(t.priority);
  if (t.area) bits.push(t.area);
  if (t.dueDate) bits.push(`Due ${new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`);
  return bits.join(' · ');
}

function html(t: TaskRecord, assignerName: string) {
  const meta = priorityLine(t);
  return `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0f172a">
  <p style="margin:0 0 4px 0;font-size:12px;font-weight:600;color:#059669;text-transform:uppercase;letter-spacing:0.14em">New task assigned</p>
  <h1 style="margin:0 0 12px 0;font-size:22px;line-height:1.3;color:#0f172a">${escapeHtml(t.title)}</h1>
  ${meta ? `<p style="margin:0 0 16px 0;font-size:13px;color:#64748b">${escapeHtml(meta)}</p>` : ''}
  ${t.definitionOfDone ? `<div style="border-left:3px solid #10b981;padding:8px 12px;margin:16px 0;background:#f0fdf4;font-size:14px"><strong>Definition of Done:</strong><br>${escapeHtml(t.definitionOfDone)}</div>` : ''}
  ${t.notes ? `<p style="margin:12px 0;font-size:14px;white-space:pre-wrap">${escapeHtml(t.notes)}</p>` : ''}
  <div style="margin-top:24px">
    <a href="${APP_URL}/advisor-board" style="display:inline-block;background:#065f46;color:#fff;padding:10px 16px;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px">Open advisor board</a>
    <a href="${escapeHtml(t.url)}" style="display:inline-block;margin-left:8px;color:#065f46;font-size:14px">or view in Notion →</a>
  </div>
  <p style="margin-top:32px;font-size:12px;color:#94a3b8">Assigned by ${escapeHtml(assignerName)} · You can change status right from the board.</p>
</div>`;
}

function text(t: TaskRecord, assignerName: string) {
  const lines = [
    `New task assigned to you: ${t.title}`,
    '',
    priorityLine(t),
    '',
  ];
  if (t.definitionOfDone) {
    lines.push('Definition of Done:', t.definitionOfDone, '');
  }
  if (t.notes) {
    lines.push(t.notes, '');
  }
  lines.push(`Open the advisor board: ${APP_URL}/advisor-board`);
  lines.push(`Or view in Notion: ${t.url}`);
  lines.push('', `Assigned by ${assignerName}`);
  return lines.filter((l) => l !== null).join('\n');
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export interface AssignmentEmailInput {
  task: TaskRecord;
  toEmails: string[];
  assignerName: string;
}

export async function sendTaskAssignmentEmails(input: AssignmentEmailInput): Promise<{ sent: number; skipped: number }> {
  const targets = input.toEmails.filter(Boolean);
  if (targets.length === 0) return { sent: 0, skipped: 0 };
  if (!process.env.RESEND_API_KEY) {
    console.warn('[task-notifications] RESEND_API_KEY missing — skipping assignment emails');
    return { sent: 0, skipped: targets.length };
  }
  const resend = getResendClient();
  const from = getDefaultFromEmail();
  const subject = `New task: ${input.task.title}`;
  let sent = 0;
  for (const to of targets) {
    try {
      await resend.emails.send({
        from,
        to,
        subject,
        html: html(input.task, input.assignerName),
        text: text(input.task, input.assignerName),
      });
      sent++;
    } catch (e) {
      console.error('[task-notifications] failed to email', to, e);
    }
  }
  return { sent, skipped: targets.length - sent };
}
