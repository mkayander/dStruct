#!/usr/bin/env bash
# Idempotent Cursor Cloud "install" / update script (see .cursor/environment.json).
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "Starting PostgreSQL 16 database server"
if command -v service >/dev/null 2>&1; then
  sudo service postgresql start
else
  echo "WARNING: service command not found; ensure PostgreSQL is running" >&2
fi

if [ -s "${NVM_DIR:-$HOME/.nvm}/nvm.sh" ]; then
  # shellcheck source=/dev/null
  . "${NVM_DIR:-$HOME/.nvm}/nvm.sh"
fi

if [ -f .nvmrc ]; then
  nvm use
fi

ENV_TEMPLATE="${REPO_ROOT}/.cursor/cloud-agent.env.template"
if [ ! -f .env ]; then
  if [ ! -f "$ENV_TEMPLATE" ]; then
    echo "ERROR: missing .env and ${ENV_TEMPLATE}" >&2
    exit 1
  fi
  cp "$ENV_TEMPLATE" .env
  echo "Created .env from .cursor/cloud-agent.env.template"
fi

# load-env merges .env then .env.local; export defaults so postinstall works even if .env lacks keys
set -a
# shellcheck source=/dev/null
[ -f .env ] && . ./.env
[ -f .env.local ] && . ./.env.local
set +a

export DATABASE_URL="${DATABASE_URL:-postgresql://dstruct:dstruct@localhost:5432/dstruct}"
export PRISMA_FIELD_ENCRYPTION_KEY="${PRISMA_FIELD_ENCRYPTION_KEY:-dev-local-encryption-key-for-testing-only}"
export SKIP_ENV_VALIDATION="${SKIP_ENV_VALIDATION:-true}"

if command -v corepack >/dev/null 2>&1; then
  corepack enable
fi

pnpm install

# Schema push is safe to repeat; keeps fresh VMs aligned with prisma/schema.prisma
pnpm prisma:push

echo "Cloud agent update finished successfully"
