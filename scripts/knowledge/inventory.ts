/**
 * Inventory archive files as knowledge artifacts.
 * Files stay on disk. This writes path, hash, size, domain, format.
 * Skip WebSearch_/WebFetch_ bulk dumps.
 *
 *   npx tsx scripts/knowledge/inventory.ts
 *   npx tsx --env-file=.env.local scripts/knowledge/inventory.ts --apply
 */
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { ARCHIVE_DOMAINS } from '../../lib/workspace/types';

const here = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(here, '../..');
const repoRoot = path.resolve(appRoot, '..');
const outDir = path.join(here);
const outFile = path.join(outDir, 'artifacts.inventory.json');

const SKIP_DIR = new Set(['node_modules', '.git', '.next', '.vercel', 'dist', 'coverage']);
const EXTRA_ROOTS = ['research-agents', 'pilot'];

function domainFor(rel: string) {
  for (const d of ARCHIVE_DOMAINS) {
    if (rel === d || rel.startsWith(`${d}/`)) return d;
  }
  if (rel.startsWith('research-agents/')) {
    for (const d of ARCHIVE_DOMAINS) {
      if (rel.startsWith(`research-agents/${d}/`)) return d;
    }
    return 'research-agents';
  }
  if (rel.startsWith('pilot/')) return '9. On the Ground';
  return '';
}

function shouldSkipFile(name: string) {
  return (
    name.includes('WebSearch_') ||
    name.includes('WebFetch_') ||
    name === '.DS_Store' ||
    name.endsWith('.map')
  );
}

async function sha256(file: string) {
  const hash = createHash('sha256');
  const stream = createReadStream(file);
  for await (const chunk of stream) hash.update(chunk as Buffer);
  return hash.digest('hex');
}

async function walk(abs: string, rel: string, acc: Array<Record<string, unknown>>) {
  let entries;
  try {
    entries = await readdir(abs, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (SKIP_DIR.has(entry.name) || entry.name.startsWith('.')) continue;
    const nextAbs = path.join(abs, entry.name);
    const nextRel = rel ? `${rel}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      await walk(nextAbs, nextRel, acc);
      continue;
    }
    if (shouldSkipFile(entry.name)) continue;
    const st = await stat(nextAbs);
    if (!st.isFile() || st.size > 40 * 1024 * 1024) continue;
    const ext = path.extname(entry.name).replace('.', '').toLowerCase() || 'file';
    acc.push({
      path: nextRel,
      title: entry.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' '),
      domain: domainFor(nextRel),
      format: ext,
      sha: await sha256(nextAbs),
      byte_size: st.size,
      purpose: '',
    });
  }
}

async function main() {
  const apply = process.argv.includes('--apply');
  const artifacts: Array<Record<string, unknown>> = [];
  for (const domain of ARCHIVE_DOMAINS) {
    await walk(path.join(repoRoot, domain), domain, artifacts);
  }
  for (const extra of EXTRA_ROOTS) {
    await walk(path.join(repoRoot, extra), extra, artifacts);
  }
  await mkdir(outDir, { recursive: true });
  await writeFile(outFile, JSON.stringify({ generatedAt: new Date().toISOString(), count: artifacts.length, artifacts }, null, 2));
  console.log(`Wrote ${artifacts.length} artifacts to ${outFile}`);

  if (!apply) return;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url.includes('placeholder')) {
    console.error('Missing Supabase env; JSON written, nothing applied.');
    process.exit(1);
  }
  const db = createClient(url, key, { auth: { persistSession: false } });
  const chunk = 200;
  for (let i = 0; i < artifacts.length; i += chunk) {
    const slice = artifacts.slice(i, i + chunk).map((row) => ({
      path: row.path,
      title: row.title,
      domain: row.domain,
      format: row.format,
      sha: row.sha,
      byte_size: row.byte_size,
      purpose: row.purpose,
    }));
    const { error } = await db.from('sabi_knowledge_artifacts').upsert(slice, { onConflict: 'path', ignoreDuplicates: true });
    if (error) {
      console.error(error);
      process.exit(1);
    }
  }
  console.log(`Upserted ${artifacts.length} artifact rows.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
