import { NextResponse } from 'next/server';
import { sendAlert, type AlertSeverity } from '@/lib/monitoring/alert';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const ORG = process.env.MONITORING_SENTRY_ORG || 'sabi-43';
const PROJECTS = [
  { slug: 'javascript-nextjs', label: 'Website & sign-in' },
  { slug: 'sabi-server', label: 'Phone pipeline' },
];
const UPTIME = [
  { name: 'Website (eduforequality.org)', url: 'https://eduforequality.org' },
  { name: 'Phone API (api.eduforequality.org)', url: 'https://api.eduforequality.org/health' },
];

async function ping(url: string): Promise<boolean> {
  try {
    const r = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(10_000) });
    return r.ok;
  } catch {
    return false;
  }
}

async function sentryQuery(project: string, query: string, token: string): Promise<any[] | null> {
  try {
    const url = `https://sentry.io/api/0/projects/${ORG}/${project}/issues/?statsPeriod=24h&query=${encodeURIComponent(query)}`;
    const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
    if (!r.ok) return null;
    const data = await r.json();
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  // Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`. Reject anything else.
  const auth = req.headers.get('authorization');
  const isTest = new URL(req.url).searchParams.get('test') === '1';
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const token = process.env.MONITORING_SENTRY_TOKEN;

  // 1) Uptime
  const uptime = await Promise.all(UPTIME.map(async (u) => ({ ...u, ok: await ping(u.url) })));
  const anyDown = uptime.some((u) => !u.ok);

  // 2) Errors in the last 24h (per project: all unresolved, and the user-facing subset)
  let totalErrors = 0;
  let userFacing = 0;
  const projectLines: string[] = [];
  const topIssues: string[] = [];
  if (token) {
    for (const p of PROJECTS) {
      const all = await sentryQuery(p.slug, 'is:unresolved', token);
      const uf = await sentryQuery(p.slug, 'is:unresolved user_facing:true', token);
      const allN = all?.length ?? 0;
      const ufN = uf?.length ?? 0;
      totalErrors += allN;
      userFacing += ufN;
      projectLines.push(`• ${p.label}: ${allN} error${allN === 1 ? '' : 's'}${ufN ? ` (${ufN} that users hit)` : ''}`);
      for (const i of (uf ?? all ?? []).slice(0, 3)) {
        const title = i.title || i.metadata?.value || i.culprit || 'issue';
        topIssues.push(`  – ${title}${i.count ? ` (${i.count}×)` : ''}`);
      }
    }
  } else {
    projectLines.push('• (Sentry token not set — showing uptime only)');
  }

  // 3) Compose a plain-English digest
  const healthy = !anyDown && userFacing === 0;
  const severity: AlertSeverity = anyDown || userFacing > 0 ? 'warning' : 'info';
  const headline = healthy
    ? 'All good today ✓'
    : anyDown
      ? 'Something is DOWN — needs a look'
      : `${userFacing} thing${userFacing === 1 ? '' : 's'} a user hit today`;

  const body = [
    `Daily health check for Sabi.`,
    ``,
    `Uptime:`,
    ...uptime.map((u) => `• ${u.name}: ${u.ok ? 'up ✓' : 'DOWN ✗'}`),
    ``,
    `Errors in the last 24 hours:`,
    ...projectLines,
    ...(topIssues.length ? ['', 'Most recent:', ...topIssues] : []),
    ``,
    healthy
      ? 'Nothing needs you. 🎉'
      : 'Reply and I’ll dig into any of these and propose a fix.',
  ].join('\n');

  const delivery = await sendAlert(headline, body, severity);

  return NextResponse.json({
    ok: true,
    test: isTest,
    healthy,
    uptime,
    totalErrors,
    userFacing,
    delivery,
  });
}
