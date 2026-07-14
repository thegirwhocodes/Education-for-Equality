const RATE_LIMIT_MAGIC_LINK_MESSAGE =
  'Too many magic-link emails were requested. Please wait a few minutes before trying again.';
const RATE_LIMIT_PASSWORD_MESSAGE =
  'Too many sign-in attempts. Wait a few minutes before trying again.';
const EXPIRED_LINK_MESSAGE =
  'That Education for Equality magic link is invalid, expired, or already used. Send yourself a fresh sign-in link.';
const WRONG_PASSWORD_MESSAGE =
  'Wrong email or password. Try again, or email yourself a sign-in link below.';
const EMAIL_NOT_CONFIRMED_MESSAGE =
  'You have not confirmed your email yet. Check your inbox for the Education for Equality confirmation link, or email yourself a magic sign-in link below.';
const GOOGLE_NOT_CONFIGURED_MESSAGE =
  'Google sign-in is not configured in Supabase yet. Add the Google OAuth client ID and secret, then enable the provider.';

export type AuthErrorContext = 'magic-link' | 'password' | 'oauth';

export function authErrorMessage(message: string, context: AuthErrorContext = 'magic-link') {
  const normalized = message.replaceAll('_', ' ').toLowerCase();

  if (context === 'password') {
    if (normalized.includes('rate limit') || normalized.includes('too many')) {
      return RATE_LIMIT_PASSWORD_MESSAGE;
    }
    if (normalized.includes('email not confirmed') || normalized.includes('not confirmed')) {
      return EMAIL_NOT_CONFIRMED_MESSAGE;
    }
    if (
      normalized.includes('invalid login credentials') ||
      normalized.includes('invalid credentials') ||
      normalized.includes('invalid email or password') ||
      normalized.includes('invalid') ||
      normalized.includes('credentials')
    ) {
      return WRONG_PASSWORD_MESSAGE;
    }
    return message;
  }

  if (context === 'oauth') {
    if (normalized.includes('provider') || normalized.includes('oauth') || normalized.includes('google')) {
      return GOOGLE_NOT_CONFIGURED_MESSAGE;
    }
    return message;
  }

  // magic-link (default) — used by the sign-in/up URL callback branch and the
  // magic-link send path. Also handles Google callback errors that come back
  // with provider/oauth wording in the URL params.
  if (normalized.includes('rate limit')) {
    return RATE_LIMIT_MAGIC_LINK_MESSAGE;
  }

  if (normalized.includes('provider') || normalized.includes('oauth') || normalized.includes('google')) {
    return GOOGLE_NOT_CONFIGURED_MESSAGE;
  }

  if (
    normalized.includes('expired') ||
    normalized.includes('invalid') ||
    normalized.includes('access denied') ||
    normalized.includes('otp expired')
  ) {
    return EXPIRED_LINK_MESSAGE;
  }

  return message;
}
