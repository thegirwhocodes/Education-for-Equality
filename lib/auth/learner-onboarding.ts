export const PENDING_LEARNER_PROFILE_KEY = 'education-for-equality-pending-learner-profile';

export type LearnerMetadataValue = string | boolean | null;
export type LearnerMetadata = Record<string, LearnerMetadataValue>;

export function normalizeLearnerMetadata(value: unknown): LearnerMetadata | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;

  const entries = Object.entries(value).filter(([, entryValue]) => {
    return (
      typeof entryValue === 'string' ||
      typeof entryValue === 'boolean' ||
      entryValue === null
    );
  });

  if (entries.length === 0) return null;
  return Object.fromEntries(entries) as LearnerMetadata;
}
