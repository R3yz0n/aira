#!/usr/bin/env bash
# Helper to run the Node password-update script.
# Usage: ./scripts/update-admin-password.sh NEW_PASSWORD [SCRIPT_SECRET]

set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "Usage: $0 NEW_PASSWORD [SCRIPT_SECRET]"
  exit 1
fi

NEW_PASSWORD="$1"
SCRIPT_SECRET_ARG="${2:-}"

if [ -n "$SCRIPT_SECRET_ARG" ]; then
  npx tsx scripts/set-admin-password.ts "$NEW_PASSWORD" "$SCRIPT_SECRET_ARG"
else
  # If ADMIN_SCRIPT_SECRET is set in env, the Node script will check it.
  npx tsx scripts/set-admin-password.ts "$NEW_PASSWORD"
fi
