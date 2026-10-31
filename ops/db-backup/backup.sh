#!/bin/sh
# Daily logical backup of tadil-database, uploaded to one Google Drive folder.
# Dumps named tadil-*.dump and older than 7 days are removed from that folder only.
set -eu

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is not set" >&2
  exit 1
fi

missing=""
for name in GDRIVE_FOLDER_ID GDRIVE_TOKEN; do
  eval "value=\${$name:-}"
  if [ -z "$value" ]; then
    missing="$missing $name"
  fi
done
if [ -n "$missing" ]; then
  echo "Google Drive is not configured. Missing:$missing" >&2
  exit 1
fi

case "$GDRIVE_TOKEN" in
  "{"*) ;;
  *)
    echo "GDRIVE_TOKEN must be the one-line JSON printed by: rclone authorize \"drive\"" >&2
    exit 1
    ;;
esac

stamp=$(date -u +%Y-%m-%dT%H-%M-%SZ)
name="tadil-${stamp}.dump"
file="/tmp/${name}"

export HOME=/tmp
export RCLONE_CONFIG_GDRIVE_TYPE=drive
export RCLONE_CONFIG_GDRIVE_SCOPE=drive
export RCLONE_CONFIG_GDRIVE_ROOT_FOLDER_ID="$GDRIVE_FOLDER_ID"
export RCLONE_CONFIG_GDRIVE_TOKEN="$GDRIVE_TOKEN"

if [ -n "${GDRIVE_CLIENT_ID:-}" ] && [ -n "${GDRIVE_CLIENT_SECRET:-}" ]; then
  export RCLONE_CONFIG_GDRIVE_CLIENT_ID="$GDRIVE_CLIENT_ID"
  export RCLONE_CONFIG_GDRIVE_CLIENT_SECRET="$GDRIVE_CLIENT_SECRET"
fi

echo "Dumping database to ${name}"
pg_dump --format=custom --no-owner --no-acl --file="$file" "$DATABASE_URL"

echo "Uploading ${name}"
rclone copyto "$file" "gdrive:${name}" --retries 5 --low-level-retries 10

echo "Deleting dumps older than 7 days"
rclone delete gdrive: \
  --min-age 7d \
  --filter "+ tadil-*.dump" \
  --filter "- *" \
  --retries 5 \
  -v

rm -f "$file"
echo "Backup finished: ${name}"
