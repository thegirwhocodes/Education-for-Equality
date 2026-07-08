const DEFAULT_APP_ORIGIN = 'https://eduforequality.org';

export function getAppOrigin() {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!configured) return DEFAULT_APP_ORIGIN;

  try {
    return new URL(configured).origin;
  } catch {
    return DEFAULT_APP_ORIGIN;
  }
}

export function safeRedirectPath(value: string | null | undefined, fallback = '/dashboard') {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return fallback;

  try {
    const url = new URL(value, DEFAULT_APP_ORIGIN);
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

export function buildAuthCallbackUrl(next: string | null | undefined) {
  const callback = new URL('/auth/callback', getAppOrigin());
  callback.searchParams.set('next', safeRedirectPath(next));
  return callback.toString();
}
