import 'server-only';
import { NotionEnv, notionFetch, plainText } from './client';
import type { NotionPerson, TaskArea, TaskPriority, TaskRecord, TaskStatus } from './types';

type NotionPageProps = Record<string, any>;
type NotionUserRef = { id: string; name?: string; avatar_url?: string | null; person?: { email?: string } };

function extractPerson(u: NotionUserRef): NotionPerson {
  return {
    id: u.id,
    name: u.name ?? 'Unknown',
    email: u.person?.email,
    avatarUrl: u.avatar_url ?? undefined,
  };
}

function propTitle(prop: any): string {
  return plainText(prop?.title ?? []);
}
function propText(prop: any): string {
  return plainText(prop?.rich_text ?? []);
}
function propSelect(prop: any): string | undefined {
  return prop?.select?.name ?? undefined;
}
function propStatus(prop: any): string | undefined {
  return prop?.status?.name ?? undefined;
}
function propDate(prop: any): string | undefined {
  return prop?.date?.start ?? undefined;
}
function propPeople(prop: any): NotionPerson[] {
  return (prop?.people ?? []).map(extractPerson);
}

function pageToTask(page: any): TaskRecord {
  const p: NotionPageProps = page.properties ?? {};
  return {
    id: page.id,
    url: page.url,
    title: propTitle(p['Task']),
    status: propStatus(p['Status']) as TaskStatus | undefined,
    priority: propSelect(p['Priority']) as TaskPriority | undefined,
    area: propSelect(p['Area']) as TaskArea | undefined,
    owners: propPeople(p['Owner']),
    dueDate: propDate(p['Due Date']),
    definitionOfDone: propText(p['Definition of Done']),
    notes: propText(p['Notes']),
    createdTime: page.created_time,
    lastEditedTime: page.last_edited_time,
  };
}

export interface ListTasksOptions {
  status?: TaskStatus[];
  excludeStatus?: TaskStatus[];
  ownerId?: string;
  pageSize?: number;
  revalidate?: number | false;
}

export async function listTasks(opts: ListTasksOptions = {}): Promise<TaskRecord[]> {
  const filters: any[] = [];

  if (opts.status?.length) {
    filters.push({
      or: opts.status.map((s) => ({ property: 'Status', status: { equals: s } })),
    });
  }
  if (opts.excludeStatus?.length) {
    for (const s of opts.excludeStatus) {
      filters.push({ property: 'Status', status: { does_not_equal: s } });
    }
  }
  if (opts.ownerId) {
    filters.push({ property: 'Owner', people: { contains: opts.ownerId } });
  }

  const body: any = {
    page_size: opts.pageSize ?? 100,
    sorts: [
      { property: 'Priority', direction: 'ascending' },
      { property: 'Due Date', direction: 'ascending' },
    ],
  };
  if (filters.length === 1) body.filter = filters[0];
  else if (filters.length > 1) body.filter = { and: filters };

  const res = await notionFetch<{ results: any[] }>(
    `/databases/${NotionEnv.tasksDb()}/query`,
    { method: 'POST', body, revalidate: opts.revalidate ?? 30, tags: ['notion:tasks'] },
  );
  return res.results.map(pageToTask);
}

export async function getTask(id: string): Promise<TaskRecord> {
  const page = await notionFetch<any>(`/pages/${id}`, { revalidate: 0 });
  return pageToTask(page);
}

export interface CreateTaskInput {
  title: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  area?: TaskArea;
  ownerIds?: string[];
  dueDate?: string;
  definitionOfDone?: string;
  notes?: string;
}

export async function createTask(input: CreateTaskInput): Promise<TaskRecord> {
  const properties: NotionPageProps = {
    Task: { title: [{ text: { content: input.title } }] },
  };
  if (input.status) properties.Status = { status: { name: input.status } };
  if (input.priority) properties.Priority = { select: { name: input.priority } };
  if (input.area) properties.Area = { select: { name: input.area } };
  if (input.ownerIds?.length) {
    properties.Owner = { people: input.ownerIds.map((id) => ({ id })) };
  }
  if (input.dueDate) properties['Due Date'] = { date: { start: input.dueDate } };
  if (input.definitionOfDone) {
    properties['Definition of Done'] = { rich_text: [{ text: { content: input.definitionOfDone } }] };
  }
  if (input.notes) properties.Notes = { rich_text: [{ text: { content: input.notes } }] };

  const page = await notionFetch<any>('/pages', {
    method: 'POST',
    body: {
      parent: { database_id: NotionEnv.tasksDb() },
      properties,
    },
    revalidate: 0,
  });
  return pageToTask(page);
}

export interface UpdateTaskInput {
  status?: TaskStatus;
  priority?: TaskPriority;
  area?: TaskArea;
  ownerIds?: string[];
  dueDate?: string | null;
  definitionOfDone?: string;
  notes?: string;
  title?: string;
}

export async function updateTask(id: string, input: UpdateTaskInput): Promise<TaskRecord> {
  const properties: NotionPageProps = {};
  if (input.title !== undefined) properties.Task = { title: [{ text: { content: input.title } }] };
  if (input.status !== undefined) properties.Status = { status: { name: input.status } };
  if (input.priority !== undefined) properties.Priority = { select: { name: input.priority } };
  if (input.area !== undefined) properties.Area = { select: { name: input.area } };
  if (input.ownerIds !== undefined) {
    properties.Owner = { people: input.ownerIds.map((oid) => ({ id: oid })) };
  }
  if (input.dueDate !== undefined) {
    properties['Due Date'] = input.dueDate ? { date: { start: input.dueDate } } : { date: null };
  }
  if (input.definitionOfDone !== undefined) {
    properties['Definition of Done'] = { rich_text: [{ text: { content: input.definitionOfDone } }] };
  }
  if (input.notes !== undefined) {
    properties.Notes = { rich_text: [{ text: { content: input.notes } }] };
  }

  const page = await notionFetch<any>(`/pages/${id}`, {
    method: 'PATCH',
    body: { properties },
    revalidate: 0,
  });
  return pageToTask(page);
}
