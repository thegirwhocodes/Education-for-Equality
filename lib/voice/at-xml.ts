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

import { normalizeMoneyForSpeech } from "./normalize-money-for-speech";

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
  options?: { maxLength?: number; finishOnKey?: string; timeout?: number }
): string {
  // Defaults tuned for short tutoring turns over PSTN/VoIP:
  //   maxLength 8s — avoids the child hearing a long dead-air gap after
  //     saying a short answer like their name or a number
  //   timeout 3s — forgiving enough for children, but keeps the loop moving
  //   trimSilence=false — VoIP compression often classifies low-volume speech
  //     as silence; turning trim off preserves the recording so STT gets audio
  //   playBeep=true — caller hears when to start speaking
  const maxLength = options?.maxLength ?? 8;
  const finishOnKey = options?.finishOnKey ?? "#";
  const timeout = options?.timeout ?? 3;

  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Play url="${escapeXml(audioUrl)}"/>
    <Record finishOnKey="${escapeXml(finishOnKey)}" maxLength="${maxLength}" timeout="${timeout}" trimSilence="false" callbackUrl="${escapeXml(callbackUrl)}" callBackUrl="${escapeXml(callbackUrl)}" playBeep="true"/>
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
 * Say text (Google TTS via AT) and record — last-resort fallback when all TTS providers fail.
 * AT's <Say> uses Google TTS for free, no API key needed.
 */
export function createSayAndRecordResponse(
  text: string,
  callbackUrl: string,
  options?: { maxLength?: number; finishOnKey?: string; timeout?: number; voice?: string }
): string {
  const maxLength = options?.maxLength ?? 8;
  const finishOnKey = options?.finishOnKey ?? "#";
  const timeout = options?.timeout ?? 3;
  const voice = options?.voice ?? "en-US-Wavenet-F";

  const spokenText = normalizeMoneyForSpeech(text);

  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="${escapeXml(voice)}">${escapeXml(spokenText)}</Say>
    <Record finishOnKey="${escapeXml(finishOnKey)}" maxLength="${maxLength}" timeout="${timeout}" trimSilence="false" callbackUrl="${escapeXml(callbackUrl)}" callBackUrl="${escapeXml(callbackUrl)}" playBeep="true"/>
</Response>`;
}

/**
 * Say text (Google TTS via AT) and hang up — last-resort fallback for goodbye.
 */
export function createSayAndHangupResponse(
  text: string,
  options?: { voice?: string }
): string {
  const voice = options?.voice ?? "en-US-Wavenet-F";
  const spokenText = normalizeMoneyForSpeech(text);

  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="${escapeXml(voice)}">${escapeXml(spokenText)}</Say>
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
