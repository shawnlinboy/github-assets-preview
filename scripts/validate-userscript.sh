#!/usr/bin/env bash
set -euo pipefail

SCRIPT_FILE="github-assets-preview.user.js"

if [[ ! -f "$SCRIPT_FILE" ]]; then
  echo "[ERROR] Missing userscript: $SCRIPT_FILE"
  exit 1
fi

required_headers=(
  "// ==UserScript=="
  "// ==/UserScript=="
  "@name"
  "@version"
  "@description"
  "@match"
  "@grant"
  "@license"
)

for header in "${required_headers[@]}"; do
  if ! grep -Fq "$header" "$SCRIPT_FILE"; then
    echo "[ERROR] Missing required userscript header field: $header"
    exit 1
  fi
done

if ! command -v node >/dev/null 2>&1; then
  echo "[ERROR] node is required for syntax validation but was not found in PATH."
  exit 1
fi

if ! node --check "$SCRIPT_FILE" >/dev/null 2>&1; then
  echo "[ERROR] JavaScript syntax check failed: $SCRIPT_FILE"
  node --check "$SCRIPT_FILE"
  exit 1
fi

echo "[OK] All checks passed."
