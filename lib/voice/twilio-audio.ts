import {
  createEndCallResponse,
  createGatherPlayResponse,
  createGatherResponse,
  createPlayEndCallResponse,
} from "./twiml";
import { uploadAudio } from "./audio-storage";
import { synthesizeSpeech } from "./tts-client";

function audioFilename(prefix: string, callSid?: string): string {
  const safeSid = (callSid || "call").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 48);
  const nonce = Math.random().toString(36).slice(2, 10);
  return `twilio_${prefix}_${safeSid}_${Date.now()}_${nonce}.mp3`;
}

async function synthesizeAndUpload(
  text: string,
  prefix: string,
  callSid?: string
): Promise<string> {
  const audio = await synthesizeSpeech(text);
  return uploadAudio(audio, audioFilename(prefix, callSid));
}

export async function createTwilioAudioGatherResponse(
  text: string,
  actionUrl: string,
  options?: { timeout?: number; callSid?: string; prefix?: string }
): Promise<string> {
  try {
    const audioUrl = await synthesizeAndUpload(
      text,
      options?.prefix || "turn",
      options?.callSid
    );
    return createGatherPlayResponse(audioUrl, actionUrl, {
      timeout: options?.timeout,
    });
  } catch (error) {
    console.warn(
      "Twilio audio TTS/upload failed; falling back to Twilio <Say>:",
      error instanceof Error ? error.message : error
    );
    return createGatherResponse(text, actionUrl, {
      timeout: options?.timeout,
    });
  }
}

export async function createTwilioAudioEndResponse(
  text: string,
  options?: { callSid?: string; prefix?: string }
): Promise<string> {
  try {
    const audioUrl = await synthesizeAndUpload(
      text,
      options?.prefix || "end",
      options?.callSid
    );
    return createPlayEndCallResponse(audioUrl);
  } catch (error) {
    console.warn(
      "Twilio end-call TTS/upload failed; falling back to Twilio <Say>:",
      error instanceof Error ? error.message : error
    );
    return createEndCallResponse(text);
  }
}
