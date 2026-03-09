/**
 * Africa's Talking Voice XML response builders.
 *
 * AT uses XML format for voice call control:
 *   <Response>
 *     <Play url="..."/>
 *     <Record finishOnKey="#" maxLength="10" .../>
 *   </Response>
 *
 * Mirrors the Twilio TwiML helpers in twiml.ts but for AT's format.
 */

/**
 * XML content-type headers for AT voice responses.
 */
export function xmlHeaders(): HeadersInit {
  return { "Content-Type": "application/xml" };
}

/**
 * Play audio and then record the child's speech.
 * This is the core conversational loop for AT voice calls.
 */
export function createPlayAndRecordResponse(
  audioUrl: string,
  callbackUrl: string,
  options?: { maxLength?: number; finishOnKey?: string }
): string {
  const maxLength = options?.maxLength ?? 10;
  const finishOnKey = options?.finishOnKey ?? "#";

  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Play url="${escapeXml(audioUrl)}"/>
    <Record finishOnKey="${escapeXml(finishOnKey)}" maxLength="${maxLength}" trimSilence="true"
            callbackUrl="${escapeXml(callbackUrl)}" playBeep="false"/>
</Response>`;
}

/**
 * Play audio and end the call (no Record = call ends after playback).
 * Used for goodbye/wrap-up messages.
 */
export function createPlayAndHangupResponse(audioUrl: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Play url="${escapeXml(audioUrl)}"/>
</Response>`;
}

/**
 * Reject/end a call immediately.
 */
export function createRejectResponse(): string {
  return `<Response><Reject/></Response>`;
}

/**
 * Parse form-encoded body from Africa's Talking webhook.
 * AT sends: callerNumber, sessionId, isActive, recordingUrl, etc.
 */
export function parseATBody(body: string): Record<string, string> {
  const params: Record<string, string> = {};
  const pairs = body.split("&");
  for (const pair of pairs) {
    const [key, value] = pair.split("=");
    if (key && value !== undefined) {
      params[decodeURIComponent(key)] = decodeURIComponent(
        value.replace(/\+/g, " ")
      );
    }
  }
  return params;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
