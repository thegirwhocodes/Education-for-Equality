'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { EvidenceCohort, EvidenceSummary, LearningIndicator, RctAdvancementCard } from '@/lib/sabi-evidence';

function activeIndicators(summary: EvidenceSummary | null) {
  if (!summary) return [];
  if (summary.preview_mode && summary.preview_learning_indicators?.length) {
    return summary.preview_learning_indicators;
  }
  return summary.learning_indicators || [];
}

function activeCohort(summary: EvidenceSummary | null): EvidenceCohort | undefined | null {
  if (!summary) return null;
  if (summary.preview_mode && summary.preview_cohort) return summary.preview_cohort;
  return summary.cohort;
}

function percent(value: unknown) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return `${Math.round(value * 100)}%`;
}

function numberValue(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function metricFrom(block: Record<string, unknown> | undefined, key: string) {
  const value = block?.[key];
  if (value === null || value === undefined || value === '') return 'Not captured';
  if (typeof value === 'number') return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(3)));
  return String(value).replaceAll('_', ' ');
}

function statusLabel(status?: string) {
  return String(status || 'ready').replaceAll('_', ' ');
}

function statusClasses(status?: string) {
  const normalized = String(status || '').toLowerCase();
  if (normalized.includes('signal') || normalized.includes('ready') || normalized.includes('instrumented') || normalized.includes('method')) {
    return 'border-emerald-200 bg-emerald-50 text-emerald-900';
  }
  if (normalized.includes('support') || normalized.includes('scoring') || normalized.includes('review')) {
    return 'border-amber-200 bg-amber-50 text-amber-900';
  }
  if (normalized.includes('awaiting') || normalized.includes('collecting') || normalized.includes('after')) {
    return 'border-sky-200 bg-sky-50 text-sky-900';
  }
  return 'border-gray-200 bg-gray-50 text-gray-700';
}

function nodeTone(indicator: LearningIndicator, selected: boolean) {
  const type = String(indicator.type || '');
  if (selected) return { fill: '#0f766e', border: 'border-emerald-950', text: 'text-emerald-950' };
  if (type === 'primary_outcome') return { fill: '#0ea5a3', border: 'border-teal-700', text: 'text-teal-900' };
  if (type === 'curriculum_skill') return { fill: '#2563eb', border: 'border-blue-600', text: 'text-blue-900' };
  if (type === 'fixed_probe_construct') return { fill: '#d97706', border: 'border-amber-600', text: 'text-amber-900' };
  if (type === 'measurement_fidelity') return { fill: '#7c3aed', border: 'border-violet-600', text: 'text-violet-900' };
  return { fill: '#64748b', border: 'border-slate-500', text: 'text-slate-900' };
}

function progressValue(indicator: LearningIndicator) {
  const value = numberValue(indicator.progress);
  if (value === null) return indicator.evidence_count ? 0.2 : 0;
  return Math.max(0.02, Math.min(1, value));
}

function topIndicators(indicators: LearningIndicator[]) {
  const priority: Record<string, number> = {
    primary_outcome: 0,
    curriculum_skill: 1,
    fixed_probe_construct: 2,
    measurement_fidelity: 3,
    implementation_signal: 4,
  };
  return [...indicators]
    .sort((a, b) => {
      const aType = priority[String(a.type || '')] ?? 9;
      const bType = priority[String(b.type || '')] ?? 9;
      if (aType !== bType) return aType - bType;
      return String(a.label || '').localeCompare(String(b.label || ''));
    })
    .slice(0, 16);
}

function EvidenceNode({
  indicator,
  index,
  selected,
  onSelect,
}: {
  indicator: LearningIndicator;
  index: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const progress = progressValue(indicator);
  const tone = nodeTone(indicator, selected);

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group w-32 shrink-0 text-center focus:outline-none"
      aria-pressed={selected}
    >
      <span
        className={`relative mx-auto grid h-16 w-16 place-items-center rounded-full border-2 ${tone.border} shadow-sm transition-transform group-hover:scale-105`}
        style={{ background: `conic-gradient(${tone.fill} ${Math.round(progress * 360)}deg, #e5e7eb 0deg)` }}
      >
        <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-sm font-bold text-gray-950">
          {index + 1}
        </span>
      </span>
      <span className={`mt-2 block text-xs font-semibold leading-4 ${tone.text}`}>
        {indicator.label || 'Learning indicator'}
      </span>
      <span className="mt-1 block text-[11px] leading-4 text-gray-500">
        {percent(indicator.progress) || `${indicator.evidence_count || 0} signals`}
      </span>
    </button>
  );
}

function EvidencePanel({ indicator }: { indicator: LearningIndicator | null }) {
  if (!indicator) {
    return (
      <div className="border border-gray-200 bg-white p-5">
        <p className="text-sm font-semibold text-gray-950">No learning indicators yet</p>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          The endpoint is reachable, but no live or preview indicator rows came back.
        </p>
      </div>
    );
  }

  const evidence = indicator.evidence || [];

  return (
    <aside className="border border-gray-200 bg-white p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`border px-2 py-1 text-xs font-semibold ${statusClasses(indicator.status)}`}>
          {statusLabel(indicator.status)}
        </span>
        <span className="border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-semibold text-gray-700">
          {String(indicator.type || 'indicator').replaceAll('_', ' ')}
        </span>
      </div>
      <h2 className="mt-4 text-xl font-bold text-gray-950">{indicator.label}</h2>
      <p className="mt-1 text-sm font-semibold text-[var(--primary-dark)]">{indicator.metric}</p>
      <p className="mt-3 text-sm leading-6 text-gray-600">{indicator.detail}</p>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
          <span>Evidence underneath</span>
          <span>{indicator.evidence_count || evidence.length}</span>
        </div>
        <div className="mt-3 space-y-2">
          {evidence.length ? (
            evidence.slice(0, 6).map((item, index) => (
              <div key={`${item.child_code || item.id || index}-${item.value}`} className="border border-gray-200 bg-gray-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-gray-950">
                    {item.child_code || item.name || item.id || `Evidence ${index + 1}`}
                  </span>
                  <span className="text-xs font-semibold text-gray-500">{statusLabel(item.status)}</span>
                </div>
                <p className="mt-1 text-sm text-gray-700">{item.value || 'Recorded evidence'}</p>
                <p className="mt-1 text-xs leading-5 text-gray-500">{item.detail || 'No additional detail saved.'}</p>
              </div>
            ))
          ) : (
            <p className="border border-dashed border-gray-300 p-3 text-sm leading-6 text-gray-500">
              Ready to capture child-level evidence for this indicator.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}

function RctCardItem({ card, index }: { card: RctAdvancementCard; index: number }) {
  return (
    <li className="border border-gray-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gray-950 text-xs font-bold text-white">
          {index + 1}
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-gray-950">{card.label || 'RCT step'}</h3>
            <span className={`border px-2 py-1 text-[11px] font-semibold ${statusClasses(card.status)}`}>
              {statusLabel(card.status)}
            </span>
          </div>
          <p className="mt-2 text-sm font-semibold text-[var(--primary-dark)]">{card.metric}</p>
          <p className="mt-1 text-sm leading-6 text-gray-600">{card.detail}</p>
        </div>
      </div>
    </li>
  );
}

export default function SabiEvidenceBoard({ summary }: { summary: EvidenceSummary | null }) {
  const indicators = useMemo(() => topIndicators(activeIndicators(summary)), [summary]);
  const cohort = activeCohort(summary);
  const cards = cohort?.rct_advancement?.cards || [];
  const [selectedKey, setSelectedKey] = useState(indicators[0]?.key || '');
  const effectiveSelectedKey = indicators.some((indicator) => indicator.key === selectedKey)
    ? selectedKey
    : indicators[0]?.key || '';
  const selected = indicators.find((indicator) => indicator.key === effectiveSelectedKey) || indicators[0] || null;
  const numeracy = cohort?.tarl_movement?.numeracy;
  const literacy = cohort?.tarl_movement?.literacy;
  const research = cohort?.research;
  const dataQuality = (research?.data_quality || {}) as Record<string, unknown>;

  return (
    <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
      <div className="grid gap-3 md:grid-cols-4">
        <div className="border border-gray-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Learner source</p>
          <strong className="mt-2 block text-2xl text-gray-950">{summary?.source_learner_total ?? 'No data'}</strong>
          <p className="mt-1 text-sm text-gray-600">records feeding the evidence report</p>
        </div>
        <div className="border border-gray-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Child evidence</p>
          <strong className="mt-2 block text-2xl text-gray-950">{cohort?.children ?? 'No data'}</strong>
          <p className="mt-1 text-sm text-gray-600">{summary?.preview_mode ? 'preview cohort shape' : 'eligible child pilot records'}</p>
        </div>
        <div className="border border-gray-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Numeracy movement</p>
          <strong className="mt-2 block text-2xl text-gray-950">{metricFrom(numeracy, 'children_up_one_plus_level')}</strong>
          <p className="mt-1 text-sm text-gray-600">{metricFrom(numeracy, 'pct_up_one_plus_level')} up one or more levels</p>
        </div>
        <div className="border border-gray-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Data quality</p>
          <strong className="mt-2 block text-2xl text-gray-950">{metricFrom(dataQuality, 'status')}</strong>
          <p className="mt-1 text-sm text-gray-600">{metricFrom(dataQuality, 'item_response_records')} item-response rows</p>
        </div>
      </div>

      {summary?.preview_note && (
        <div className="mt-4 border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          {summary.preview_note}
        </div>
      )}

      {!summary && (
        <div className="mt-4 border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-950">
          The board route is live, but the evidence summary is unavailable right now.
        </div>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_390px]">
        <div className="border border-gray-200 bg-white p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Learning indicator map</p>
              <h2 className="mt-1 text-xl font-bold text-gray-950">Outcome nodes</h2>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-600">
              <span className="border border-teal-200 bg-teal-50 px-2 py-1">Primary</span>
              <span className="border border-blue-200 bg-blue-50 px-2 py-1">Curriculum</span>
              <span className="border border-amber-200 bg-amber-50 px-2 py-1">Probe</span>
              <span className="border border-violet-200 bg-violet-50 px-2 py-1">Measurement</span>
            </div>
          </div>

          <div className="relative mt-6 overflow-x-auto pb-3">
            <div className="absolute left-10 right-10 top-8 hidden h-px bg-gray-300 sm:block" />
            <div className="relative flex min-w-[760px] items-start gap-5">
              {indicators.map((indicator, index) => (
                <EvidenceNode
                  key={indicator.key || `${indicator.label}-${index}`}
                  indicator={indicator}
                  index={index}
                  selected={(indicator.key || '') === effectiveSelectedKey}
                  onSelect={() => setSelectedKey(indicator.key || '')}
                />
              ))}
            </div>
          </div>
        </div>

        <EvidencePanel indicator={selected} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="border border-gray-200 bg-white p-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">RCT advancement</p>
              <h2 className="mt-1 text-xl font-bold text-gray-950">
                {cohort?.rct_advancement?.stage_label || 'Evidence protocol stage'}
              </h2>
            </div>
            <span className="border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700">
              {statusLabel(cohort?.rct_advancement?.claim_tier)}
            </span>
          </div>
          <ol className="mt-5 grid gap-3 md:grid-cols-2">
            {cards.map((card, index) => (
              <RctCardItem key={card.key || `${card.label}-${index}`} card={card} index={index} />
            ))}
          </ol>
        </section>

        <aside className="border border-gray-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Board exports</p>
          <h2 className="mt-1 text-xl font-bold text-gray-950">Evidence files</h2>
          <div className="mt-4 space-y-2">
            <Link
              href="/advisor-board/sabi-evidence/export?mode=board"
              className="block border border-emerald-300 px-3 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
            >
              Board CSV
            </Link>
            <Link
              href="/advisor-board/sabi-evidence/export?mode=evaluator"
              className="block border border-sky-300 px-3 py-2 text-sm font-semibold text-sky-900 hover:bg-sky-50"
            >
              Evaluator CSV
            </Link>
            <Link
              href="/advisor-board/sabi-evidence/export?mode=public"
              className="block border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              Public CSV
            </Link>
          </div>
          <div className="mt-5 border-t border-gray-200 pt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Literacy movement</p>
            <p className="mt-2 text-sm text-gray-700">
              {metricFrom(literacy, 'children_up_one_plus_level')} children up one or more levels.
            </p>
            <p className="mt-2 text-xs leading-5 text-gray-500">
              Fixed pre/mid/post probes remain separate from Sabi&apos;s adaptive placement diagnostic.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
