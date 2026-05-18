import { Provider } from '@nestjs/common';
import { ChatRepository, SendMessageUseCase } from '@tadil-chat';
import { DbClient, PrismaChatRepository } from '@tadil-database';

export const SendMessageUseCaseProvider: Provider = {
  provide: 'SendMessageUseCase',
  useFactory: (chatRepository: ChatRepository) => {
    return new SendMessageUseCase(chatRepository);
  },
  inject: ['ChatRepository'],
};

export const ChatRepositoryProvider: Provider = {
  provide: 'ChatRepository',
  useFactory: (dbClient: DbClient) => {
    return new PrismaChatRepository(dbClient);
  },
  inject: [DbClient],
};
