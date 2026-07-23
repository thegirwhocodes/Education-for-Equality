#!/usr/bin/env node
// Cloud monitor — runs in GitHub Actions every ~5 min, independent of Vercel,
// so it can catch the website/app being down. Checks uptime, new user-facing
// Sentry errors, and the robot-user journey, then alerts Naomi over WhatsApp +
// email ONLY when something newly breaks (state is kept in state.json, cached
// between runs, so ongoing problems don't re-alert every 5 minutes).

import { readFileSync, writeFileSync } from 'node:fs';

const {
  SENTRY_TOKEN, SENTRY_ORG = 'sabi-43',
  TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM, MONITORING_WHATSAPP_TO,
  RESEND_API_KEY, RESEND_FROM = 'Education for Equality <no-reply@eduforequality.org>',
  MONITORING_ALERT_EMAIL, CRON_SECRET, ROBOT_URL,
} = process.env;

const UPTIME = [
  { name: 'Website (eduforequality.org)', url: 'https://eduforequality.org' },
  { name: 'Phone API (api.eduforequality.org)', url: 'https://api.eduforequality.org/health' },
];
const SENTRY_PROJECTS = [
  { slug: 'javascript-nextjs', label: 'Website & sign-in' },
  { slug: 'sabi-server', label: 'Phone pipeline' },
];
const STATE_FILE = 'state.json';

function loadState() {
  try { return JSON.parse(readFileSync(STATE_FILE, 'utf8')); } catch { return {}; }
}
function saveState(s) { writeFileSync(STATE_FILE, JSON.stringify(s, null, 2)); }

async function ping(url) {
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(12000) });
    return r.ok;
  } catch { return false; }
}

async function newUserFacingIssues() {
  if (!SENTRY_TOKEN) return [];
  const out = [];
  for (const p of SENTRY_PROJECTS) {
    try {
      // Only issues first seen in the last 10 minutes = genuinely new.
      const url = `https://sentry.io/api/0/projects/${SENTRY_ORG}/${p.slug}/issues/?query=${encodeURIComponent('is:unresolved user_facing:true age:-10m')}`;
      const r = await fetch(url, { headers: { Authorization: `Bearer ${SENTRY_TOKEN}` } });
      if (!r.ok) continue;
      const issues = await r.json();
      for (const i of Array.isArray(issues) ? issues : []) {
        out.push({ id: i.id, title: i.title || i.metadata?.value || 'error', project: p.label, count: i.count });
      }
    } catch { /* skip */ }
  }
  return out;
}

async function runRobot() {
  if (!ROBOT_URL) return { ok: true, skipped: true };
  try {
    const r = await fetch(ROBOT_URL, { headers: { Authorization: `Bearer ${CRON_SECRET}` }, signal: AbortSignal.timeout(45000) });
    return await r.json();
  } catch (e) {
    return { ok: false, step: 'unreachable', error: String(e).slice(0, 120) };
  }
}

async function whatsapp(text) {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM || !MONITORING_WHATSAPP_TO) return false;
  try {
    const body = new URLSearchParams({ From: TWILIO_WHATSAPP_FROM, To: MONITORING_WHATSAPP_TO, Body: text });
    const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
      method: 'POST',
      headers: { Authorization: `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    return r.ok;
  } catch { return false; }
}

async function email(subject, text) {
  if (!RESEND_API_KEY || !MONITORING_ALERT_EMAIL) return false;
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: RESEND_FROM, to: MONITORING_ALERT_EMAIL, subject, text }),
    });
    return r.ok;
  } catch { return false; }
}

async function alert(title, body) {
  const line = `🚨 Sabi: ${title}\n\n${body}`;
  const [w, e] = await Promise.all([whatsapp(line), email(`🚨 Sabi: ${title}`, body)]);
  console.log(`ALERT "${title}" -> whatsapp:${w} email:${e}`);
}

async function main() {
  const state = loadState();
  state.uptime ??= {};
  state.alertedIssues ??= [];
  state.robot ??= 'ok';

  // 1) Uptime — alert on transitions only
  for (const u of UPTIME) {
    const ok = await ping(u.url);
    const prev = state.uptime[u.name] || 'up';
    if (!ok && prev === 'up') await alert(`${u.name} is DOWN`, `The check couldn't reach ${u.url}. I'll tell you the moment it's back.`);
    if (ok && prev === 'down') await alert(`${u.name} is back UP ✓`, `${u.url} is responding again.`);
    state.uptime[u.name] = ok ? 'up' : 'down';
  }

  // 2) New user-facing errors — alert each new issue once
  const issues = await newUserFacingIssues();
  const already = new Set(state.alertedIssues);
  for (const i of issues) {
    if (already.has(i.id)) continue;
    await alert(`A user hit an error — ${i.project}`, `"${i.title}"${i.count ? ` (${i.count}×)` : ''}\n\nReply and I'll look into it and propose a fix.`);
    state.alertedIssues.push(i.id);
  }
  state.alertedIssues = state.alertedIssues.slice(-200);

  // 3) Robot user — alert on transitions only
  const robot = await runRobot();
  const robotState = robot.ok ? 'ok' : 'fail';
  if (robotState === 'fail' && state.robot === 'ok')
    await alert('Sign-up / login is BROKEN', `The robot user failed at step "${robot.step}": ${robot.error || 'unknown'}. Real users may not be able to get in.`);
  if (robotState === 'ok' && state.robot === 'fail')
    await alert('Sign-up / login is working again ✓', 'The robot user completed sign-up and login successfully.');
  state.robot = robotState;

  saveState(state);
  console.log('monitor tick complete', { uptime: state.uptime, robot: state.robot, newIssues: issues.length });
}

main().catch((e) => { console.error('monitor crashed', e); process.exit(1); });
