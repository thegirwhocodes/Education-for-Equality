import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const templateDir = join(root, 'supabase/auth-email-templates');
const basePayload = JSON.parse(readFileSync(join(templateDir, 'auth-email-payload.json'), 'utf8')) as Record<string, string>;

function readEnvValue(name: string) {
  for (const file of ['.env.local', '.env.vercel']) {
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
const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
const dryRun = process.argv.includes('--dry-run');

const payload = {
  ...basePayload,
  mailer_templates_confirmation_content: readFileSync(join(templateDir, 'confirmation.html'), 'utf8'),
  mailer_templates_magic_link_content: readFileSync(join(templateDir, 'magic-link.html'), 'utf8'),
  mailer_templates_recovery_content: readFileSync(join(templateDir, 'recovery.html'), 'utf8'),
  mailer_templates_reauthentication_content: readFileSync(join(templateDir, 'reauthentication.html'), 'utf8'),
};

if (!projectRef) {
  throw new Error('Missing Supabase project ref. Set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_PROJECT_REF.');
}

async function main() {
  if (dryRun) {
    console.log(JSON.stringify({ projectRef, payloadKeys: Object.keys(payload) }, null, 2));
    return;
  }

  if (!accessToken) {
    throw new Error('Missing SUPABASE_ACCESS_TOKEN. Create a Supabase PAT with auth config write access, then rerun this script.');
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
    throw new Error(`Supabase auth branding update failed (${response.status}): ${body}`);
  }

  console.log('Supabase auth email templates updated for Education for Equality.');
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
