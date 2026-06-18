<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

### What this app is
Two surfaces in one Next.js 16 (App Router, Turbopack) project for the "Dr. Yara Salem" dental clinic:
- **Public marketing site** (`/`, `/about`, `/treatments`, `/booking`) — fully static; the booking form just opens a WhatsApp link, so it needs **no backend**.
- **Admin staff portal** (`/admin/*`) — Supabase-backed (auth + Postgres). Login, dashboard, calendar, patients, appointments, analytics. This is the core product functionality and **requires Supabase env vars** (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) — without them `lib/supabase.ts` throws on import for any `/admin` route.

### Running the app
- Dev server: `npm run dev` (port 3000). Lint: `npm run lint` (see note below). Build/prod: `npm run build` / `npm start` — scripts are in `package.json`.
- `npm run lint` currently reports ~30 pre-existing errors in app code (e.g. `no-explicit-any`, `react-hooks/set-state-in-effect`). These are not environment issues; `next.config.ts` sets `eslint.ignoreDuringBuilds` + `typescript.ignoreBuildErrors`, so they don't block builds.

### Backend (local Supabase) — required for the admin portal
The repo's `supabase-schema.sql` is written for a hosted Supabase project. For local dev a full Supabase stack runs via Docker. **Requires Docker Engine + the `supabase` CLI** (installed in the environment during setup; if missing, install Docker per the standard Cloud Agent method and drop the `supabase`+`supabase-go` binaries from the CLI release tarball onto PATH — the CLI is a shim that needs `supabase-go` co-located).

Bring it all up (idempotent) with the committed helper:
```bash
sudo dockerd >/tmp/dockerd.log 2>&1 &   # daemon is NOT auto-started on a fresh VM; wait a few seconds
sudo chmod 666 /var/run/docker.sock      # so the non-root user can reach Docker
bash scripts/setup-local-supabase.sh     # supabase start + schema + grants + admin user + writes .env.local
npm run dev
```
Then sign in at `/admin/login` with `doctor@clinic.test` / `ClinicAdmin123!`.

Non-obvious caveats:
- **Docker 29 + fuse-overlayfs:** `/etc/docker/daemon.json` must set `"storage-driver": "fuse-overlayfs"` and `"features": { "containerd-snapshotter": false }`, and iptables must be `iptables-legacy`, or the daemon/containers won't run in this VM.
- **Grants are mandatory locally:** the local CLI's default privileges grant the `anon`/`authenticated` roles only `TRUNCATE/REFERENCES/TRIGGER` on new `public` tables, so the app gets `permission denied` (HTTP 403) until `grant ... on all tables in schema public` is applied. `scripts/setup-local-supabase.sh` does this; don't skip it.
- `.env.local` is gitignored; the helper script regenerates it from `supabase status`. Local anon/service keys are fixed demo defaults.
- `supabase start` is a service-startup step (downloads images on first run) — run it manually, never from the dependency update script.
