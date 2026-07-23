import 'server-only';
import { getDefaultFromEmail, getResendClient } from '@/lib/email/resend';

// Dual-channel alerting for the monitoring agent.
// - WhatsApp (via Twilio) so Naomi actually sees it.
// - Email (via Resend) as the guaranteed backup so an alert is never lost,
//   even if the WhatsApp session lapses. This dual delivery is the lock-proof
//   part: one channel failing can't swallow an alert.

export type AlertSeverity = 'info' | 'warning' | 'critical';

function alertEmail(): string {
  return process.env.MONITORING_ALERT_EMAIL?.trim() || 'naomi.ivie04@gmail.com';
}

async function sendWhatsApp(text: string): Promise<boolean> {
  const sid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const token = process.env.TWILIO_AUTH_TOKEN?.trim();
  const from = process.env.TWILIO_WHATSAPP_FROM?.trim(); // e.g. "whatsapp:+14155238886"
  const to = process.env.MONITORING_WHATSAPP_TO?.trim(); // e.g. "whatsapp:+18604367048"
  if (!sid || !token || !from || !to) return false;
  try {
    const body = new URLSearchParams({ From: from, To: to, Body: text });
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });
    return res.ok;
  } catch (e) {
    console.error('[alert] whatsapp send failed', e);
    return false;
  }
}

async function sendEmail(subject: string, text: string): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) return false;
  try {
    await getResendClient().emails.send({
      from: getDefaultFromEmail(),
      to: alertEmail(),
      subject,
      text,
    });
    return true;
  } catch (e) {
    console.error('[alert] email send failed', e);
    return false;
  }
}

const EMOJI: Record<AlertSeverity, string> = { info: 'ℹ️', warning: '⚠️', critical: '🚨' };

// Send a plain-English alert to Naomi over both channels. Returns which
// channels succeeded so callers/logs can see delivery.
export async function sendAlert(
  title: string,
  body: string,
  severity: AlertSeverity = 'warning',
): Promise<{ whatsapp: boolean; email: boolean }> {
  const line = `${EMOJI[severity]} Sabi: ${title}\n\n${body}`;
  const [whatsapp, email] = await Promise.all([
    sendWhatsApp(line),
    sendEmail(`${EMOJI[severity]} Sabi: ${title}`, body),
  ]);
  if (!whatsapp && !email) console.error('[alert] BOTH channels failed:', title);
  return { whatsapp, email };
}
