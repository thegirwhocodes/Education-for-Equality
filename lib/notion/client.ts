import 'server-only';

const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

export class NotionError extends Error {
  readonly status: number;
  readonly code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function token() {
  const t = process.env.NOTION_TOKEN;
  if (!t) throw new NotionError(500, 'missing_token', 'NOTION_TOKEN not set in env');
  return t;
}

type FetchInit = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  revalidate?: number | false;
  tags?: string[];
};

export async function notionFetch<T>(path: string, init: FetchInit = {}): Promise<T> {
  const { method = 'GET', body, revalidate = 30, tags } = init;

  const nextOpts: { revalidate?: number; tags?: string[] } = {};
  if (revalidate === false) nextOpts.revalidate = 0;
  else nextOpts.revalidate = revalidate;
  if (tags?.length) nextOpts.tags = tags;

  const res = await fetch(`${NOTION_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token()}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
    next: nextOpts,
  });

  if (!res.ok) {
    let code = 'notion_error';
    let message = `Notion API ${res.status}`;
    try {
      const err = (await res.json()) as { code?: string; message?: string };
      if (err.code) code = err.code;
      if (err.message) message = err.message;
    } catch {}
    throw new NotionError(res.status, code, message);
  }

  return (await res.json()) as T;
}

export const NotionEnv = {
  tasksDb: () => requireEnv('NOTION_TASKS_DB_ID'),
  peopleDb: () => requireEnv('NOTION_PEOPLE_DB_ID'),
  docsDb: () => requireEnv('NOTION_DOCS_ASSETS_DB_ID'),
  contactsDb: () => process.env.NOTION_CONTACTS_DB_ID,
  orgCrmDb: () => process.env.NOTION_ORG_CRM_DB_ID,
  opportunitiesDb: () => process.env.NOTION_OPPORTUNITIES_DB_ID,
  roadmapDb: () => process.env.NOTION_ROADMAP_DB_ID,
  risksDb: () => process.env.NOTION_RISKS_DB_ID,
  pilotsDb: () => process.env.NOTION_PILOTS_DB_ID,
  sabiCommandCenterPage: () => process.env.NOTION_SABI_COMMAND_CENTER_PAGE_ID,
  sabiOsPage: () => process.env.NOTION_SABI_OS_PAGE_ID,
} as const;

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new NotionError(500, 'missing_env', `${name} not set`);
  return v;
}

export function plainText(rich: Array<{ plain_text?: string }> | undefined | null): string {
  if (!rich) return '';
  return rich.map((t) => t.plain_text ?? '').join('');
}
