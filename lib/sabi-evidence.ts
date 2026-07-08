export type EvidenceChildSnippet = {
  child_code?: string;
  id?: string;
  name?: string;
  value?: string;
  detail?: string;
  status?: string;
};

export type LearningIndicator = {
  key?: string;
  label?: string;
  subject?: string;
  construct?: string;
  type?: string;
  metric?: string;
  detail?: string;
  progress?: number | null;
  evidence_count?: number;
  evidence?: EvidenceChildSnippet[];
  phase?: string;
  status?: string;
};

export type RctAdvancementCard = {
  key?: string;
  label?: string;
  status?: string;
  metric?: string;
  detail?: string;
};

export type EvidenceCohort = {
  children?: number;
  tarl_movement?: {
    numeracy?: Record<string, unknown>;
    literacy?: Record<string, unknown>;
  };
  mastery?: Record<string, unknown>;
  dosage?: Record<string, unknown>;
  probe?: Record<string, unknown>;
  research?: Record<string, unknown>;
  rct_advancement?: {
    stage?: string;
    stage_label?: string;
    claim_tier?: string;
    cohort_progress?: Record<string, unknown>;
    cards?: RctAdvancementCard[];
  };
};

export type EvidenceSummary = {
  status?: string;
  source_learner_total?: number;
  preview_mode?: boolean;
  preview_note?: string | null;
  learning_indicators?: LearningIndicator[];
  preview_learning_indicators?: LearningIndicator[];
  cohort?: EvidenceCohort;
  preview_cohort?: EvidenceCohort | null;
  notes?: Record<string, string>;
};

export function sabiBackendBase() {
  return (
    process.env.SABI_BACKEND_URL ||
    process.env.NEXT_PUBLIC_SABI_BACKEND_URL ||
    'https://api.eduforequality.org'
  ).replace(/\/$/, '');
}

function adminHeaders() {
  const pin = process.env.SABI_ADMIN_PIN || process.env.SABI_BACKEND_ADMIN_PIN;
  return pin ? { 'X-Admin-Pin': pin } : undefined;
}

export async function fetchPilotEvidenceSummary(): Promise<EvidenceSummary | null> {
  try {
    const response = await fetch(`${sabiBackendBase()}/admin/pilot-evidence`, {
      cache: 'no-store',
      headers: adminHeaders(),
      next: { revalidate: 0 },
    });
    if (!response.ok) return null;
    return (await response.json()) as EvidenceSummary;
  } catch {
    return null;
  }
}

export async function fetchPilotEvidenceCsv(mode = 'board'): Promise<string | null> {
  try {
    const params = new URLSearchParams({ fmt: 'csv', mode });
    const response = await fetch(`${sabiBackendBase()}/admin/pilot-evidence?${params.toString()}`, {
      cache: 'no-store',
      headers: adminHeaders(),
      next: { revalidate: 0 },
    });
    if (!response.ok) return null;
    return response.text();
  } catch {
    return null;
  }
}
