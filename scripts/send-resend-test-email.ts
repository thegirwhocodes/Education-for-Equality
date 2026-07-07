import { getDefaultFromEmail, getResendClient } from '../lib/email/resend';

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name}. Set it before running this script.`);
  }
  return value;
}

const TEST_EMAIL_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>Education for Equality email test</title>
</head>
<body style="margin:0;padding:0;background:#f7f2e7;">
  <div style="display:none;max-height:0;overflow:hidden;color:transparent;">Resend delivery test for Education for Equality.</div>
  <div style="margin:0;background:#f7f2e7;padding:40px 16px;font-family:'Lexend',ui-sans-serif,system-ui,-apple-system,'Segoe UI',Arial,sans-serif;color:#201a13;font-weight:300;line-height:1.5;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#fffdf8;border:1px solid #e8dfc9;border-radius:18px;overflow:hidden;box-shadow:0 6px 22px rgba(45,36,20,0.06);">
      <tr>
        <td style="height:4px;background:linear-gradient(90deg,#cba868 0%,#e2c88e 40%,rgba(226,200,142,0) 100%);padding:0;line-height:0;font-size:0;">&nbsp;</td>
      </tr>
      <tr>
        <td style="padding:36px 40px 6px;">
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
          <p style="margin:0 0 12px;color:#9a7536;font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;">Delivery check</p>
          <h1 style="margin:0;font-family:'Cormorant Garamond',Georgia,'Times New Roman',serif;font-size:30px;line-height:1.15;color:#201a13;font-weight:600;letter-spacing:0.01em;">Email delivery is live</h1>
          <p style="margin:18px 0 0;font-size:15px;line-height:1.7;color:#4c4438;font-weight:300;">Education for Equality can send email through Resend. Sender authentication, DKIM alignment, and template rendering all look healthy from this envelope.</p>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 40px 8px;">
          <div style="background:#faf4e6;border:1px solid #e8dfc9;border-radius:12px;padding:16px 18px;">
            <p style="margin:0 0 4px;font-size:10.5px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#9a7536;">What this confirms</p>
            <ul style="margin:6px 0 0;padding-left:18px;font-size:13.5px;line-height:1.7;color:#4c4438;font-weight:300;">
              <li>Resend API key resolves and can send</li>
              <li>Sender identity <code style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;color:#201a13;">no-reply@eduforequality.org</code> is authorised</li>
              <li>Premium Sabi template renders end-to-end</li>
            </ul>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 40px 34px;">
          <p style="margin:0;font-size:12.5px;line-height:1.65;color:#857a68;font-weight:300;">You can safely ignore or delete this message &mdash; it was sent from the ops console as a smoke test.</p>
        </td>
      </tr>
      <tr>
        <td style="background:#faf4e6;border-top:1px solid #e8dfc9;padding:22px 40px 26px;">
          <p style="margin:0;font-size:11px;line-height:1.65;color:#a09482;font-weight:300;letter-spacing:0.03em;">Education for Equality &middot; <a href="mailto:info@eduforequality.org" style="color:#9a7536;text-decoration:none;">info@eduforequality.org</a></p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;

async function main() {
  const resend = getResendClient();
  const { data, error } = await resend.emails.send({
    from: getDefaultFromEmail(),
    to: requiredEnv('RESEND_TEST_TO'),
    subject: 'Email delivery is live — Education for Equality',
    html: TEST_EMAIL_HTML,
    text:
      'Education for Equality email delivery is live.\n\nThis message confirms Resend can send from no-reply@eduforequality.org and the premium Sabi template renders end-to-end.\n\nYou can safely ignore or delete this message.',
  });

  if (error) {
    throw new Error(`Resend test email failed: ${JSON.stringify(error)}`);
  }

  console.log(`Resend test email sent: ${data?.id || 'no id returned'}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
