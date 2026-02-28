-- Sabi AI Tutor: Persistent Memory Tables
-- Run this in Supabase Dashboard > SQL Editor

-- Students (identified by browser_id in demo, phone number in production)
CREATE TABLE IF NOT EXISTS sabi_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  browser_id TEXT UNIQUE NOT NULL,
  name TEXT,
  current_level TEXT DEFAULT 'beginner',
  total_sessions INTEGER DEFAULT 0,
  total_correct INTEGER DEFAULT 0,
  total_wrong INTEGER DEFAULT 0,
  last_session_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Session logs with AI-generated summaries
CREATE TABLE IF NOT EXISTS sabi_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES sabi_students(id) ON DELETE CASCADE,
  messages JSONB NOT NULL DEFAULT '[]',
  summary TEXT,
  correct_count INTEGER DEFAULT 0,
  wrong_count INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_sabi_students_browser_id ON sabi_students(browser_id);
CREATE INDEX IF NOT EXISTS idx_sabi_sessions_student_id ON sabi_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_sabi_sessions_created_at ON sabi_sessions(created_at DESC);
