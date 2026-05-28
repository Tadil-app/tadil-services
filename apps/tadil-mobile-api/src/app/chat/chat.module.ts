import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { CommonModule } from '../common/common.module';
import { 
  SendMessageUseCaseProvider,
  DeleteMessageUseCaseProvider,
  EditMessageUseCaseProvider,
  ChatRepositoryProvider
} from './chat.providers';

@Module({
  imports: [CommonModule],
  controllers: [ChatController],
  providers: [
    ChatGateway,
    SendMessageUseCaseProvider,
    DeleteMessageUseCaseProvider,
    EditMessageUseCaseProvider,
    ChatRepositoryProvider,
  ],
})
export class ChatModule {}
