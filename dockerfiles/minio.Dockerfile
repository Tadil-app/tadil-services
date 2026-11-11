FROM minio/minio:latest

# Copy the initialization script into the container
COPY dockerfiles/minio-init.sh /usr/local/bin/minio-init.sh

# Make the script executable inside the image
RUN chmod +x /usr/local/bin/minio-init.sh

# Set the script as the entrypoint
ENTRYPOINT ["/usr/local/bin/minio-init.sh"]

# Default command arguments passed to 'minio server'
CMD ["--console-address", ":9001", "/data"]
