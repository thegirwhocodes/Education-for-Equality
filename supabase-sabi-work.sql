-- Sabi Workspace: team, documents, tasks, status updates.
-- Run in Supabase SQL editor on project ffrezdtqagwdacvqcqgn.
-- Then run curriculum-app/supabase-sabi-knowledge.sql for Intelligence, projects, and partners.

CREATE TABLE IF NOT EXISTS sabi_work_people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  seat TEXT NOT NULL DEFAULT 'Ops',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_sabi_work_people_email
  ON sabi_work_people (lower(email))
  WHERE email IS NOT NULL AND email <> '';

CREATE TABLE IF NOT EXISTS sabi_work_docs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  doc_type TEXT NOT NULL DEFAULT 'Other',
  notes TEXT NOT NULL DEFAULT '',
  storage_path TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'application/octet-stream',
  byte_size INTEGER NOT NULL DEFAULT 0,
  uploaded_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sabi_work_docs_created ON sabi_work_docs (created_at DESC);

CREATE TABLE IF NOT EXISTS sabi_work_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Not started',
  priority TEXT NOT NULL DEFAULT 'P2',
  assignee_id UUID REFERENCES sabi_work_people(id) ON DELETE SET NULL,
  due_date DATE,
  notes TEXT NOT NULL DEFAULT '',
  linked_doc_id UUID REFERENCES sabi_work_docs(id) ON DELETE SET NULL,
  created_by TEXT,
  signed_off_by TEXT,
  signed_off_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sabi_work_tasks_status ON sabi_work_tasks (status);
CREATE INDEX IF NOT EXISTS idx_sabi_work_tasks_assignee ON sabi_work_tasks (assignee_id);

CREATE TABLE IF NOT EXISTS sabi_work_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES sabi_work_tasks(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sabi_work_updates_created ON sabi_work_updates (created_at DESC);

ALTER TABLE sabi_work_people ENABLE ROW LEVEL SECURITY;
ALTER TABLE sabi_work_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sabi_work_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE sabi_work_updates ENABLE ROW LEVEL SECURITY;

INSERT INTO storage.buckets (id, name, public)
VALUES ('sabi-work', 'sabi-work', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO sabi_work_people (name, email, seat)
SELECT v.name, v.email, v.seat
FROM (VALUES
  ('Naomi Ivie', 'naomi.ivie04@gmail.com', 'Founder'),
  ('Sonia Ivie', 'simplysonia30@gmail.com', 'Ops'),
  ('Remi Tanimola', NULL, 'Business'),
  ('Joshua Ivie', 'joshua.ivie@velocitypathways.com', 'Advisor'),
  ('Richard Odeyemi', 'ceo@corruptionobservatory.com', 'Advisor')
) AS v(name, email, seat)
WHERE NOT EXISTS (
  SELECT 1 FROM sabi_work_people p
  WHERE p.name = v.name
     OR (v.email IS NOT NULL AND lower(p.email) = lower(v.email))
);
