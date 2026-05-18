import { Provider, Scope } from '@nestjs/common';
import { environment } from '../../environments/environment';
import { DataReader, DbClient } from '@tadil-database';
import { FileStorageService } from '@tadil-common';
import { MinioFileStorageService } from '@file-storage';

const DbClientProvider: Provider<DbClient> = {
  provide: DbClient,
  useFactory: () => {
    if (!environment.tadilDb) {
      throw new Error('TADIL_DB is not defined in global envs');
    }
    const client = new DbClient(environment.tadilDb);
    client.$connect();
    console.log('new DbClient created !');
    return client;
  },
  scope: Scope.DEFAULT,
};

const DataReaderProvider: Provider<DataReader> = {
  provide: DataReader,
  useFactory: (dbClient: DbClient) => {
    return new DataReader(dbClient);
  },
  inject: [DbClient],
  scope: Scope.DEFAULT,
};

const FileStorageProvider: Provider<FileStorageService> = {
  provide: 'FileStorageService',
  useFactory: () => {
    if (!environment.minio.endpoint) {
      throw new Error('MINIO_ENDPOINT is not defined in global envs');
    }
    if (!environment.minio.port) {
      throw new Error('MINIO_PORT is not defined in global envs');
    }
    if (!environment.minio.accessKey) {
      throw new Error('MINIO_ACCESS_KEY is not defined in global envs');
    }
    if (!environment.minio.secretKey) {
      throw new Error('MINIO_SECRET_KEY is not defined in global envs');
    }
    if (!environment.minio.bucket) {
      throw new Error('MINIO_BUCKET is not defined in global envs');
    }
    return new MinioFileStorageService(
      environment.minio.endpoint,
      Number.parseInt(environment.minio.port),
      environment.minio.accessKey,
      environment.minio.secretKey,
      environment.minio.bucket,
      environment.minio.useSSL == 'true'
    );
  },
  scope: Scope.DEFAULT,
};

export { DbClientProvider, DataReaderProvider, FileStorageProvider };
