import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      classYear,
      email,
      major,
      githubUrl,
      technologies,
      bugStory,
      whySabi,
      creditPreference,
    } = body;

    const token = process.env.NOTION_TOKEN;
    const databaseId = '4152e312-927f-819e-8380-d711afdbcd47';

    if (!token) {
      return NextResponse.json(
        { error: 'Notion token not configured' },
        { status: 500 }
      );
    }

    const techString = Array.isArray(technologies) ? technologies.join(', ') : technologies || 'None listed';
    const notesContent = `Major: ${major || 'N/A'}\n\nTech Stack: ${techString}\n\nCSPL 493 Credit Preference: ${creditPreference || 'N/A'}\n\nWhy Sabi & Educational Access:\n${whySabi || 'N/A'}\n\nBug Hunt Diagnostic Story:\n${bugStory || 'N/A'}`;

    const notionPayload = {
      parent: { database_id: databaseId },
      properties: {
        'Candidate Name': {
          title: [{ text: { content: fullName || 'Anonymous Applicant' } }],
        },
        'Class Year': {
          select: { name: classYear ? `Class of ${classYear}` : 'Class of 2027' },
        },
        'Wesleyan Email': {
          email: email || null,
        },
        'GitHub / Portfolio': {
          url: githubUrl || null,
        },
        'Status': {
          select: { name: 'Applied' },
        },
        'Notes': {
          rich_text: [{ text: { content: notesContent.slice(0, 2000) } }],
        },
      },
    };

    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notionPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Notion API submission failed:', errorText);
      return NextResponse.json(
        { error: 'Failed to record application to Notion', details: errorText },
        { status: 502 }
      );
    }

    const result = await response.json();
    return NextResponse.json({ success: true, id: result.id });
  } catch (err: any) {
    console.error('Error in /api/apply:', err);
    return NextResponse.json(
      { error: 'Internal server error', message: err?.message },
      { status: 500 }
    );
  }
}

