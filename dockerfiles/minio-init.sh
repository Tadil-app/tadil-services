#!/bin/sh
#
# minio-init.sh
# Starts MinIO in the background, waits for it to be ready, creates the initial bucket,
# and then brings the server process back to the foreground.

set -e

# Start MinIO in the background
# Pass all arguments passed to this script to the minio command
minio server "$@" &

# Capture the PID of the background minio process
MINIO_PID=$!

echo "Waiting for MinIO server to be ready..."
# Loop until the `mc` command can successfully connect to the local server
until mc alias set myminio http://127.0.0.1:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD" > /dev/null 2>&1; do
  sleep 1
done

echo "MinIO server is ready."

# Check if the bucket name is provided
if [ -n "$MINIO_BUCKET" ]; then
  # Check if the bucket already exists
  if ! mc ls myminio/"$MINIO_BUCKET" > /dev/null 2>&1; then
    echo "Creating bucket: $MINIO_BUCKET"
    mc mb myminio/"$MINIO_BUCKET"
    # By default, the bucket is private. We leave it private as per requirements.
    echo "Bucket $MINIO_BUCKET created successfully (Private)."
  else
    echo "Bucket $MINIO_BUCKET already exists."
  fi
else
  echo "MINIO_BUCKET environment variable is not set. Skipping bucket creation."
fi

echo "Initialization complete. Bringing MinIO to foreground..."

# Bring the background process to the foreground so the container doesn't exit
wait $MINIO_PID
