-- Education for Equality - Curriculum Database Schema
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- =============================================
-- TABLES
-- =============================================

-- Grade levels (4-12)
CREATE TABLE IF NOT EXISTS grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subjects (Math, English, Science, Social Studies)
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Units within a subject for a specific grade
CREATE TABLE IF NOT EXISTS units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grade_id UUID NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  standards_alignment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(grade_id, subject_id, title)
);

-- Lessons within units
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  video_url TEXT,
  video_source TEXT,
  external_link TEXT,
  duration_minutes INTEGER,
  order_index INTEGER NOT NULL,
  standards TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(unit_id, title)
);

-- User progress tracking
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- User profiles (grade selection, preferences)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL,
  selected_grade_id UUID REFERENCES grades(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_units_grade_subject ON units(grade_id, subject_id);
CREATE INDEX IF NOT EXISTS idx_lessons_unit ON lessons(unit_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson ON user_progress(lesson_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Public read access for curriculum content
CREATE POLICY "Public read access for grades" ON grades FOR SELECT USING (true);
CREATE POLICY "Public read access for subjects" ON subjects FOR SELECT USING (true);
CREATE POLICY "Public read access for units" ON units FOR SELECT USING (true);
CREATE POLICY "Public read access for lessons" ON lessons FOR SELECT USING (true);

-- User progress - users can only see/modify their own progress
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- User profiles - users can only see/modify their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- =============================================
-- SEED DATA: Grades and Subjects
-- =============================================

-- Insert grades 4-12
INSERT INTO grades (number, name, description, order_index) VALUES
  (4, 'Grade 4', 'Fourth grade - Ages 9-10', 1),
  (5, 'Grade 5', 'Fifth grade - Ages 10-11', 2),
  (6, 'Grade 6', 'Sixth grade - Ages 11-12', 3),
  (7, 'Grade 7', 'Seventh grade - Ages 12-13', 4),
  (8, 'Grade 8', 'Eighth grade - Ages 13-14', 5),
  (9, 'Grade 9', 'Ninth grade - Ages 14-15', 6),
  (10, 'Grade 10', 'Tenth grade - Ages 15-16', 7),
  (11, 'Grade 11', 'Eleventh grade - Ages 16-17', 8),
  (12, 'Grade 12', 'Twelfth grade - Ages 17-18', 9)
ON CONFLICT (number) DO NOTHING;

-- Insert subjects
INSERT INTO subjects (name, slug, description, icon, color, order_index) VALUES
  ('Mathematics', 'mathematics', 'Numbers, operations, algebra, geometry, and problem-solving', '🔢', '#4F46E5', 1),
  ('English', 'english', 'Reading, writing, grammar, and communication skills', '📚', '#DC2626', 2),
  ('Science', 'science', 'Physical science, life science, and earth science', '🔬', '#059669', 3),
  ('Social Studies', 'social-studies', 'History, geography, civics, and economics', '🌍', '#D97706', 4)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- VERIFICATION
-- =============================================

-- Check tables were created
SELECT 'Tables created successfully!' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';