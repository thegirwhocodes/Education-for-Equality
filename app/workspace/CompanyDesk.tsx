'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CompanyPartner, KnowledgeItem, WorkPerson } from '@/lib/workspace/types';
import { PARTNER_KINDS } from '@/lib/workspace/types';

export default function CompanyDesk() {
  const [people, setPeople] = useState<WorkPerson[]>([]);
  const [partners, setPartners] = useState<CompanyPartner[]>([]);
  const [policies, setPolicies] = useState<KnowledgeItem[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState('');
  const [kind, setKind] = useState('telco');
  const [notes, setNotes] = useState('');

  const load = useCallback(async () => {
    const [p, r, k] = await Promise.all([
      fetch('/api/workspace/people'),
      fetch('/api/workspace/partners'),
      fetch('/api/workspace/knowledge/items?domain=' + encodeURIComponent('7. Legal & IP')),
    ]);
    if ([p, r].some((x) => x.status === 503)) {
      setError('Run supabase-sabi-work.sql then supabase-sabi-knowledge.sql in the Supabase SQL editor.');
      return;
    }
    if (p.ok) setPeople((await p.json()).people ?? []);
    if (r.ok) setPartners((await r.json()).partners ?? []);
    if (k.ok) setPolicies((await k.json()).items ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const bySeat = useMemo(() => {
    const map = new Map<string, WorkPerson[]>();
    for (const person of people) {
      const list = map.get(person.seat) || [];
      list.push(person);
      map.set(person.seat, list);
    }
    return [...map.entries()];
  }, [people]);

  async function addPartner(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await fetch('/api/workspace/partners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, kind, notes }),
    });
    setName('');
    setNotes('');
    setBusy(false);
    await load();
  }

  return (
    <div className="ws-body">
      {error ? <p className="ws-error">{error}</p> : null}
      <div className="ws-card" style={{ marginBottom: 16 }}>
        <h2>People</h2>
        {bySeat.map(([seat, rows]) => (
          <div key={seat} style={{ marginTop: 12 }}>
            <h3>{seat}</h3>
            <table>
              <tbody>
                {rows.map((person) => (
                  <tr key={person.id}>
                    <td>{person.name}</td>
                    <td className="ws-muted">{person.email || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        {people.length === 0 && !error ? <p className="ws-muted">No people seeded yet.</p> : null}
      </div>

      <div className="ws-card" style={{ marginBottom: 16 }}>
        <h2>Partners</h2>
        <p className="ws-muted">Named organizations from the archive. Do not invent contacts.</p>
        <form className="ws-form" onSubmit={addPartner}>
          <div className="ws-form-row">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Organization" required />
            <select value={kind} onChange={(e) => setKind(e.target.value)}>
              {PARTNER_KINDS.map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
            <button className="primary" type="submit" disabled={busy || !name.trim()}>
              Add
            </button>
          </div>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Notes" />
        </form>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Kind</th>
              <th>Notes</th>
              <th>Linked</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((partner) => (
              <tr key={partner.id}>
                <td>{partner.name}</td>
                <td>
                  <span className="ws-pill">{partner.kind}</span>
                </td>
                <td>{partner.notes}</td>
                <td>
                  {partner.linked_item ? (
                    <Link className="ws-link" href={`/workspace/intelligence/items/${partner.linked_item.id}`}>
                      {partner.linked_item.code || partner.linked_item.title}
                    </Link>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ws-card">
        <h2>Policies</h2>
        <p className="ws-muted">Legal-domain knowledge items — principles, requirements, claims. Not a Drive folder.</p>
        {policies.map((item) => (
          <p key={item.id}>
            <span className="ws-pill">{item.type}</span>{' '}
            <Link className="ws-link" href={`/workspace/intelligence/items/${item.id}`}>
              {item.code ? `${item.code} · ` : ''}
              {item.title}
            </Link>
          </p>
        ))}
        {policies.length === 0 && !error ? <p className="ws-muted">No legal-domain items yet.</p> : null}
      </div>
    </div>
  );
}
