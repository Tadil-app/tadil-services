import { Module } from '@nestjs/common';
import {
  InformationsRepositoryProvider,
  CreateInformationUseCaseProvider,
  UpdateInformationUseCaseProvider,
  DeleteInformationUseCaseProvider,
} from './informations.providers';
import { InformationsController } from './informations.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [InformationsController],
  providers: [
    InformationsRepositoryProvider,
    CreateInformationUseCaseProvider,
    UpdateInformationUseCaseProvider,
    DeleteInformationUseCaseProvider,
  ],
  exports: [],
})
export class InformationsModule {}
