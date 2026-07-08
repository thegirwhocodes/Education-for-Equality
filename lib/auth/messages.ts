const RATE_LIMIT_MESSAGE =
  'Too many magic-link emails were requested. Please wait a few minutes before trying again.';
const EXPIRED_LINK_MESSAGE =
  'That Education for Equality magic link is invalid, expired, or already used. Send yourself a fresh sign-in link.';
const GOOGLE_NOT_CONFIGURED_MESSAGE =
  'Google sign-in is not configured in Supabase yet. Add the Google OAuth client ID and secret, then enable the provider.';

export function authErrorMessage(message: string) {
  const normalized = message.replaceAll('_', ' ').toLowerCase();

  if (normalized.includes('rate limit')) {
    return RATE_LIMIT_MESSAGE;
  }

  if (
    normalized.includes('expired') ||
    normalized.includes('invalid') ||
    normalized.includes('access denied') ||
    normalized.includes('otp expired')
  ) {
    return EXPIRED_LINK_MESSAGE;
  }

  if (normalized.includes('provider') || normalized.includes('oauth') || normalized.includes('google')) {
    return GOOGLE_NOT_CONFIGURED_MESSAGE;
  }

  return message;
}
