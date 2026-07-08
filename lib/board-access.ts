export type BoardUserLike = {
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
  app_metadata?: Record<string, unknown> | null;
};

const DEFAULT_BOARD_MEMBER_EMAILS = [
  'naomi.ivie04@gmail.com',
  'simplysonia30@gmail.com',
  'ceo@corruptionobservatory.com',
];

const BOARD_MEMBER_NAME_ALIASES = [
  'naomi ivie',
  'sonia ivie',
  'richard odeyemi',
  'richard ivie',
  'remi tanimola',
];

function normalizeText(value: unknown) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9@._+-]+/g, ' ')
    .replace(/\s+/g, ' ');
}

function configuredBoardEmails() {
  const configured = [
    process.env.BOARD_MEMBER_EMAILS,
    process.env.NEXT_PUBLIC_BOARD_MEMBER_EMAILS,
  ]
    .filter(Boolean)
    .join(',');

  return new Set(
    [...DEFAULT_BOARD_MEMBER_EMAILS, ...configured.split(',')]
      .map((email) => normalizeText(email).replace(/\s/g, ''))
      .filter(Boolean),
  );
}

function userNameText(user?: BoardUserLike | null) {
  const metadata = user?.user_metadata || {};
  const appMetadata = user?.app_metadata || {};
  return normalizeText(
    [
      metadata.full_name,
      metadata.name,
      metadata.display_name,
      metadata.first_name,
      metadata.last_name,
      appMetadata.full_name,
      appMetadata.name,
    ].filter(Boolean).join(' '),
  );
}

function emailMatchesKnownName(email: string) {
  const normalized = normalizeText(email).replace(/[^a-z0-9]+/g, ' ');
  return BOARD_MEMBER_NAME_ALIASES.some((alias) => {
    const parts = alias.split(' ').filter(Boolean);
    return parts.length >= 2 && parts.every((part) => normalized.includes(part));
  });
}

export function isBoardMemberUser(user?: BoardUserLike | null) {
  if (!user) return false;
  if (process.env.BOARD_ALLOW_ANY_SIGNED_IN === 'true') return true;
  if (process.env.NEXT_PUBLIC_BOARD_ALLOW_ANY_SIGNED_IN === 'true') return true;

  const email = normalizeText(user.email).replace(/\s/g, '');
  if (email && configuredBoardEmails().has(email)) return true;
  if (email && emailMatchesKnownName(email)) return true;

  const name = userNameText(user);
  return BOARD_MEMBER_NAME_ALIASES.some((alias) => name.includes(alias));
}

export function boardAccessLabel(user?: BoardUserLike | null) {
  if (!user) return 'Sign in required';
  if (isBoardMemberUser(user)) return 'Board account';
  return 'Signed in';
}
