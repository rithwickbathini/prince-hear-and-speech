# Princy Hear and Speech Rehab

A production-ready website for a speech therapy, audiology and stroke rehabilitation clinic — a public marketing
site with a working, no-account-required appointment booking flow, plus an admin dashboard for managing
appointments, therapists, services and availability.

## Features

- Public site: Home, About, Services (grouped by category), Therapists, Contact, 404
- 5-step appointment booking wizard (service → therapist → date → time → details) with live slot availability
  and double-booking protection, ending in a confirmation screen with an appointment ID
- Admin dashboard behind JWT-authenticated login: KPI cards, a monthly calendar, recent appointments, full
  appointment management (confirm / cancel / complete / reschedule), and CRUD for therapists, services and
  weekly availability
- Floating WhatsApp button and Google Maps embed, both driven entirely by environment variables — no hard-coded
  clinic details anywhere in the code
- No patient accounts, no payments, no medical records stored — appointment metadata only

## Tech stack

- **Client**: React, TypeScript, Vite, Tailwind CSS v4, React Router, lucide-react
- **Server**: Node.js, Express, TypeScript, Zod validation, JWT (httpOnly cookie) auth, bcrypt password hashing
- **Database**: PostgreSQL via Prisma ORM

## Project structure

```
princy-hear-speech-rehab/
├── client/         React app (Vite)
├── server/         Express API
├── prisma/         schema.prisma + seed.ts (shared by both, lives at the repo root)
├── .env.example
└── package.json    npm workspaces root (client + server)
```

See the plan/architecture notes for the full breakdown of `client/src` and `server/src` — in short: components /
pages / layouts / hooks / services / types / utils on the client, and controllers / routes / middleware /
services / models / utils on the server.

## Getting started

### 1. Install dependencies

```bash
npm install
```

This installs the root, `client`, and `server` workspaces together.

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string (Neon, Supabase, or local Postgres) |
| `JWT_SECRET` | Long random string used to sign admin session tokens |
| `JWT_EXPIRES_IN` | Admin session lifetime (default `7d`) |
| `PORT` | API server port (default `5000`) |
| `CLIENT_URL` | URL of the running client, for CORS (default `http://localhost:5173`) |
| `VITE_API_URL` | Base API URL the client calls (default `http://localhost:5000/api`) |
| `VITE_WHATSAPP_NUMBER` | WhatsApp number in international format, digits only (e.g. `919876543210`). The floating WhatsApp button hides itself if this is blank. |
| `VITE_GOOGLE_MAPS_URL` | A Google Maps **embed** URL (Share → Embed a map → copy the `src`). The Contact page shows a placeholder if this is blank. |

### 3. Set up the database

```bash
npm run db:migrate   # creates tables from prisma/schema.prisma
npm run db:seed       # seeds an admin user, sample services, and placeholder therapists
```

The seed script prints the admin email/password it created (defaults to
`admin@princyhearandspeech.com` / `ChangeMe123!` unless `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` are set in
your environment) — **change this password after your first login.**

### 4. Run the app

```bash
npm run dev
```

This runs the API on `http://localhost:5000` and the client on `http://localhost:5173` together. Admin login
lives at `http://localhost:5173/admin/login`.

## Development commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Run client + server together |
| `npm run build` | Production build of both workspaces |
| `npm run typecheck` | `tsc` type-checking for both workspaces |
| `npm run lint` | ESLint for both workspaces |
| `npm run db:studio` | Open Prisma Studio to browse the database |

## Content & data notes

- **No clinic facts are hard-coded.** Address, phone, WhatsApp number, email, working hours, and the Google Maps
  embed are all placeholders (`[Clinic Address]`, etc.) or environment variables until the clinic provides them.
- **No fabricated credentials.** Seeded therapists use placeholder names/qualifications
  (`[Therapist Name]`, `[Qualification]`) — replace them via `/admin/therapists` (or re-run the seed with real
  data) once the clinic supplies real staff details.
- **No real photography is bundled.** Public pages use a styled `ImagePlaceholder` component (with descriptive
  `alt`-equivalent text) instead of stock photos, so the layout never implies a real photo that doesn't exist.
  Swap these for real `<img>` tags once the clinic provides photography.
- **Brand palette** is light/sky blue with a deeper blue for navigation and text, and a soft pink accent for the
  heart motif — based on the clinic's logo concept. The logo image itself is a raster reference, not a production
  asset; `client/src/assets/logo/` is ready for a vector export once one exists. Until then, the navbar/footer use
  a text lockup so nothing renders as a broken image.

## Deployment

1. Provision a PostgreSQL database (Neon, Supabase, RDS, etc.) and set `DATABASE_URL`.
2. Run `npm run db:deploy` (uses `prisma migrate deploy`, safe for production) and `npm run db:seed` once.
3. Build: `npm run build`. Serve `client/dist` as static files (e.g. behind a CDN/reverse proxy) and run
   `server/dist/index.js` (`npm run start -w server`) as the API process.
4. Set `NODE_ENV=production`, a strong `JWT_SECRET`, and `CLIENT_URL` to your real domain so cookies and CORS
   behave correctly.

## A note on Windows project paths

If you ever move or rename this folder on Windows, avoid `&` (or other `cmd.exe` special characters) in the
path — `npm run <script>` always shells out through `cmd.exe` on Windows, which splits commands on unescaped
`&`, breaking every npm script. This project was originally created at a path containing `&` and had to be
renamed for exactly this reason.
