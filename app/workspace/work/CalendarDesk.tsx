'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { WorkProject, WorkTask } from '@/lib/workspace/types';

export default function CalendarDesk() {
  const [tasks, setTasks] = useState<WorkTask[]>([]);
  const [projects, setProjects] = useState<WorkProject[]>([]);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const res = await fetch('/api/workspace/calendar');
    if (res.status === 503) {
      setError('Run supabase-sabi-work.sql then supabase-sabi-knowledge.sql in the Supabase SQL editor.');
      return;
    }
    if (!res.ok) {
      setError('Could not load calendar.');
      return;
    }
    const json = await res.json();
    setTasks(json.tasks ?? []);
    setProjects(json.projects ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const days = useMemo(() => {
    const map = new Map<string, { tasks: WorkTask[]; projects: WorkProject[] }>();
    for (const t of tasks) {
      if (!t.due_date) continue;
      const row = map.get(t.due_date) || { tasks: [], projects: [] };
      row.tasks.push(t);
      map.set(t.due_date, row);
    }
    for (const p of projects) {
      if (!p.due_date) continue;
      const row = map.get(p.due_date) || { tasks: [], projects: [] };
      row.projects.push(p);
      map.set(p.due_date, row);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [tasks, projects]);

  return (
    <div className="ws-body">
      <div className="ws-card">
        <h2>Due dates</h2>
        <p className="ws-muted" style={{ margin: '8px 0 14px' }}>
          From projects and tasks. This is not Google Calendar.
        </p>
        {error ? <p className="ws-error">{error}</p> : null}
        <div className="ws-cal">
          {days.map(([date, row]) => (
            <div key={date} className="ws-cal-day">
              <strong>{date}</strong>
              <div>
                {row.projects.map((p) => (
                  <div key={p.id}>
                    Project · <Link className="ws-link" href="/workspace/work/projects">{p.title}</Link>
                  </div>
                ))}
                {row.tasks.map((t) => (
                  <div key={t.id}>
                    Task · {t.title} {t.assignee && typeof t.assignee === 'object' && 'name' in t.assignee ? `· ${t.assignee.name}` : ''}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {days.length === 0 && !error ? <p className="ws-muted">Nothing dated yet.</p> : null}
      </div>
    </div>
  );
}
