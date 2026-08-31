export const TASK_STATUSES = ['Not started', 'In progress', 'Blocked', 'Done'] as const;
export const TASK_PRIORITIES = ['P0', 'P1', 'P2', 'P3'] as const;
export const DOC_TYPES = ['Pitch', 'SOP', 'Legal', 'Curriculum', 'Grant', 'Telephony', 'Other'] as const;
export const SEATS = ['Founder', 'Ops', 'Tech', 'Telephony', 'Business', 'Advisor'] as const;
export const PROJECT_STATUSES = ['Active', 'Paused', 'Done'] as const;
export const PARTNER_KINDS = ['telco', 'ngo', 'school', 'government', 'fund', 'other'] as const;

export const KNOWLEDGE_TYPES = [
  'problem',
  'need',
  'evidence',
  'insight',
  'assumption',
  'decision',
  'principle',
  'requirement',
  'design',
  'implementation',
  'experiment',
  'outcome',
  'claim',
] as const;

export const KNOWLEDGE_STATUSES = [
  'proposed',
  'active',
  'experimental',
  'validated',
  'unvalidated',
  'rejected',
  'superseded',
  'deprecated',
  'dormant',
] as const;

export const REL_TYPES = [
  'supported_by',
  'contradicted_by',
  'derived_from',
  'informed',
  'caused',
  'requires',
  'implements',
  'validates',
  'tested_by',
  'produced',
  'supersedes',
  'depends_on',
  'part_of',
  'used_in',
  'owned_by',
  'challenges',
] as const;

export const ARCHIVE_DOMAINS = [
  '1. The Problem',
  '2. The Solution',
  '3. The Evidence',
  '4. Telephony & Infrastructure',
  '5. Cost & Feasibility',
  '6. Pitch & Applications',
  '7. Legal & IP',
  '8. Partnerships & Outreach',
  '9. On the Ground',
  '10. Bakame',
  '11. Documentation',
] as const;

export const STT_DEFAULT_TASKS = [
  'Build gold clip set',
  'Replay clips',
  'Compare WER',
  'Compare false-wrong',
  'Compare latency',
  'Review Nigerian names',
  'Review literacy words',
];

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type DocType = (typeof DOC_TYPES)[number];
export type Seat = (typeof SEATS)[number];
export type KnowledgeType = (typeof KNOWLEDGE_TYPES)[number];
export type RelType = (typeof REL_TYPES)[number];

export type WorkPerson = {
  id: string;
  name: string;
  email: string | null;
  seat: string;
  active: boolean;
};

export type WorkDoc = {
  id: string;
  title: string;
  doc_type: string;
  notes: string;
  original_filename: string;
  content_type: string;
  byte_size: number;
  uploaded_by: string | null;
  created_at: string;
};

export type WorkTask = {
  id: string;
  title: string;
  status: string;
  priority: string;
  assignee_id: string | null;
  due_date: string | null;
  notes: string;
  linked_doc_id: string | null;
  project_id?: string | null;
  linked_knowledge_id?: string | null;
  created_by: string | null;
  signed_off_by: string | null;
  signed_off_at: string | null;
  created_at: string;
  updated_at: string;
  assignee?: WorkPerson | null;
  project?: WorkProject | null;
};

export type WorkUpdate = {
  id: string;
  task_id: string | null;
  author: string;
  body: string;
  created_at: string;
};

export type WorkProject = {
  id: string;
  title: string;
  status: string;
  owner_id: string | null;
  linked_knowledge_id: string | null;
  summary: string;
  created_from: string;
  due_date: string | null;
  created_at: string;
  updated_at?: string;
  owner?: WorkPerson | null;
  linked_item?: KnowledgeItem | null;
  tasks?: WorkTask[];
};

export type CompanyPartner = {
  id: string;
  name: string;
  kind: string;
  status: string;
  notes: string;
  linked_knowledge_id: string | null;
  created_at: string;
  linked_item?: KnowledgeItem | null;
};

export type KnowledgeItem = {
  id: string;
  code: string | null;
  type: string;
  title: string;
  summary: string;
  why_it_matters: string;
  status: string;
  confidence: string;
  origin_session_id: string | null;
  origin_commit_sha: string | null;
  decision_date: string | null;
  decision_maker: string | null;
  domain: string;
  caution: string;
  used_in: string;
  implements_path: string;
  product_area: string;
  created_at?: string;
};

export type KnowledgeRelationship = {
  id: string;
  from_id: string;
  to_id: string;
  rel: string;
  confidence: string;
  status: string;
  origin_session_id: string | null;
  origin_commit_sha: string | null;
  verified_by: string | null;
  verified_at: string | null;
  notes: string;
  from_item?: KnowledgeItem | null;
  to_item?: KnowledgeItem | null;
};

export type KnowledgeArtifact = {
  id: string;
  path: string;
  title: string;
  domain: string;
  format: string;
  sha: string | null;
  byte_size: number;
  purpose: string;
  last_reviewed_at: string | null;
};

export const ITEM_SELECT =
  'id,code,type,title,summary,why_it_matters,status,confidence,origin_session_id,origin_commit_sha,decision_date,decision_maker,domain,caution,used_in,implements_path,product_area,created_at';
