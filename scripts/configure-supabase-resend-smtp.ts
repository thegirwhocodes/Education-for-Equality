import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

function readEnvValue(name: string) {
  for (const file of ['.env.supabase-management.local', '.env.local', '.env.vercel']) {
    const path = join(root, file);
    if (!existsSync(path)) continue;

    const line = readFileSync(path, 'utf8')
      .split('\n')
      .find((entry) => entry.startsWith(`${name}=`));

    if (line) return line.slice(name.length + 1).trim().replace(/^['"]|['"]$/g, '');
  }

  return '';
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || readEnvValue('NEXT_PUBLIC_SUPABASE_URL');
const projectRef =
  process.env.SUPABASE_PROJECT_REF ||
  readEnvValue('SUPABASE_PROJECT_REF') ||
  supabaseUrl.match(/^https:\/\/([^.]+)\.supabase\.co/)?.[1];
const accessToken = process.env.SUPABASE_ACCESS_TOKEN || readEnvValue('SUPABASE_ACCESS_TOKEN');
const resendApiKey = process.env.RESEND_API_KEY || readEnvValue('RESEND_API_KEY');
const smtpAdminEmail =
  process.env.SUPABASE_AUTH_SMTP_ADMIN_EMAIL ||
  readEnvValue('SUPABASE_AUTH_SMTP_ADMIN_EMAIL') ||
  process.env.RESEND_FROM_EMAIL ||
  readEnvValue('RESEND_FROM_EMAIL') ||
  'onboarding@resend.dev';
const smtpSenderName =
  process.env.SUPABASE_AUTH_SMTP_SENDER_NAME ||
  readEnvValue('SUPABASE_AUTH_SMTP_SENDER_NAME') ||
  'Education for Equality';
const emailRateLimit = Number(
  process.env.SUPABASE_AUTH_EMAIL_RATE_LIMIT || readEnvValue('SUPABASE_AUTH_EMAIL_RATE_LIMIT') || 30
);
const dryRun = process.argv.includes('--dry-run');

if (!projectRef) {
  throw new Error('Missing Supabase project ref. Set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_PROJECT_REF.');
}

if (!accessToken) {
  throw new Error('Missing SUPABASE_ACCESS_TOKEN.');
}

if (!resendApiKey) {
  throw new Error('Missing RESEND_API_KEY.');
}

const payload: Record<string, boolean | number | string> = {
  external_email_enabled: true,
  mailer_secure_email_change_enabled: true,
  mailer_autoconfirm: false,
  smtp_admin_email: smtpAdminEmail,
  smtp_host: 'smtp.resend.com',
  smtp_port: '465',
  smtp_user: 'resend',
  smtp_pass: resendApiKey,
  smtp_sender_name: smtpSenderName,
  rate_limit_email_sent: emailRateLimit,
};

async function main() {
  if (dryRun) {
    const redacted = { ...payload, smtp_pass: '[redacted]' };
    console.log(JSON.stringify({ projectRef, payload: redacted }, null, 2));
    return;
  }

  const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/config/auth`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase Resend SMTP update failed (${response.status}): ${body}`);
  }

  console.log(`Supabase Auth SMTP now points to Resend for ${smtpSenderName}.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
