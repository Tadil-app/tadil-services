import { Module } from '@nestjs/common';
import {
  DbClientProvider,
  DataReaderProvider,
  FileStorageProvider,
} from './common.providers';

@Module({
  imports: [],
  providers: [DbClientProvider, DataReaderProvider, FileStorageProvider],
  exports: [DbClientProvider, DataReaderProvider, FileStorageProvider],
})
export class CommonModule {}
