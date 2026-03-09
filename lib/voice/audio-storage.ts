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
 * Download audio from an external URL (e.g., Africa's Talking recording URL).
 */
export async function downloadAudio(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download audio: ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Delete an audio file from storage (cleanup after call ends).
 */
export async function deleteAudio(filename: string): Promise<void> {
  const supabase = getSupabase();
  await supabase.storage.from(BUCKET).remove([filename]);
}
