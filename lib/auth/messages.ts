const RATE_LIMIT_MESSAGE =
  'Too many magic-link emails were requested. Please wait a few minutes before trying again.';

export function authErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes('rate limit')) {
    return RATE_LIMIT_MESSAGE;
  }

  return message;
}
