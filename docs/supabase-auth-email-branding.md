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

## Sender identity

Template branding fixes the body. It does not fully fix the Gmail sender line if Supabase is still using its shared default mailer.

For production, configure Supabase custom SMTP:

- Sender name: `Education for Equality`
- From address: `no-reply@eduforequality.org` or `support@eduforequality.org`
- Provider: Resend, Postmark, AWS SES, SendGrid, ZeptoMail, or Brevo
- Domain DNS: SPF, DKIM, and DMARC for `eduforequality.org`

Supabase's own docs say the default SMTP service is for getting started and demos, and that production apps should set up custom SMTP.
