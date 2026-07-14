import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Fall back to harmless placeholders so importing this module never throws at
// build time when the public env vars are absent (e.g. preview builds). Real
// values are present at runtime in every configured environment. This mirrors
// the guards already used in lib/auth/browser.ts and lib/auth/server.ts.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Server-side client with service role (for seeding data)
export function createServerClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  }
  return createClient<Database>(supabaseUrl, serviceRoleKey);
}