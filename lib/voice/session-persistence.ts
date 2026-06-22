import type { SupabaseClient } from "@supabase/supabase-js";

const OPTIONAL_SESSION_COLUMNS = new Set([
  "topics_covered",
  "recommended_module",
  "phone_number",
  "call_sid",
  "channel",
]);

const OPTIONAL_STUDENT_COLUMNS = new Set([
  "current_module",
  "current_topic",
  "skills",
  "phone_number_normalized",
  "learning_state",
  "baseline_status",
  "diagnostic_results",
  "current_week",
  "current_lesson",
  "tarl_level",
]);

function errorText(error: unknown) {
  if (!error || typeof error !== "object") return String(error || "");
  const record = error as Record<string, unknown>;
  return [record.message, record.details, record.hint, record.code]
    .filter(Boolean)
    .join(" ");
}

function mentionsAnyColumn(error: unknown, columns: Set<string>) {
  const text = errorText(error).toLowerCase();
  return [...columns].some((column) => text.includes(column.toLowerCase()));
}

function stripColumns<T extends Record<string, unknown>>(payload: T, columns: Set<string>) {
  return Object.fromEntries(
    Object.entries(payload).filter(([key]) => !columns.has(key))
  );
}

export async function insertSabiSession(
  supabase: SupabaseClient,
  payload: Record<string, unknown>
) {
  const { error } = await supabase.from("sabi_sessions").insert(payload);
  if (!error) return;

  if (!mentionsAnyColumn(error, OPTIONAL_SESSION_COLUMNS)) {
    throw error;
  }

  const fallbackPayload = stripColumns(payload, OPTIONAL_SESSION_COLUMNS);
  const { error: fallbackError } = await supabase
    .from("sabi_sessions")
    .insert(fallbackPayload);
  if (fallbackError) throw fallbackError;

  console.warn(
    "sabi_sessions missing v2/prepilot columns; saved with base schema fallback:",
    errorText(error)
  );
}

export async function updateSabiStudentProgress(
  supabase: SupabaseClient,
  studentId: string,
  payload: Record<string, unknown>
) {
  const { error } = await supabase
    .from("sabi_students")
    .update(payload)
    .eq("id", studentId);
  if (!error) return;

  if (!mentionsAnyColumn(error, OPTIONAL_STUDENT_COLUMNS)) {
    throw error;
  }

  const fallbackPayload = stripColumns(payload, OPTIONAL_STUDENT_COLUMNS);
  const { error: fallbackError } = await supabase
    .from("sabi_students")
    .update(fallbackPayload)
    .eq("id", studentId);
  if (fallbackError) throw fallbackError;

  console.warn(
    "sabi_students missing v2 columns; updated with base schema fallback:",
    errorText(error)
  );
}
