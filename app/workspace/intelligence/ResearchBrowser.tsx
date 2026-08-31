'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { KnowledgeArtifact, KnowledgeItem } from '@/lib/workspace/types';
import { ARCHIVE_DOMAINS } from '@/lib/workspace/types';

export default function ResearchBrowser({
  title,
  blurb,
  assetsOnly,
}: {
  title: string;
  blurb: string;
  assetsOnly?: boolean;
}) {
  const [domain, setDomain] = useState('');
  const [artifacts, setArtifacts] = useState<KnowledgeArtifact[]>([]);
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const qs = domain ? `?domain=${encodeURIComponent(domain)}` : '';
    const [a, i] = await Promise.all([
      fetch(`/api/workspace/knowledge/artifacts${qs}`),
      fetch(`/api/workspace/knowledge/items${qs}`),
    ]);
    if (a.status === 503 || i.status === 503) {
      setError('Run supabase-sabi-knowledge.sql in the Supabase SQL editor.');
      return;
    }
    if (a.ok) setArtifacts((await a.json()).artifacts ?? []);
    if (i.ok) setItems((await i.json()).items ?? []);
  }, [domain]);

  useEffect(() => {
    void load();
  }, [load]);

  const decisionsByDomain = useMemo(() => {
    const map = new Map<string, KnowledgeItem[]>();
    for (const item of items.filter((x) => x.type === 'decision')) {
      const list = map.get(item.domain) || [];
      list.push(item);
      map.set(item.domain, list);
    }
    return map;
  }, [items]);

  const shown = artifacts.filter((a) =>
    assetsOnly ? /pdf|docx|doc|xlsx|xls|pptx|ppt|mp3|wav|m4a|csv/.test(a.format) : true,
  );

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const art of shown) {
      const key = art.domain || 'Unfiled';
      map.set(key, (map.get(key) || 0) + 1);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [shown]);

  const cards = domain ? shown.slice(0, 80) : [];

  return (
    <div className="ws-body">
      <div className="ws-card">
        <h2>{title}</h2>
        <p className="ws-muted" style={{ margin: '8px 0 14px' }}>
          {blurb}
        </p>
        <div className="ws-form-row" style={{ marginBottom: 16 }}>
          <button type="button" className={!domain ? 'active' : ''} onClick={() => setDomain('')}>
            All domains
          </button>
          {ARCHIVE_DOMAINS.map((d) => (
            <button key={d} type="button" className={domain === d ? 'active' : ''} onClick={() => setDomain(d)}>
              {d.replace(/^\d+\.\s/, '')}
            </button>
          ))}
        </div>
        {error ? <p className="ws-error">{error}</p> : null}
        {!domain ? (
          <table>
            <thead>
              <tr>
                <th>Domain</th>
                <th>Files</th>
              </tr>
            </thead>
            <tbody>
              {counts.map(([name, n]) => (
                <tr key={name} style={{ cursor: 'pointer' }} onClick={() => name !== 'Unfiled' && setDomain(name)}>
                  <td>{name}</td>
                  <td>{n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
        {domain
          ? cards.map((art) => (
              <div key={art.id} className="ws-card" style={{ marginBottom: 12, boxShadow: 'none' }}>
                <h3>{art.title}</h3>
                <div className="ws-muted">
                  {art.domain} · {art.format || 'file'} · {art.path}
                </div>
                <p style={{ margin: '8px 0' }}>
                  {art.purpose || 'Purpose not filled yet — the inventory script records path and hash; purpose is curated.'}
                </p>
                <div className="ws-muted">Last reviewed {art.last_reviewed_at || '—'}</div>
                {(decisionsByDomain.get(art.domain) || []).slice(0, 4).length ? (
                  <p style={{ marginTop: 8 }}>
                    Related decisions:{' '}
                    {(decisionsByDomain.get(art.domain) || []).slice(0, 4).map((d) => (
                      <Link key={d.id} className="ws-link" href={`/workspace/intelligence/items/${d.id}`} style={{ marginRight: 10 }}>
                        {d.code || d.title}
                      </Link>
                    ))}
                  </p>
                ) : null}
              </div>
            ))
          : null}
        {domain && shown.length > 80 ? <p className="ws-muted">Showing 80 of {shown.length}. Inventory is a catalog, not a dump into search.</p> : null}
        {shown.length === 0 && !error ? (
          <p className="ws-muted">No artifacts inventoried yet. Run npm run knowledge:inventory then knowledge:inventory:apply after SQL is applied.</p>
        ) : null}
      </div>
    </div>
  );
}
