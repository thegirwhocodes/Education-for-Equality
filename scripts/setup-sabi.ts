#!/usr/bin/env tsx
/**
 * Check if Sabi tables exist in Supabase.
 * If not, prints the SQL to run in the Supabase Dashboard.
 *
 * Usage: npx tsx --env-file=.env.local scripts/setup-sabi.ts
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function main() {
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Check if sabi_students table exists
  const { error: studentsError } = await supabase
    .from("sabi_students")
    .select("id")
    .limit(1);

  const { error: sessionsError } = await supabase
    .from("sabi_sessions")
    .select("id")
    .limit(1);

  if (!studentsError && !sessionsError) {
    console.log("Sabi tables already exist! Ready to go.");
    return;
  }

  // Tables don't exist — print instructions
  const sql = readFileSync(
    join(__dirname, "..", "supabase-sabi-schema.sql"),
    "utf-8"
  );

  const ref = supabaseUrl.match(/https:\/\/(.+)\.supabase\.co/)?.[1];

  console.log("\n========================================");
  console.log("  SABI TABLES NEED TO BE CREATED");
  console.log("========================================\n");
  console.log("1. Open your Supabase SQL Editor:");
  console.log(
    `   https://supabase.com/dashboard/project/${ref}/sql/new\n`
  );
  console.log("2. Paste this SQL and click 'Run':\n");
  console.log("----------------------------------------");
  console.log(sql);
  console.log("----------------------------------------\n");
  console.log("3. Then run this script again to verify.\n");
}

main().catch(console.error);
