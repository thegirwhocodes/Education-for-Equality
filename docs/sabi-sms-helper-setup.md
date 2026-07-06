# Sabi SMS helper setup

This is the setup note for the parent/caregiver texting helper in `/sabi/parents`.

## What prior sessions decided

- Early Sabi design used SMS as an async companion to phone lessons: post-call summaries, practice questions, reminders, and replies to practice answers. Session `7464be26` created the first `app/api/sabi/sms/incoming/route.ts`, `lib/voice/sms.ts`, and `supabase-voice-v1.sql` shape.
- Session `ff1faa52` added Africa's Talking as the preferred Nigerian SMS sender beside Twilio.
- Commit `a0c1be5` added the current pre-pilot caregiver helper: `/sabi/parents`, `/api/sabi/parents`, `lib/parent-sms.ts`, `sendSMSResult()`, provider readiness, templates, segment count, confirmation modal, and SMS history.
- Current product meaning: this helper is for concierge pre-pilot operations, not mass marketing. It texts caregivers to explain how the free flash/callback lesson works, remind them, follow up on missed lessons, ask for feedback, and reschedule call windows.

## Files

- `app/sabi/parents/page.tsx` - protected Sabi-branded caregiver texting UI.
- `app/api/sabi/parents/route.ts` - roster/history GET and confirm-gated send POST.
- `app/api/sabi/sms/incoming/route.ts` - inbound SMS webhook for Twilio and Africa's Talking replies.
- `lib/parent-sms.ts` - templates, GSM/UCS segment counting, caregiver status derivation.
- `lib/voice/sms.ts` - provider detection, AT/Twilio send, SMS logging, practice-answer checks.
- `supabase-sabi-prepilot.sql` - `sabi_prepilot_participants` roster table.
- `supabase-sabi-telephony.sql` - `sabi_sms_log` and voice/SMS support tables.

## Consent / opt-out behavior

Inbound `STOP`, `UNSUBSCRIBE`, `CANCEL`, `END`, or `QUIT` messages are logged as `opt_out`.
Future caregiver sends are blocked until the same number sends `START`, `YES`, or `Y`,
which is logged as `opt_in`. The STOP acknowledgement itself bypasses the block so a
caregiver receives confirmation that SMS has been paused.

## Supabase setup

Run these migrations in Supabase SQL Editor if they are not already present:

1. `supabase-sabi-telephony.sql`
2. `supabase-sabi-prepilot.sql`

The helper needs:

- `sabi_prepilot_participants` for caregiver roster fields.
- `sabi_sms_log` for outbound history, inbound replies, practice answers, and opt-out/help logs.

The code tolerates an older `sabi_sms_log` table without `channel`, but the current migration includes `channel`.

## Environment variables

Required for Supabase-backed roster and logs:

```bash
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Preferred live SMS provider:

```bash
AT_API_KEY=
AT_USERNAME=
AT_SMS_BASE_URL=
AT_SENDER_ID=
NEXT_PUBLIC_SABI_LINE="+234 201 700 1459"
SABI_SMS_WEBHOOK_SECRET=
SABI_SMS_KEYWORD=
```

Fallback provider:

```bash
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

Provider selection is automatic: Africa's Talking is used when `AT_API_KEY` and `AT_USERNAME` exist; otherwise Twilio is used if configured. The AT sender uses the sandbox host when `AT_USERNAME=sandbox`; set `AT_SMS_BASE_URL` only if you need to override the default.

If Africa's Talking provisions a shared short code + keyword, set `SABI_SMS_KEYWORD`
to that keyword. The inbound webhook treats replies such as `SABI HELP`,
`SABI STOP`, and `SABI A` as `HELP`, `STOP`, and `A`.

## Africa's Talking inbound setup

Africa's Talking supports inbound SMS through Two Way SMS / short code callbacks. In the AT dashboard, configure:

```text
SMS -> SMS Callback URLs -> Incoming Messages
https://eduforequality.org/api/sabi/sms/incoming?key=<SABI_SMS_WEBHOOK_SECRET>
```

If testing locally, tunnel the local Next server and use:

```text
https://<tunnel-host>/api/sabi/sms/incoming?key=<SABI_SMS_WEBHOOK_SECRET>
```

The webhook accepts both Twilio-style fields (`From`, `Body`, `To`, `MessageSid`) and Africa's Talking-style fields (`from`, `text`, `to`, `id`, `linkId`).

## Smoke tests

Run lint/type checks:

```bash
npx eslint app/api/sabi/sms/incoming/route.ts lib/voice/sms.ts app/api/sabi/parents/route.ts
npx tsc --noEmit
```

Local webhook checks:

```bash
curl -i -X POST "http://localhost:3000/api/sabi/sms/incoming?key=$SABI_SMS_WEBHOOK_SECRET" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "from=+2348012345678" \
  --data-urlencode "to=12345" \
  --data-urlencode "text=HELP" \
  --data-urlencode "id=1" \
  --data-urlencode "linkId=test"
```

Twilio-style check:

```bash
curl -i -X POST "http://localhost:3000/api/sabi/sms/incoming" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "From=+2348012345678" \
  --data-urlencode "To=+15551234567" \
  --data-urlencode "Body=Hello" \
  --data-urlencode "MessageSid=SM_test"
```

For a live caregiver send, use `/sabi/parents`; the API requires `confirmSend=true`.

## Live readiness checklist

- Production AT app has a real `AT_USERNAME` and production `AT_API_KEY`; `AT_USERNAME=sandbox` is intentionally treated as not live.
- Two Way SMS short code or shared keyword is provisioned for inbound caregiver replies.
- `SABI_SMS_WEBHOOK_SECRET` is set in production and included in the AT Incoming Messages callback URL.
- `NEXT_PUBLIC_SABI_LINE` matches the current Sabi flash/callback number.
- `/sabi/parents` is protected by the same advisor-board gate.
- Send one message to Naomi's test phone, reply `HELP`, reply a normal message, and confirm both appear in caregiver history.
