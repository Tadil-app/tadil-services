import { Module } from '@nestjs/common';
import { DbClientProvider, DataReaderProvider } from './common.providers';

@Module({
  imports: [],
  providers: [DbClientProvider, DataReaderProvider],
  exports: [DbClientProvider, DataReaderProvider],
})
export class CommonModule {}
