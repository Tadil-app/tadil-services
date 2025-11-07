import { Readable } from 'stream';
import { ReadableFile } from './models';

export interface FileStorageService {
  isFileExists(fileId: string): Promise<boolean>;
  uploadFile(file: ReadableFile): Promise<string>;
  getFileUrl(fileId: string, expirySeconds: number): Promise<string>;
  downloadFile(fileId: string): Promise<Readable>;
  deleteFile(fileId: string): Promise<void>;
}
