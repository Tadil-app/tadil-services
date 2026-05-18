import { MessageChannel } from '@prisma/client';
import { ChatMessage, ChatRepository } from '../chat.repository';
import { v4 as uuid } from 'uuid';

export interface SendMessageCommand {
  orderId: string;
  senderId: string;
  channel: MessageChannel;
  type: 'TEXT' | 'IMAGE' | 'AUDIO';
  content: string;
  metadata?: any;
}

export class SendMessageUseCase {
  constructor(private readonly _chatRepository: ChatRepository) {}

  async execute(command: SendMessageCommand): Promise<ChatMessage> {
    const message: ChatMessage = {
      id: uuid(),
      senderId: command.senderId,
      type: command.type,
      content: command.content,
      timestamp: new Date().toISOString(),
      metadata: command.metadata,
    };

    await this._chatRepository.addMessage(command.orderId, command.channel, message);

    return message;
  }
}
