-- Lesson Completions Table
-- Simple progress tracking using string lesson IDs from the local curriculum data.
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

CREATE TABLE IF NOT EXISTS lesson_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_completions_user ON lesson_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_completions_lesson ON lesson_completions(lesson_id);

-- Disable RLS since we use Clerk auth + service role key server-side
ALTER TABLE lesson_completions DISABLE ROW LEVEL SECURITY;

SELECT 'lesson_completions table created!' as status;
