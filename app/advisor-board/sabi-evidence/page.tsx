import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/server';
import { boardAccessLabel } from '@/lib/board-access';
import SabiEvidenceBoard from '@/components/SabiEvidenceBoard';
import { fetchPilotEvidenceSummary } from '@/lib/sabi-evidence';

export const dynamic = 'force-dynamic';

function statusText(summary: Awaited<ReturnType<typeof fetchPilotEvidenceSummary>>) {
  if (!summary) return 'Backend summary unavailable';
  if (summary.preview_mode) return 'Preview evidence active';
  return `${summary.cohort?.children || 0} live child records`;
}

export default async function SabiBoardEvidencePage() {
  const user = await getCurrentUser();
  const summary = await fetchPilotEvidenceSummary();

  return (
    <main className="min-h-screen bg-[#f7fbf9]">
      <section className="border-b border-emerald-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--primary-dark)]">
                Sabi board evidence
              </p>
              <h1 className="mt-2 text-3xl font-bold text-gray-950">Learning Indicators and RCT Readiness</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
                Read-only board view of Sabi&apos;s learning indicators, child evidence snippets, pre/mid/post measurement
                readiness, and RCT advancement.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="border border-emerald-200 bg-emerald-50 px-3 py-2 font-semibold text-emerald-900">
                {boardAccessLabel(user)}
              </span>
              <span className="border border-sky-200 bg-sky-50 px-3 py-2 font-semibold text-sky-900">
                {statusText(summary)}
              </span>
            </div>
          </div>
        </div>
      </section>

      <SabiEvidenceBoard summary={summary} />

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/advisor-board" className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-white">
            Back to board center
          </Link>
          <Link href="/dashboard" className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-white">
            Account dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
