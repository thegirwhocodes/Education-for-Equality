-- Sabi RAG: Vector search for curriculum content
-- Run this migration on your Supabase instance to enable semantic search

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Curriculum embeddings table
CREATE TABLE IF NOT EXISTS curriculum_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id TEXT NOT NULL,
  chunk_text TEXT NOT NULL,
  chunk_type TEXT NOT NULL,  -- 'concept', 'example', 'practice', 'story', 'summary'
  module TEXT NOT NULL,      -- 'numeracy-0', 'numeracy-1', 'literacy-1', 'math-4-1', etc.
  subject TEXT NOT NULL,     -- 'numeracy', 'literacy', 'mathematics', 'english', etc.
  embedding vector(384),     -- all-MiniLM-L6-v2 dimensions
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Index for fast vector similarity search
CREATE INDEX IF NOT EXISTS idx_curriculum_embeddings_vector
  ON curriculum_embeddings
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 50);

-- 4. Index for filtered queries (by module/subject)
CREATE INDEX IF NOT EXISTS idx_curriculum_embeddings_module
  ON curriculum_embeddings (module);

CREATE INDEX IF NOT EXISTS idx_curriculum_embeddings_subject
  ON curriculum_embeddings (subject);

-- 5. RPC function for similarity search with optional module filter
CREATE OR REPLACE FUNCTION search_curriculum(
  query_embedding vector(384),
  match_count INT DEFAULT 3,
  filter_module TEXT DEFAULT NULL,
  filter_subject TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  lesson_id TEXT,
  chunk_text TEXT,
  chunk_type TEXT,
  module TEXT,
  subject TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ce.id,
    ce.lesson_id,
    ce.chunk_text,
    ce.chunk_type,
    ce.module,
    ce.subject,
    ce.metadata,
    1 - (ce.embedding <=> query_embedding) AS similarity
  FROM curriculum_embeddings ce
  WHERE
    (filter_module IS NULL OR ce.module = filter_module)
    AND (filter_subject IS NULL OR ce.subject = filter_subject)
  ORDER BY ce.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 6. Allow public read access (curriculum is OER)
ALTER TABLE curriculum_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for curriculum embeddings"
  ON curriculum_embeddings
  FOR SELECT
  USING (true);
