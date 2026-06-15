import { advisorProfiles } from '@/lib/advisor-board';
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

export const runtime = 'nodejs';

type GmailToken = {
  access_token?: string;
  refresh_token?: string;
  expiry_date?: number;
  token_type?: string;
};

type ClientSecret = {
  installed?: {
    client_id?: string;
    client_secret?: string;
  };
  web?: {
    client_id?: string;
    client_secret?: string;
  };
};

const TOKEN_PATH =
  process.env.GMAIL_TOKEN_PATH || '/Users/naomiivie/bethel/email-agent/oauth/token.json';
const CLIENT_SECRET_PATH =
  process.env.GMAIL_CLIENT_SECRET_PATH || '/Users/naomiivie/bethel/email-agent/oauth/client_secret.json';

function jsonResponse(body: unknown, status = 200) {
  return Response.json(body, { status });
}

function base64Url(input: string) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function cleanHeader(value: string) {
  return value.replace(/[\r\n]/g, ' ').trim();
}

function buildRawEmail(to: string, subject: string, body: string) {
  const lines = [
    `To: ${cleanHeader(to)}`,
    `Subject: ${cleanHeader(subject)}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    body,
  ];
  return base64Url(lines.join('\r\n'));
}

async function readToken(): Promise<GmailToken | null> {
  if (!existsSync(TOKEN_PATH)) return null;
  return JSON.parse(await readFile(TOKEN_PATH, 'utf8')) as GmailToken;
}

async function refreshToken(token: GmailToken): Promise<GmailToken> {
  if (!token.refresh_token) return token;
  if (token.expiry_date && token.expiry_date > Date.now() + 60_000 && token.access_token) return token;

  const secret = JSON.parse(await readFile(CLIENT_SECRET_PATH, 'utf8')) as ClientSecret;
  const client = secret.installed || secret.web;
  if (!client?.client_id || !client.client_secret) return token;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: client.client_id,
      client_secret: client.client_secret,
      refresh_token: token.refresh_token,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) return token;
  const refreshed = (await response.json()) as GmailToken & { expires_in?: number };
  const nextToken: GmailToken = {
    ...token,
    ...refreshed,
    expiry_date: refreshed.expires_in ? Date.now() + refreshed.expires_in * 1000 : token.expiry_date,
  };
  await writeFile(TOKEN_PATH, JSON.stringify(nextToken, null, 2));
  return nextToken;
}

async function gmailFetch(path: string, token: GmailToken, init?: RequestInit) {
  if (!token.access_token) throw new Error('Gmail token is missing access_token.');
  return fetch(`https://gmail.googleapis.com/gmail/v1/users/me/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });
}

async function getGmailToken() {
  const token = await readToken();
  if (!token) {
    return { error: 'Gmail is not connected. Run the Bethel email-agent OAuth setup first.' };
  }
  const refreshed = await refreshToken(token);
  if (!refreshed.access_token) {
    return { error: 'Gmail token exists but is not usable. Re-authorize the email agent.' };
  }
  return { token: refreshed };
}

function requireKnownAdvisor(advisorId: string, to?: string) {
  const advisor = advisorProfiles.find((item) => item.id === advisorId);
  if (!advisor) return { error: 'Unknown advisor.' };
  const recipient = to || advisor.email;
  if (!recipient) return { error: 'This advisor needs an email address before Gmail actions can run.' };
  return { advisor, recipient };
}

async function syncAdvisor(advisorId: string, token: GmailToken) {
  const advisor = advisorProfiles.find((item) => item.id === advisorId);
  const email = advisor?.email;
  if (!advisor || !email) {
    return { advisorId, connected: true, needsEmail: true };
  }

  const query = encodeURIComponent(`from:${email} OR to:${email} newer_than:180d`);
  const listResponse = await gmailFetch(`messages?q=${query}&maxResults=10`, token);
  if (!listResponse.ok) {
    return { advisorId, connected: true, error: await listResponse.text() };
  }

  const messages = ((await listResponse.json()) as { messages?: { id: string; threadId: string }[] }).messages || [];
  const summaries = await Promise.all(
    messages.slice(0, 5).map(async (message) => {
      const metaResponse = await gmailFetch(
        `messages/${message.id}?format=metadata&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Subject&metadataHeaders=Date`,
        token,
      );
      const meta = (await metaResponse.json()) as {
        id: string;
        threadId: string;
        snippet?: string;
        payload?: { headers?: { name: string; value: string }[] };
      };
      const headers = Object.fromEntries(
        (meta.payload?.headers || []).map((header) => [header.name.toLowerCase(), header.value]),
      );
      return {
        id: meta.id,
        threadId: meta.threadId,
        from: headers.from || '',
        to: headers.to || '',
        subject: headers.subject || '',
        date: headers.date || '',
        snippet: meta.snippet || '',
      };
    }),
  );

  const inbound = summaries.find((message) => message.from.toLowerCase().includes(email.toLowerCase()));
  const outbound = summaries.find((message) => message.to.toLowerCase().includes(email.toLowerCase()));

  return {
    advisorId,
    connected: true,
    messageCount: messages.length,
    lastInbound: inbound,
    lastOutbound: outbound,
    latest: summaries[0],
  };
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    action?: 'sync' | 'draft' | 'send';
    advisorId?: string;
    to?: string;
    subject?: string;
    messageBody?: string;
    confirmSend?: boolean;
  };

  if (!body.action || !body.advisorId) {
    return jsonResponse({ error: 'Missing action or advisorId.' }, 400);
  }

  const tokenResult = await getGmailToken();
  if ('error' in tokenResult) {
    return jsonResponse({ connected: false, error: tokenResult.error }, 200);
  }

  if (body.action === 'sync') {
    return jsonResponse(await syncAdvisor(body.advisorId, tokenResult.token));
  }

  const advisorResult = requireKnownAdvisor(body.advisorId, body.to);
  if ('error' in advisorResult) {
    return jsonResponse({ connected: true, error: advisorResult.error }, 400);
  }

  if (!body.subject || !body.messageBody) {
    return jsonResponse({ connected: true, error: 'Missing subject or message body.' }, 400);
  }

  const raw = buildRawEmail(advisorResult.recipient, body.subject, body.messageBody);
  const endpoint = body.action === 'send' ? 'messages/send' : 'drafts';
  const payload =
    body.action === 'send' ? { raw } : { message: { raw } };

  if (body.action === 'send' && !body.confirmSend) {
    return jsonResponse({ connected: true, error: 'Send requires explicit confirmSend=true.' }, 400);
  }

  const response = await gmailFetch(endpoint, tokenResult.token, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return jsonResponse({ connected: true, error: await response.text() }, 500);
  }

  return jsonResponse({
    connected: true,
    action: body.action,
    advisorId: body.advisorId,
    to: advisorResult.recipient,
    gmail: await response.json(),
  });
}
