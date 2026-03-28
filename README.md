# Life OS

Premium personal dashboard web app built with Next.js 14, Supabase, Tailwind, shadcn/ui, TanStack Query, Zustand, Recharts, and Framer Motion.

## Stack

- Next.js 14 App Router
- TypeScript
- Supabase Auth + Postgres + Realtime
- Tailwind CSS + shadcn/ui
- TanStack Query + Zustand
- React Hook Form + Zod
- Recharts + Framer Motion

## Features

- `/dashboard`: greeting, interview countdown, today's schedule, quick-log habits, streaks, rotating quote banner
- `/study`: Jane Street prep board, study session log + chart, uni catch-up kanban
- `/training`: climbing log, gym log, workout templates, weekly schedule, overload nudges
- `/finance`: weekly budget, expenses, manual income, tutoring tracker, monthly chart
- `/habits`: daily six-habit checklist, 12-month heatmap, weekly review flow
- `/review`: journal-style weekly review archive
- `/auth`: email/password and magic-link auth

## Setup

1. Clone and install:

```bash
npm install
```

2. Create `.env.local` from `.env.example` and add:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. Apply the database schema.

If you use the Supabase CLI:

```bash
npx supabase db push
```

If you are targeting a hosted Supabase project without a linked local setup, run `supabase/migrations/001_init.sql` in the Supabase SQL editor.

4. Seed the default reference data.

Run `supabase/seed.sql` in the Supabase SQL editor, or use `psql` against your project database URL.

5. In Supabase Auth settings, set your Site URL and add your local redirect URL:

- Site URL: `http://localhost:3000`
- `http://localhost:3000/auth/callback`

If you also use `127.0.0.1` locally, add `http://127.0.0.1:3000/auth/callback` too.

6. Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase notes

- All user-owned rows are scoped by `auth.uid()` via RLS.
- `bootstrap_user_defaults(user_id uuid)` creates starter data for a new authenticated user.
- An `auth.users` trigger calls the bootstrap function automatically on sign-up.
- `seed.sql` seeds reference/template tables only; user-specific rows are copied from those defaults at bootstrap time.

## Deployment

Deploy to Vercel with the environment variables from `.env.example` or the placeholders in `vercel.json`.
