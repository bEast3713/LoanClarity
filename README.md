## LoanClarity (Hackathon Prototype)

STEM Education Loan Transparency Platform.

**Stack**: Next.js (App Router) · Supabase · n8n · Google Gemini · Vercel

### Run locally

```bash
npm install
npm run dev
```

The app will still run **without Supabase/Gemini** (it uses demo fallback data), but you’ll see limited features.

### Supabase setup (recommended)

- Create a Supabase project
- In the Supabase SQL editor, run:
  - `supabase/schema.sql`
  - `supabase/seed.sql`
- Copy `.env.local.example` → `.env.local` and fill:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (recommended for server routes)

### Gemini setup (AI Advisor)

- Set `GOOGLE_GEMINI_API_KEY` in `.env.local`

### n8n setup (alerts)

- Set `N8N_WEBHOOK_URL` in `.env.local`
- The dashboard “Set alert” will `POST /api/alerts` and trigger the webhook.

### Routes

- `/` landing + search
- `/dashboard` cost dashboard + EMI + schemes + AI chat
- `/alerts` info page (alert signup is in dashboard modal)
