export const environment = {
  production: false,
  apiPort: process.env.PORT || 4445,
  tadilDb: process.env.TADIL_DB,
  jwtSecret: process.env.JWT_SECRET,
  minio: {
    endpoint: process.env.MINIO_ENDPOINT,
    port: process.env.MINIO_PORT,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    useSSL: process.env.MINIO_USE_SSL,
    bucket: process.env.MINIO_BUCKET,
  },
};
