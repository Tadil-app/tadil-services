import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { CommonModule } from '../common/common.module';
import { AuthModule } from '../auth/auth.module';
import { WsAuthGuard } from '../auth/ws-auth.guard';
import { 
  SendMessageUseCaseProvider,
  DeleteMessageUseCaseProvider,
  EditMessageUseCaseProvider,
  ChatRepositoryProvider
} from './chat.providers';

@Module({
  imports: [CommonModule, AuthModule],
  controllers: [ChatController],
  providers: [
    WsAuthGuard,
    ChatGateway,
    SendMessageUseCaseProvider,
    DeleteMessageUseCaseProvider,
    EditMessageUseCaseProvider,
    ChatRepositoryProvider,
  ],
})
export class ChatModule {}
