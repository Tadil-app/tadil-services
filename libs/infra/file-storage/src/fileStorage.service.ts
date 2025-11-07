import * as Minio from 'minio';
import { Readable } from 'stream';
import {
  FileStorageService,
  InfrastructureException,
  ReadableFile,
} from '@tadil-common';

export class MinioFileStorageService implements FileStorageService {
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor(
    endpoint: string,
    port: number,
    accessKey: string,
    secretKey: string,
    bucketName: string,
    useSSL: boolean
  ) {
    this.minioClient = new Minio.Client({
      endPoint: endpoint,
      port: port,
      accessKey: accessKey,
      secretKey: secretKey,
      useSSL: useSSL,
    });
    this.bucketName = bucketName;
  }

  public async uploadFile(file: ReadableFile): Promise<string> {
    try {
      const metaData = {
        ContentType: file.mimetype,
        OriginalName: file.originalName,
      };
      await this.minioClient.fPutObject(
        this.bucketName,
        file.originalName,
        file.path,
        metaData
      );
      return file.originalName;
    } catch (error: unknown) {
      if (error instanceof Error)
        throw new InfrastructureException(
          `Error uploading file: ${error.message}`
        );
      else throw new InfrastructureException(`Error uploading file: ${error}`);
    }
  }

  public async getFileUrl(
    fileId: string,
    expirySeconds: number
  ): Promise<string> {
    try {
      const url = await this.minioClient.presignedGetObject(
        this.bucketName,
        fileId,
        expirySeconds
      );
      return url;
    } catch (error: unknown) {
      if (error instanceof Error)
        throw new InfrastructureException(
          `Error getting file URL: ${error.message}`
        );
      else
        throw new InfrastructureException(`Error getting file URL: ${error}`);
    }
  }

  public async downloadFile(fileId: string): Promise<Readable> {
    try {
      const stream = await this.minioClient.getObject(this.bucketName, fileId);
      return stream;
    } catch (error: unknown) {
      if (error instanceof Error)
        throw new InfrastructureException(
          `Error downloading file: ${error.message}`
        );
      else
        throw new InfrastructureException(`Error downloading file: ${error}`);
    }
  }

  public async deleteFile(fileId: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.bucketName, fileId);
    } catch (error: unknown) {
      if (error instanceof Error)
        throw new InfrastructureException(
          `Error deleting file: ${error.message}`
        );
      else throw new InfrastructureException(`Error deleting file: ${error}`);
    }
  }
}
