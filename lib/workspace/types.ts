export const TASK_STATUSES = ['Not started', 'In progress', 'Blocked', 'Done'] as const;
export const TASK_PRIORITIES = ['P0', 'P1', 'P2', 'P3'] as const;
export const DOC_TYPES = ['Pitch', 'SOP', 'Legal', 'Curriculum', 'Grant', 'Telephony', 'Other'] as const;
export const SEATS = ['Founder', 'Ops', 'Tech', 'Telephony', 'Business', 'Advisor'] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type DocType = (typeof DOC_TYPES)[number];
export type Seat = (typeof SEATS)[number];

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
  created_by: string | null;
  signed_off_by: string | null;
  signed_off_at: string | null;
  created_at: string;
  updated_at: string;
  assignee?: WorkPerson | null;
};

export type WorkUpdate = {
  id: string;
  task_id: string | null;
  author: string;
  body: string;
  created_at: string;
};
