'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { KnowledgeItem } from '@/lib/workspace/types';

const GROUPS: { title: string; nodes: { label: string; match: RegExp }[] }[] = [
  {
    title: 'Learner Identity',
    nodes: [{ label: 'learner_key / shared phone', match: /learner_key|shared-phone|identity/i }],
  },
  {
    title: 'Telephony',
    nodes: [
      { label: "Africa's Talking", match: /africa|talking|sip/i },
      { label: 'Asterisk', match: /asterisk/i },
      { label: 'AudioSocket', match: /audiosocket|asterisk/i },
      { label: 'Flash callback', match: /flash/i },
    ],
  },
  {
    title: 'Speech Recognition',
    nodes: [
      { label: 'Whisper', match: /whisper/i },
      { label: 'Intron', match: /intron/i },
      { label: 'Gemini STT (DORMANT)', match: /gemini stt|dormant/i },
      { label: 'Gemini Live', match: /gemini live/i },
      { label: 'Numeric sidecar', match: /sidecar|stt\.py/i },
    ],
  },
  {
    title: 'Tutor Intelligence',
    nodes: [
      { label: 'LLM / llm.py', match: /llm\.py|market/i },
      { label: 'Guardrails', match: /guardrail|tutor not companion/i },
      { label: 'Launch gates', match: /launch gate/i },
    ],
  },
  {
    title: 'Pedagogy',
    nodes: [
      { label: 'TaRL diagnostic', match: /tarl|diagnostic/i },
      { label: 'Market math', match: /naira|market-framed|weber/i },
      { label: 'Answer matching', match: /answer_matcher|false-wrong/i },
      { label: 'Keypad not assessment', match: /keypad/i },
    ],
  },
  {
    title: 'Measurement',
    nodes: [{ label: 'Launch gates / outcomes', match: /launch gate|outcome|pilot/i }],
  },
];

export default function ArchitectureExplorer() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const res = await fetch('/api/workspace/knowledge/items');
    if (res.status === 503) {
      setError('Run supabase-sabi-knowledge.sql in the Supabase SQL editor.');
      return;
    }
    if (res.ok) setItems((await res.json()).items ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const linked = useMemo(() => {
    return GROUPS.map((group) => ({
      ...group,
      resolved: group.nodes.map((node) => {
        const hit = items.find((i) => node.match.test(`${i.title} ${i.summary} ${i.implements_path} ${i.code}`));
        return { ...node, item: hit || null };
      }),
    }));
  }, [items]);

  return (
    <div className="ws-body">
      <div className="ws-card" style={{ marginBottom: 16 }}>
        <h2>Sabi architecture</h2>
        <p className="ws-muted" style={{ marginTop: 8 }}>
          Every component should answer why it exists. Click through to the decision, not just the file.
        </p>
        {error ? <p className="ws-error">{error}</p> : null}
      </div>
      <div className="ws-arch">
        {linked.map((group) => (
          <div key={group.title} className="ws-arch-group">
            <h3>{group.title}</h3>
            <div className="ws-arch-nodes">
              {group.resolved.map((node) =>
                node.item ? (
                  <Link key={node.label} href={`/workspace/intelligence/items/${node.item.id}`}>
                    {node.label}
                    {node.item.status === 'dormant' ? ' · dormant' : ''}
                  </Link>
                ) : (
                  <span key={node.label}>{node.label}</span>
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
