'use client';

import { useEffect, useState } from 'react';
import type { NotionPerson, TeamMember } from '@/lib/notion/types';

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .join('');
}

function Avatar({ person }: { person: { name: string; avatarUrl?: string } }) {
  if (person.avatarUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={person.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />;
  }
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-800">
      {initials(person.name)}
    </span>
  );
}

export function TeamTab() {
  const [roster, setRoster] = useState<TeamMember[]>([]);
  const [users, setUsers] = useState<NotionPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/notion/team', { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
        if (!cancelled) {
          setRoster(data.roster ?? []);
          setUsers(data.workspaceUsers ?? []);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Failed to load team');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const rosterEmails = new Set(
    roster.map((r) => r.person?.email?.toLowerCase()).filter(Boolean) as string[],
  );
  const notInRoster = users.filter((u) => u.email && !rosterEmails.has(u.email.toLowerCase()));

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="pb-4">
        <h2 className="text-xl font-bold text-gray-900">Team</h2>
        <p className="text-xs text-gray-500">
          People from Notion — the roster below is the People DB, plus any Notion Guests without a roster entry yet.
        </p>
      </div>

      {error ? (
        <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {error}
        </div>
      ) : null}

      {loading ? (
        <p className="py-10 text-center text-sm text-gray-500">Loading team…</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {roster.map((m) => (
              <div key={m.id} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-start gap-3">
                  <Avatar person={{ name: m.name || m.person?.name || 'Unknown', avatarUrl: m.person?.avatarUrl }} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">{m.name || m.person?.name}</p>
                    {m.person?.email ? (
                      <p className="truncate text-xs text-gray-500">{m.person.email}</p>
                    ) : null}
                    {m.membershipType ? (
                      <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                        {m.membershipType}
                      </span>
                    ) : null}
                  </div>
                </div>
                {m.about ? <p className="mt-3 text-xs leading-5 text-gray-700">{m.about}</p> : null}
              </div>
            ))}
          </div>

          {notInRoster.length ? (
            <div className="mt-8">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                Guests without a roster entry
              </h3>
              <div className="rounded-lg border border-gray-200 bg-white">
                {notInRoster.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 border-b border-gray-100 px-4 py-2.5 last:border-b-0">
                    <Avatar person={u} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">{u.name}</p>
                      <p className="truncate text-xs text-gray-500">{u.email}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Add these to the People database in Notion to give them a proper bio here.
              </p>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
