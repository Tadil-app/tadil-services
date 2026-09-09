import { Readable } from 'stream';
import { ReadableFile } from './models';

export interface FileMetadata {
  contentType?: string;
}

export interface FileStorageService {
  uploadFile(fileId: string, file: ReadableFile): Promise<string>;
  getFileUrl(fileId: string, expirySeconds?: number): Promise<string>;
  statFile(fileId: string): Promise<FileMetadata>;
  downloadFile(fileId: string): Promise<Readable>;
  deleteFile(fileId: string): Promise<void>;
}
