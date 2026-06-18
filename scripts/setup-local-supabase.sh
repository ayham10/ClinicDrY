#!/usr/bin/env bash
# Bring up a local Supabase backend for development and seed it with demo data.
#
# This is a DEV-ONLY convenience script for Cursor Cloud / local development.
# It is idempotent: safe to run repeatedly. It does NOT touch any hosted/prod
# Supabase project. Requires: Docker running + the `supabase` CLI on PATH.
#
# After it finishes you can sign into the admin portal (/admin/login) with:
#   email:    doctor@clinic.test
#   password: ClinicAdmin123!
set -euo pipefail

cd "$(dirname "$0")/.."
ROOT="$PWD"

ADMIN_EMAIL="doctor@clinic.test"
ADMIN_PASSWORD="ClinicAdmin123!"

if ! command -v supabase >/dev/null 2>&1; then
  echo "ERROR: supabase CLI not found on PATH. Install it first (see AGENTS.md)." >&2
  exit 1
fi

# 1. Initialise local supabase config if missing, then start the stack.
[ -f supabase/config.toml ] || (printf 'n\nn\n' | supabase init)
if ! supabase status >/dev/null 2>&1; then
  echo "==> Starting local Supabase stack (first run downloads images)..."
  supabase start
else
  echo "==> Local Supabase stack already running."
fi

# 2. Collect connection details from the running stack.
STATUS_JSON="$(supabase status -o json)"
API_URL=$(printf '%s' "$STATUS_JSON" | python3 -c "import sys,json;print(json.load(sys.stdin)['API_URL'])")
ANON_KEY=$(printf '%s' "$STATUS_JSON" | python3 -c "import sys,json;print(json.load(sys.stdin)['ANON_KEY'])")
SERVICE_KEY=$(printf '%s' "$STATUS_JSON" | python3 -c "import sys,json;print(json.load(sys.stdin)['SERVICE_ROLE_KEY'])")

DB_CONTAINER=$(docker ps --format '{{.Names}}' | grep -E '^supabase_db_' | head -n1)
if [ -z "$DB_CONTAINER" ]; then
  echo "ERROR: could not find the supabase_db_* container." >&2
  exit 1
fi
psql_db() { docker exec -i "$DB_CONTAINER" psql -U postgres -d postgres "$@"; }

# 3. Apply the schema (DDL + demo seed) only if it has not been applied yet.
TABLE_EXISTS=$(psql_db -tAc "select to_regclass('public.patients') is not null;")
if [ "$TABLE_EXISTS" != "t" ]; then
  echo "==> Applying supabase-schema.sql ..."
  psql_db -v ON_ERROR_STOP=1 < supabase-schema.sql >/dev/null
else
  echo "==> Schema already present; skipping schema/seed."
fi

# 4. Grant the anon/authenticated/service_role roles access to public tables.
#    The local CLI's default privileges only grant TRUNCATE/REFERENCES/TRIGGER,
#    so explicit grants are required for the app's queries (and RLS) to work.
echo "==> Applying public-schema grants ..."
psql_db -v ON_ERROR_STOP=1 >/dev/null <<'SQL'
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant all on all functions in schema public to anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
SQL

# 5. Ensure an admin auth user exists, then link it in admin_users.
echo "==> Ensuring admin user ($ADMIN_EMAIL) ..."
CREATE_RESP=$(curl -s -X POST "$API_URL/auth/v1/admin/users" \
  -H "apikey: $SERVICE_KEY" -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\",\"email_confirm\":true}")
ADMIN_ID=$(printf '%s' "$CREATE_RESP" | python3 -c "import sys,json;d=json.load(sys.stdin);print(d.get('id') or '')" 2>/dev/null || true)
if [ -z "$ADMIN_ID" ]; then
  # User already exists -> look it up.
  ADMIN_ID=$(curl -s "$API_URL/auth/v1/admin/users" \
    -H "apikey: $SERVICE_KEY" -H "Authorization: Bearer $SERVICE_KEY" \
    | python3 -c "import sys,json;u=[x for x in json.load(sys.stdin).get('users',[]) if x.get('email')=='$ADMIN_EMAIL'];print(u[0]['id'] if u else '')")
fi
if [ -z "$ADMIN_ID" ]; then
  echo "ERROR: could not create or find the admin user." >&2
  exit 1
fi
psql_db -v ON_ERROR_STOP=1 -v admin_id="$ADMIN_ID" -v admin_email="$ADMIN_EMAIL" >/dev/null <<'SQL'
insert into admin_users (id, email, full_name, role)
values (:'admin_id', :'admin_email', 'Dr. Yara Salem', 'doctor')
on conflict (id) do nothing;
SQL

# 6. Add a couple of appointments for *today* (only if none exist yet) so the
#    dashboard's "Today's Schedule" is populated.
TODAY_COUNT=$(psql_db -tAc "select count(*) from appointments where date = current_date;")
if [ "$TODAY_COUNT" = "0" ]; then
  echo "==> Adding demo appointments for today ..."
  psql_db -v ON_ERROR_STOP=1 >/dev/null <<'SQL'
insert into appointments (patient_id, treatment, date, time, status) values
  ((select id from patients where full_name='Sara Khalil'),  'invisalign',    current_date, '10:30', 'pending'),
  ((select id from patients where full_name='Lina Mansour'), 'botox-fillers', current_date, '13:00', 'confirmed');
SQL
fi

# 7. Write .env.local for the Next.js app (gitignored, deterministic for local).
echo "==> Writing .env.local ..."
cat > "$ROOT/.env.local" <<ENV
NEXT_PUBLIC_SUPABASE_URL=$API_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY
ENV

echo ""
echo "Local Supabase ready."
echo "  API:    $API_URL"
echo "  Studio: $(printf '%s' "$STATUS_JSON" | python3 -c "import sys,json;print(json.load(sys.stdin).get('STUDIO_URL',''))")"
echo "  Admin login -> $ADMIN_EMAIL / $ADMIN_PASSWORD"
echo "Now run:  npm run dev"
