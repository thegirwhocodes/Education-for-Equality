export type TaskStatus = 'Not Started' | 'Next' | 'In Progress' | 'Waiting' | 'Blocked' | 'Done' | 'Dropped';
export type TaskPriority = 'P0' | 'P1' | 'P2' | 'P3';
export type TaskArea =
  | 'Partnerships'
  | 'Fundraising'
  | 'Pilot Ops'
  | 'Curriculum'
  | 'Evidence'
  | 'Product'
  | 'Telephony'
  | 'Safety'
  | 'Legal/IP'
  | 'Finance'
  | 'Admin';

export interface NotionPerson {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
}

export interface TaskRecord {
  id: string;
  url: string;
  title: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  area?: TaskArea;
  owners: NotionPerson[];
  dueDate?: string;
  definitionOfDone: string;
  notes: string;
  signedOffBy?: string;
  signedOffAt?: string;
  createdTime: string;
  lastEditedTime: string;
}

export interface DocRecord {
  id: string;
  url: string;
  name: string;
  type?: string;
  status?: string;
  audience?: string;
  link?: string;
  owners: NotionPerson[];
  notes: string;
  nextAction: string;
  version: string;
  lastEditedTime: string;
}

export interface TeamMember {
  id: string;
  name: string;
  about: string;
  membershipType?: string;
  person?: NotionPerson;
}

export type TaskStatusFilter = 'all' | 'open' | 'mine' | 'done';
