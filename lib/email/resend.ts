import { Resend } from 'resend';

const DEFAULT_FROM_EMAIL = 'Education for Equality <no-reply@eduforequality.org>';

export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    throw new Error('Missing RESEND_API_KEY. Add it to the environment before sending email.');
  }

  return new Resend(apiKey);
}

export function getDefaultFromEmail() {
  return process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM_EMAIL;
}
