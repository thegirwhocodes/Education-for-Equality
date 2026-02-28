import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
    query = query.eq("phone_number", phone);
  } else {
    query = query.eq("browser_id", browserId!);
  }

  const { data: student, error } = await query.single();

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
  if (phone_number) {
    existingQuery = existingQuery.eq("phone_number", phone_number);
  } else {
    existingQuery = existingQuery.eq("browser_id", browser_id);
  }

  const { data: existing } = await existingQuery.single();

  if (existing) {
    return NextResponse.json({ student: existing });
  }

  // Create new student
  const insertData: Record<string, string | null> = { name: name || null };
  if (phone_number) {
    insertData.phone_number = phone_number;
  } else {
    insertData.browser_id = browser_id;
  }

  const { data: student, error } = await supabase
    .from("sabi_students")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error("Create student error:", error);
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }

  return NextResponse.json({ student });
}
