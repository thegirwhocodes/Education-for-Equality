# Supabase Auth Email Branding

The default Supabase email is not acceptable for production. It says `Supabase Auth <noreply@mail.app.supabase.io>`, has no Education for Equality logo, and reads like an untrusted third-party signup email.

## What polished startup auth emails do

- Sender name is the product or organization, not the infrastructure provider.
- Sender address uses the product domain, usually `no-reply@...` or `support@...`.
- The email opens with the logo and product name.
- The CTA is a real button with a clear action.
- The copy says exactly why the recipient is getting the email.
- The footer has support contact info and a safe-ignore sentence.
- The fallback link is visible for broken email clients.

## Files

- `supabase/auth-email-templates/confirmation.html`
- `supabase/auth-email-templates/magic-link.html`
- `supabase/auth-email-templates/recovery.html`
- `supabase/auth-email-templates/reauthentication.html`
- `supabase/auth-email-templates/auth-email-payload.json`
- `scripts/apply-supabase-auth-branding.ts`

The automated payload intentionally does not set `smtp_sender_name` because Supabase rejects sender-name changes unless custom SMTP is already configured. Apply templates/site URL first, then configure SMTP for the Gmail sender line.

Supabase also rejects `RATE_LIMIT_EMAIL_SENT` changes without custom SMTP. On the shared Supabase mailer, the project currently keeps Supabase's low email-send limit, so rapid magic-link testing can stop sending until the rate window resets. Custom SMTP is the fix for both sender identity and a higher resend limit.

## Apply templates with the Supabase Management API

The Management API requires a Supabase access token. A service-role key is not enough.

```bash
export SUPABASE_ACCESS_TOKEN="..."
npx tsx --env-file=.env.local scripts/apply-supabase-auth-branding.ts
```

Dry run:

```bash
npx tsx --env-file=.env.local scripts/apply-supabase-auth-branding.ts --dry-run
```

## Manual dashboard path

Go to Supabase Dashboard -> Authentication -> Emails -> Email Templates.

Set:

- Confirm signup subject: `Confirm your Education for Equality account`
- Confirm signup body: contents of `confirmation.html`
- Magic Link subject: `Your Education for Equality sign-in link`
- Magic Link body: contents of `magic-link.html`
- Reset password/recovery subject: `Recover your Education for Equality account`
- Recovery body: contents of `recovery.html`
- Reauthentication subject: `{{ .Token }} is your Education for Equality verification code`
- Reauthentication body: contents of `reauthentication.html`

## Current production approach

The polished user-facing signup and magic-link emails are sent by the app route `POST /api/auth/email-link`, not by Supabase's built-in mailer. That route uses Supabase Admin `generateLink`, then sends the branded Education for Equality email through the Resend API from:

- `Education for Equality <no-reply@eduforequality.org>`

This is the path the web UI uses for `/sign-up` and `/sign-in` magic-link buttons.

Supabase Auth SMTP is still configured as a fallback for flows that might call Supabase's built-in mailer directly. Live smoke testing on Jul 7 2026 showed Resend API sends from `no-reply@eduforequality.org`, but Supabase Auth SMTP returned status 500 when `smtp_admin_email` was set to `no-reply@eduforequality.org`. The fallback therefore stays on `onboarding@resend.dev` with sender name `Education for Equality` until Supabase/Resend SMTP accepts the verified domain sender through that path.

## Sender identity

Template branding fixes the body. It does not fully fix the Gmail sender line if Supabase is still using its shared default mailer.

For production, configure Supabase custom SMTP:

- Sender name: `Education for Equality`
- From address: `no-reply@eduforequality.org` or `support@eduforequality.org` once Supabase SMTP accepts the verified-domain sender
- Provider: Resend, Postmark, AWS SES, SendGrid, ZeptoMail, or Brevo
- Domain DNS: SPF, DKIM, and DMARC for `eduforequality.org`

Supabase's own docs say the default SMTP service is for getting started and demos, and that production apps should set up custom SMTP.

## Resend SMTP

Resend's Supabase SMTP settings are:

- Host: `smtp.resend.com`
- Port: `465`
- Username: `resend`
- Password: your `RESEND_API_KEY`

The local project includes `scripts/configure-supabase-resend-smtp.ts` so the Auth SMTP config can be patched through the Supabase Management API instead of by hand.

Required local env:

```bash
RESEND_API_KEY="re_xxxxxxxxx"
RESEND_FROM_EMAIL="Education for Equality <no-reply@eduforequality.org>"
SUPABASE_AUTH_SMTP_ADMIN_EMAIL="onboarding@resend.dev"
SUPABASE_AUTH_SMTP_SENDER_NAME="Education for Equality"
SUPABASE_AUTH_EMAIL_RATE_LIMIT=30
```

`SUPABASE_ACCESS_TOKEN` lives in `.env.supabase-management.local`, not in tracked code.

Dry run:

```bash
npm run auth:configure-resend-smtp:dry-run
```

Apply:

```bash
npm run auth:configure-resend-smtp
```

The live app-owned auth email sender is `Education for Equality <no-reply@eduforequality.org>`. If the Resend API key is rotated, update Vercel `RESEND_API_KEY` and then update the Supabase SMTP fallback password through `npm run auth:configure-resend-smtp`.
