import 'server-only';
import { NotionEnv, notionFetch, plainText } from './client';
import type { DocRecord, NotionPerson } from './types';

function extractPerson(u: any): NotionPerson {
  return {
    id: u.id,
    name: u.name ?? 'Unknown',
    email: u.person?.email,
    avatarUrl: u.avatar_url ?? undefined,
  };
}

export async function listDocs(): Promise<DocRecord[]> {
  const res = await notionFetch<{ results: any[] }>(
    `/databases/${NotionEnv.docsDb()}/query`,
    {
      method: 'POST',
      body: {
        page_size: 100,
        sorts: [{ timestamp: 'last_edited_time', direction: 'descending' }],
      },
      revalidate: 60,
      tags: ['notion:docs'],
    },
  );

  return res.results.map((page) => {
    const p = page.properties ?? {};
    return {
      id: page.id,
      url: page.url,
      name: plainText(p['Document Name']?.title ?? []),
      type: p['Type']?.select?.name ?? undefined,
      status: p['Status']?.status?.name ?? undefined,
      audience: p['Audience']?.select?.name ?? undefined,
      link: p['Link']?.url ?? undefined,
      owners: (p['Owner']?.people ?? []).map(extractPerson),
      notes: plainText(p['Notes']?.rich_text ?? []),
      nextAction: plainText(p['Next Action']?.rich_text ?? []),
      version: plainText(p['Version']?.rich_text ?? []),
      lastEditedTime: page.last_edited_time,
    } as DocRecord;
  });
}
