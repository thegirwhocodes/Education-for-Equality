import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { normalizePhoneNumber, phoneLookupVariants } from "@/lib/voice/phone-normalization";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET /api/sabi/student?browser_id=xxx OR ?phone=+234... — Find student + recent sessions
export async function GET(req: NextRequest) {
  const browserId = req.nextUrl.searchParams.get("browser_id");
  const phone = req.nextUrl.searchParams.get("phone");

  if (!browserId && !phone) {
    return NextResponse.json({ error: "browser_id or phone required" }, { status: 400 });
  }

  const supabase = getSupabase();

  let query = supabase.from("sabi_students").select("*");
  if (phone) {
    const normalizedPhone = normalizePhoneNumber(phone);
    const byNormalized = await supabase
      .from("sabi_students")
      .select("*")
      .eq("phone_number_normalized", normalizedPhone)
      .maybeSingle();
    if (byNormalized.data) {
      const { data: sessions } = await supabase
        .from("sabi_sessions")
        .select("*")
        .eq("student_id", byNormalized.data.id)
        .order("created_at", { ascending: false })
        .limit(5);
      return NextResponse.json({ student: byNormalized.data, sessions: sessions || [] });
    }
    query = query
      .in("phone_number", phoneLookupVariants(phone))
      .order("total_sessions", { ascending: false })
      .order("created_at", { ascending: false });
  } else {
    query = query.eq("browser_id", browserId!);
  }

  const { data: student, error } = await query.limit(1).maybeSingle();

  if (error || !student) {
    return NextResponse.json({ student: null });
  }

  // Get recent sessions
  const { data: sessions } = await supabase
    .from("sabi_sessions")
    .select("*")
    .eq("student_id", student.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return NextResponse.json({ student, sessions: sessions || [] });
}

// POST /api/sabi/student — Create new student (supports browser_id or phone_number)
export async function POST(req: NextRequest) {
  const { browser_id, phone_number, name } = await req.json();

  if (!browser_id && !phone_number) {
    return NextResponse.json(
      { error: "browser_id or phone_number required" },
      { status: 400 }
    );
  }

  const supabase = getSupabase();

  // Check if student already exists
  let existingQuery = supabase.from("sabi_students").select("*");
  const normalizedPhone = phone_number ? normalizePhoneNumber(phone_number) : null;
  if (phone_number) {
    const byNormalized = await supabase
      .from("sabi_students")
      .select("*")
      .eq("phone_number_normalized", normalizedPhone)
      .maybeSingle();
    if (byNormalized.data) {
      return NextResponse.json({ student: byNormalized.data });
    }
    existingQuery = existingQuery
      .in("phone_number", phoneLookupVariants(phone_number))
      .order("total_sessions", { ascending: false })
      .order("created_at", { ascending: false });
  } else {
    existingQuery = existingQuery.eq("browser_id", browser_id);
  }

  const { data: existing } = await existingQuery.limit(1).maybeSingle();

  if (existing) {
    return NextResponse.json({ student: existing });
  }

  // Create new student
  const insertData: Record<string, unknown> = {
    name: name || null,
    current_level: "beginner",
    current_module: 0,
    current_topic: "diagnostic",
    skills: {},
    learning_state: {
      course: "numeracy",
      phase: "onboarding",
      diagnostic_status: "not_started",
      current_module: 0,
      active_skill: "diagnostic",
      correct_streak: 0,
      wrong_streak: 0,
      scaffold_depth: 0,
    },
    baseline_status: "not_started",
  };
  if (phone_number) {
    insertData.phone_number = normalizedPhone;
    insertData.phone_number_normalized = normalizedPhone;
  } else {
    insertData.browser_id = browser_id;
  }

  let { data: student, error } = await supabase
    .from("sabi_students")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    const fallbackInsert: Record<string, unknown> = { name: name || null };
    if (phone_number) fallbackInsert.phone_number = normalizedPhone;
    else fallbackInsert.browser_id = browser_id;
    const fallback = await supabase
      .from("sabi_students")
      .insert(fallbackInsert)
      .select()
      .single();
    student = fallback.data;
    error = fallback.error;
  }

  if (error) {
    console.error("Create student error:", error);
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }

  return NextResponse.json({ student });
}
