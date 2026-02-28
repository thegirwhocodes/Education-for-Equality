import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET /api/sabi/student?browser_id=xxx — Find student + recent sessions
export async function GET(req: NextRequest) {
  const browserId = req.nextUrl.searchParams.get("browser_id");
  if (!browserId) {
    return NextResponse.json({ error: "browser_id required" }, { status: 400 });
  }

  const supabase = getSupabase();

  const { data: student, error } = await supabase
    .from("sabi_students")
    .select("*")
    .eq("browser_id", browserId)
    .single();

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

// POST /api/sabi/student — Create new student
export async function POST(req: NextRequest) {
  const { browser_id, name } = await req.json();

  if (!browser_id) {
    return NextResponse.json(
      { error: "browser_id required" },
      { status: 400 }
    );
  }

  const supabase = getSupabase();

  // Check if student already exists
  const { data: existing } = await supabase
    .from("sabi_students")
    .select("*")
    .eq("browser_id", browser_id)
    .single();

  if (existing) {
    return NextResponse.json({ student: existing });
  }

  // Create new student
  const { data: student, error } = await supabase
    .from("sabi_students")
    .insert({ browser_id, name: name || null })
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
