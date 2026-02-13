import { Module } from '@nestjs/common';
import {
  UsersRepositoryProvider,
  CreateUserUseCaseProvider,
  UpdateUserUseCaseProvider,
  DeleteUserUseCaseProvider,
} from './users.providers';
import { CommonModule } from '../common/common.module';
import { CouriersController, TailorsController } from './controllers';

@Module({
  imports: [CommonModule],
  controllers: [TailorsController, CouriersController],
  providers: [
    UsersRepositoryProvider,
    CreateUserUseCaseProvider,
    UpdateUserUseCaseProvider,
    DeleteUserUseCaseProvider,
  ],
  exports: [],
})
export class UsersModule {}
