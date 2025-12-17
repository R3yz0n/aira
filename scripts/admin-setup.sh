#!/usr/bin/env bash
# Helper to call the one-time admin setup endpoint.
# Usage: ./scripts/admin-setup.sh PASSWORD [SETUP_SECRET]

set -euo pipefail

# Load environment variables from .env if it exists
if [ -f "$(dirname "$0")/../.env" ]; then
  set -a
  source "$(dirname "$0")/../.env"
  set +a
fi

if [ -z "${ADMIN_EMAIL:-}" ]; then
  echo "Environment variable ADMIN_EMAIL must be set"
  exit 1
fi

if [ -z "${1:-}" ]; then
  echo "Usage: $0 PASSWORD [SETUP_SECRET]"
  exit 1
fi

PASSWORD="$1"
ARG_SECRET="${2:-}"

if [ -n "$ARG_SECRET" ]; then
  npx tsx scripts/create-admin.ts "$PASSWORD" "$ARG_SECRET"
else
  npx tsx scripts/create-admin.ts "$PASSWORD"
fi
