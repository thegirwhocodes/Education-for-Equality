# Education for Equality

A free Khan Academy-style online learning platform for underprivileged children in Nigeria, using Cambridge Primary curriculum framework with OER content.

## Features

- Cambridge-aligned curriculum (Grade 4 available)
- Mathematics, English, Science, Social Studies
- Video lessons from Khan Academy
- User authentication with Clerk
- Progress tracking dashboard
- Mobile-friendly design

## Tech Stack

- **Framework:** Next.js 16 with TypeScript
- **Database:** Supabase
- **Authentication:** Clerk
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

## License

MIT