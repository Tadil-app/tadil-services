import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { CourierController } from './courier.controller';
import {
  CourierRepositoryProvider,
  AcceptCourierAssignmentUseCaseProvider,
  DeclineCourierAssignmentUseCaseProvider,
  ConfirmPickupUseCaseProvider,
  MarkAsDeliveredUseCaseProvider,
} from './courier.providers';

@Module({
  imports: [CommonModule],
  controllers: [CourierController],
  providers: [
    CourierRepositoryProvider,
    AcceptCourierAssignmentUseCaseProvider,
    DeclineCourierAssignmentUseCaseProvider,
    ConfirmPickupUseCaseProvider,
    MarkAsDeliveredUseCaseProvider,
  ],
})
export class CourierModule {}
