import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { getDefaultFromEmail, getResendClient } from '@/lib/email/resend';
import { normalizeLearnerMetadata } from '@/lib/auth/learner-onboarding';
import { buildAuthCallbackUrl, safeRedirectPath } from '@/lib/auth/url';

type EmailLinkMode = 'signup' | 'magiclink';

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

function isEmail(value: unknown): value is string {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isMode(value: unknown): value is EmailLinkMode {
  return value === 'signup' || value === 'magiclink';
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function emailHtml(actionLink: string, mode: EmailLinkMode) {
  const kicker = mode === 'signup' ? 'Confirm your account' : 'Secure sign-in';
  const title =
    mode === 'signup'
      ? 'Welcome to Education for Equality'
      : 'Sign in to Education for Equality';
  const buttonText = mode === 'signup' ? 'Confirm my account' : 'Sign in';
  const intro =
    mode === 'signup'
      ? 'Use this secure link to confirm your account and continue setting up the learner.'
      : 'Use this secure link to continue learning with Education for Equality.';
  const preheader =
    mode === 'signup'
      ? 'Confirm your Education for Equality account and start learning with Sabi.'
      : 'Open this secure link to sign in to Education for Equality.';
  const safeActionLink = escapeHtml(actionLink);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f8fdfb;">
  <div style="display:none;max-height:0;overflow:hidden;color:transparent;">${preheader}</div>
  <div style="margin:0;background:#f8fdfb;padding:40px 16px;font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Arial,sans-serif;color:#1a1a1a;font-weight:400;line-height:1.5;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #ddfbee;border-radius:8px;overflow:hidden;box-shadow:0 6px 22px rgba(7,84,73,0.08);">
      <tr>
        <td style="height:4px;background:linear-gradient(90deg,#16fddb 0%,#0fa992 58%,rgba(15,169,146,0) 100%);padding:0;line-height:0;font-size:0;">&nbsp;</td>
      </tr>
      <tr>
        <td style="padding:34px 40px 4px;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="vertical-align:middle;">
                <img src="https://eduforequality.org/tree-icon.png" width="36" height="36" alt="" style="display:block;border:0;">
              </td>
              <td style="padding-left:10px;vertical-align:middle;">
                <div style="font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Arial,sans-serif;font-size:18px;font-weight:600;color:#075449;line-height:1;">Education for Equality</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:26px 40px 0;">
          <p style="margin:0 0 12px;color:#0fa992;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;">${kicker}</p>
          <h1 style="margin:0;font-size:30px;line-height:1.15;color:#075449;font-weight:800;letter-spacing:0;">${title}</h1>
          <p style="margin:18px 0 0;font-size:15px;line-height:1.7;color:#5a6462;font-weight:400;">${intro}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 40px 8px;">
          <a href="${safeActionLink}" style="display:inline-block;background:#0fa992;color:#ffffff;text-decoration:none;font-size:14.5px;font-weight:700;border-radius:8px;padding:15px 26px;letter-spacing:0;font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Arial,sans-serif;">${buttonText} &nbsp;&rarr;</a>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 40px 34px;">
          <p style="margin:0 0 6px;font-size:12.5px;line-height:1.6;color:#5a6462;font-weight:400;">If the button doesn&#39;t work, copy this link into your browser:</p>
          <p style="margin:0;font-size:12px;line-height:1.55;word-break:break-all;color:#0fa992;font-weight:500;"><a href="${safeActionLink}" style="color:#0fa992;text-decoration:none;">${safeActionLink}</a></p>
        </td>
      </tr>
      <tr>
        <td style="background:#ddfbee;border-top:1px solid #c7f4e2;padding:22px 40px 26px;">
          <p style="margin:0;font-size:12px;line-height:1.65;color:#5a6462;font-weight:400;">This link expires soon and can only be used once. If you did not request this, you can ignore this email.</p>
          <p style="margin:14px 0 0;font-size:11px;line-height:1.65;color:#5a6462;font-weight:400;letter-spacing:0.03em;">Education for Equality &middot; <a href="mailto:info@eduforequality.org" style="color:#075449;text-decoration:none;">info@eduforequality.org</a></p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}

function emailText(actionLink: string, mode: EmailLinkMode) {
  const title =
    mode === 'signup'
      ? 'Confirm your Education for Equality account'
      : 'Your Education for Equality sign-in link';

  return `${title}\n\nOpen this secure link:\n${actionLink}\n\nIf you did not request this, you can ignore this email.`;
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid request body.' }, 400);
  }

  const email = body.email;
  const mode = body.mode;
  const password = body.password;
  const metadata = normalizeLearnerMetadata(body.metadata);
  const redirectTo = buildAuthCallbackUrl(safeRedirectPath(typeof body.redirectTo === 'string' ? body.redirectTo : null));

  if (!isEmail(email)) {
    return jsonResponse({ error: 'Enter a valid email address.' }, 400);
  }

  if (!isMode(mode)) {
    return jsonResponse({ error: 'Choose a supported email link type.' }, 400);
  }

  if (mode === 'signup' && (typeof password !== 'string' || password.length < 8)) {
    return jsonResponse({ error: 'Password must be at least 8 characters.' }, 400);
  }

  const supabase = createServerClient();
  const { data, error } =
    mode === 'signup'
      ? await supabase.auth.admin.generateLink({
          type: 'signup',
          email,
          password: password as string,
          options: {
            data: metadata || undefined,
            redirectTo,
          },
        })
      : await supabase.auth.admin.generateLink({
          type: 'magiclink',
          email,
          options: {
            data: metadata || undefined,
            redirectTo,
          },
        });

  if (error || !data.properties?.action_link) {
    return jsonResponse({ error: error?.message || 'Could not create a secure email link.' }, 400);
  }

  const resend = getResendClient();
  const subject =
    mode === 'signup'
      ? 'Confirm your Education for Equality account'
      : 'Your Education for Equality sign-in link';
  const { error: sendError } = await resend.emails.send({
    from: getDefaultFromEmail(),
    to: email,
    subject,
    html: emailHtml(data.properties.action_link, mode),
    text: emailText(data.properties.action_link, mode),
  });

  if (sendError) {
    console.error('[auth-email-link] Resend send failed', sendError);
    return jsonResponse({ error: 'Could not send the email right now.' }, 502);
  }

  return jsonResponse({ ok: true });
}
