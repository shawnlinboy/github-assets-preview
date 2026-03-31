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

if grep -n $'\t' "$SCRIPT_FILE" >/dev/null; then
  echo "[ERROR] Found tab characters in $SCRIPT_FILE"
  grep -n $'\t' "$SCRIPT_FILE"
  exit 1
fi

echo "[OK] Userscript metadata and style checks passed."
