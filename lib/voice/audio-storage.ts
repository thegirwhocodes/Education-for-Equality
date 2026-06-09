/**
 * Supabase Storage for voice audio files.
 * Africa's Talking needs publicly accessible URLs for <Play>.
 * Files are uploaded to the "sabi-audio" bucket and served via public URL.
 *
 * Bucket setup (run once in Supabase dashboard):
 *   1. Create bucket "sabi-audio" with public access enabled
 *   2. No RLS policies needed — service role key bypasses RLS
 */

import { createClient } from "@supabase/supabase-js";

const BUCKET = "sabi-audio";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Upload audio buffer to Supabase Storage and return a public URL.
 */
export async function uploadAudio(
  audioBuffer: Buffer,
  filename: string,
  contentType: string = "audio/mpeg"
): Promise<string> {
  const supabase = getSupabase();

  const { error } = await supabase.storage.from(BUCKET).upload(
    filename,
    audioBuffer,
    { contentType, upsert: true }
  );

  if (error) {
    console.error("Audio upload error:", error.message);
    throw new Error(`Failed to upload audio: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  return data.publicUrl;
}

/**
 * Download audio from an external URL.
 *
 * Africa's Talking recording URLs require HTTP Basic auth using
 * AT_USERNAME + AT_API_KEY. We attempt unauthenticated first; on 401/403
 * (or pre-emptively if the URL looks like an AT recording host), we retry
 * with Basic auth.
 *
 * Twilio recordings are downloaded in their own route handler with TWILIO
 * creds — this function is the AT path.
 */
export async function downloadAudio(url: string): Promise<Buffer> {
  // Pre-emptively send Basic auth on AT URLs to skip a wasted unauthed roundtrip.
  if (isAfricasTalkingUrl(url)) {
    const authed = await fetchWithAtAuth(url);
    if (authed.ok) {
      return Buffer.from(await authed.arrayBuffer());
    }
    // fall through to a final no-auth attempt for debugging visibility
    if (authed.status !== 401 && authed.status !== 403) {
      throw new Error(
        `Failed to download audio (AT auth, ${authed.status}): ${url}`
      );
    }
  }

  // Generic path: unauth, retry with AT auth on rejection
  let response = await fetch(url);
  if (
    (response.status === 401 || response.status === 403) &&
    isAfricasTalkingUrl(url)
  ) {
    response = await fetchWithAtAuth(url);
  }

  if (!response.ok) {
    throw new Error(`Failed to download audio: ${response.status} ${url}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function fetchWithAtAuth(url: string): Promise<Response> {
  const username = process.env.AT_USERNAME;
  const apiKey = process.env.AT_API_KEY;
  if (!username || !apiKey) {
    // No creds configured — return a fake response so caller falls back
    return new Response(null, { status: 401 });
  }
  const basic = Buffer.from(`${username}:${apiKey}`).toString("base64");
  return fetch(url, {
    headers: { Authorization: `Basic ${basic}` },
  });
}

function isAfricasTalkingUrl(url: string): boolean {
  return /africastalking|recordings\.(africastalking)/i.test(url);
}

/**
 * Delete an audio file from storage (cleanup after call ends).
 */
export async function deleteAudio(filename: string): Promise<void> {
  const supabase = getSupabase();
  await supabase.storage.from(BUCKET).remove([filename]);
}
