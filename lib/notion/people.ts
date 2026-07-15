import 'server-only';
import { NotionEnv, notionFetch, plainText } from './client';
import type { NotionPerson, TeamMember } from './types';

type NotionUserRaw = {
  object: 'user';
  id: string;
  type?: 'person' | 'bot';
  name?: string;
  avatar_url?: string | null;
  person?: { email?: string };
};

export async function listWorkspaceUsers(): Promise<NotionPerson[]> {
  const results: NotionUserRaw[] = [];
  let cursor: string | undefined;
  do {
    const qs = new URLSearchParams({ page_size: '100' });
    if (cursor) qs.set('start_cursor', cursor);
    const res = await notionFetch<{ results: NotionUserRaw[]; has_more: boolean; next_cursor?: string }>(
      `/users?${qs.toString()}`,
      { revalidate: 300, tags: ['notion:users'] },
    );
    results.push(...res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);

  return results
    .filter((u) => u.type === 'person')
    .map((u) => ({
      id: u.id,
      name: u.name ?? 'Unknown',
      email: u.person?.email,
      avatarUrl: u.avatar_url ?? undefined,
    }));
}

export function findUserByEmail(users: NotionPerson[], email: string | null | undefined): NotionPerson | undefined {
  if (!email) return undefined;
  const target = email.trim().toLowerCase();
  return users.find((u) => (u.email ?? '').trim().toLowerCase() === target);
}

export async function listTeamRoster(): Promise<TeamMember[]> {
  const res = await notionFetch<{ results: any[] }>(
    `/databases/${NotionEnv.peopleDb()}/query`,
    {
      method: 'POST',
      body: { page_size: 100 },
      revalidate: 300,
      tags: ['notion:team'],
    },
  );

  return res.results.map((page) => {
    const props = page.properties ?? {};
    const personArr = props['Person']?.people ?? [];
    const first = personArr[0];
    return {
      id: page.id,
      name: plainText(props['Name']?.title ?? []),
      about: plainText(props['About']?.rich_text ?? []),
      membershipType: props['Membership Type']?.select?.name ?? undefined,
      person: first
        ? {
            id: first.id,
            name: first.name ?? '',
            email: first.person?.email,
            avatarUrl: first.avatar_url ?? undefined,
          }
        : undefined,
    } as TeamMember;
  });
}
