-- Sabi v2: Add module tracking and skill progression
-- Run this in Supabase Dashboard > SQL Editor

-- Add module tracking to students
ALTER TABLE sabi_students
  ADD COLUMN IF NOT EXISTS current_module INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS current_topic TEXT DEFAULT 'diagnostic',
  ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '{}';

-- Add topic tracking to sessions
ALTER TABLE sabi_sessions
  ADD COLUMN IF NOT EXISTS topics_covered TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS recommended_module INTEGER;

-- current_module values:
-- 0 = needs diagnostic (new student)
-- 1 = counting
-- 2 = addition
-- 3 = subtraction
-- 4 = multiplication
-- 5 = division
-- 6 = word problems
-- 7 = completed (ready for Grade 4 curriculum)
