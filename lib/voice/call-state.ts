import { createClient } from "@supabase/supabase-js";

interface CallMessage {
  role: "user" | "assistant";
  content: string;
}

interface CallState {
  callSid: string;
  studentId: string | null;
  phoneNumber: string;
  messages: CallMessage[];
  startedAt: string;
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Get or initialize call state from Supabase
 * (Using DB instead of in-memory map because Vercel serverless functions are stateless)
 */
export async function getCallState(callSid: string): Promise<CallState | null> {
  const supabase = getSupabase();

  const { data } = await supabase
    .from("sabi_active_calls")
    .select("*")
    .eq("call_sid", callSid)
    .single();

  if (!data) return null;

  return {
    callSid: data.call_sid,
    studentId: data.student_id,
    phoneNumber: data.phone_number,
    messages: (data.messages as CallMessage[]) || [],
    startedAt: data.started_at,
  };
}

/**
 * Create a new call state entry
 */
export async function createCallState(
  callSid: string,
  phoneNumber: string,
  studentId: string | null
): Promise<CallState> {
  const supabase = getSupabase();

  const state: CallState = {
    callSid,
    studentId,
    phoneNumber,
    messages: [],
    startedAt: new Date().toISOString(),
  };

  await supabase.from("sabi_active_calls").upsert({
    call_sid: callSid,
    student_id: studentId,
    phone_number: phoneNumber,
    messages: state.messages,
    started_at: state.startedAt,
    updated_at: new Date().toISOString(),
  });

  return state;
}

/**
 * Add a message to call state and persist
 */
export async function addMessage(
  callSid: string,
  role: "user" | "assistant",
  content: string
): Promise<CallState | null> {
  const supabase = getSupabase();

  // Get current state
  const state = await getCallState(callSid);
  if (!state) return null;

  state.messages.push({ role, content });

  // Update in DB
  await supabase
    .from("sabi_active_calls")
    .update({
      messages: state.messages,
      updated_at: new Date().toISOString(),
    })
    .eq("call_sid", callSid);

  return state;
}

/**
 * Update the student_id on a call state (after registration)
 */
export async function setCallStudentId(
  callSid: string,
  studentId: string
): Promise<void> {
  const supabase = getSupabase();

  await supabase
    .from("sabi_active_calls")
    .update({
      student_id: studentId,
      updated_at: new Date().toISOString(),
    })
    .eq("call_sid", callSid);
}

/**
 * Delete call state (cleanup after call ends)
 */
export async function clearCallState(callSid: string): Promise<CallState | null> {
  const supabase = getSupabase();

  // Get state before deleting (we need the messages for session save)
  const state = await getCallState(callSid);

  await supabase
    .from("sabi_active_calls")
    .delete()
    .eq("call_sid", callSid);

  return state;
}

/**
 * Clean up expired calls (older than 15 minutes)
 */
export async function cleanupExpiredCalls(): Promise<void> {
  const supabase = getSupabase();

  const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();

  await supabase
    .from("sabi_active_calls")
    .delete()
    .lt("updated_at", fifteenMinAgo);
}
