'use client';

import { useEffect, useMemo, useState } from 'react';
import type { DocRecord } from '@/lib/notion/types';

const statusStyles: Record<string, string> = {
  Draft: 'bg-gray-100 text-gray-700',
  'Needs Review': 'bg-amber-100 text-amber-800',
  Ready: 'bg-emerald-100 text-emerald-800',
  Sent: 'bg-sky-100 text-sky-800',
  Archived: 'bg-zinc-100 text-zinc-500',
};

export function DocsTab() {
  const [docs, setDocs] = useState<DocRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audienceFilter, setAudienceFilter] = useState<string>('all');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/notion/docs', { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
        if (!cancelled) setDocs(data.docs ?? []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Failed to load docs');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const audiences = useMemo(() => {
    const set = new Set<string>();
    docs.forEach((d) => d.audience && set.add(d.audience));
    return ['all', ...Array.from(set).sort()];
  }, [docs]);

  const grouped = useMemo(() => {
    const filtered = audienceFilter === 'all' ? docs : docs.filter((d) => d.audience === audienceFilter);
    const map = new Map<string, DocRecord[]>();
    for (const d of filtered) {
      const key = d.type ?? 'Uncategorized';
      const arr = map.get(key) ?? [];
      arr.push(d);
      map.set(key, arr);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [docs, audienceFilter]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="pb-4">
        <h2 className="text-xl font-bold text-gray-900">Docs & Assets</h2>
        <p className="text-xs text-gray-500">
          Pitch decks, concept notes, grant apps, curriculum packets — the metadata lives in Notion, files live at
          their Link.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {audiences.map((a) => (
          <button
            key={a}
            onClick={() => setAudienceFilter(a)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              audienceFilter === a
                ? 'bg-[var(--primary-dark)] text-white'
                : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-gray-300'
            }`}
          >
            {a === 'all' ? 'All audiences' : a}
          </button>
        ))}
      </div>

      {error ? (
        <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {error}
        </div>
      ) : null}

      {loading ? (
        <p className="py-10 text-center text-sm text-gray-500">Loading docs…</p>
      ) : grouped.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-500">No docs match this filter.</p>
      ) : (
        <div className="space-y-6">
          {grouped.map(([type, items]) => (
            <div key={type}>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-500">{type}</h3>
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        Document
                      </th>
                      <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        Status
                      </th>
                      <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        Audience
                      </th>
                      <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        Next action
                      </th>
                      <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        Open
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((d) => (
                      <tr key={d.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-sm text-gray-900">
                          <span className="font-medium">{d.name || '(untitled)'}</span>
                          {d.version ? (
                            <span className="ml-2 text-[10px] font-semibold text-gray-400">v{d.version}</span>
                          ) : null}
                          {d.notes ? <p className="mt-0.5 text-xs text-gray-500">{d.notes}</p> : null}
                        </td>
                        <td className="px-3 py-2">
                          {d.status ? (
                            <span
                              className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                                statusStyles[d.status] ?? 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {d.status}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-xs text-gray-700">{d.audience ?? '—'}</td>
                        <td className="px-3 py-2 text-xs text-gray-700">{d.nextAction || '—'}</td>
                        <td className="px-3 py-2 text-right text-xs">
                          {d.link ? (
                            <a
                              href={d.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-700 hover:underline"
                            >
                              File ↗
                            </a>
                          ) : null}
                          <a
                            href={d.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-gray-400 hover:text-gray-700"
                          >
                            Notion ↗
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
