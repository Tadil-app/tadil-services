import { Provider } from '@nestjs/common';
import {
  ChatRepository,
  SendMessageUseCase,
  DeleteMessageUseCase,
  EditMessageUseCase,
} from '@tadil-chat';
import { DbClient, PrismaChatRepository } from '@tadil-database';

export const SendMessageUseCaseProvider: Provider = {
  provide: 'SendMessageUseCase',
  useFactory: (chatRepository: ChatRepository) => {
    return new SendMessageUseCase(chatRepository);
  },
  inject: ['ChatRepository'],
};

export const DeleteMessageUseCaseProvider: Provider = {
  provide: 'DeleteMessageUseCase',
  useFactory: (chatRepository: ChatRepository) => {
    return new DeleteMessageUseCase(chatRepository);
  },
  inject: ['ChatRepository'],
};

export const EditMessageUseCaseProvider: Provider = {
  provide: 'EditMessageUseCase',
  useFactory: (chatRepository: ChatRepository) => {
    return new EditMessageUseCase(chatRepository);
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
