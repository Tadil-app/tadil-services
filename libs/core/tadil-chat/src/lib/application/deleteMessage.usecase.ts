import { MessageChannel } from '@prisma/client';
import { ChatRepository } from '../chat.repository';

export interface DeleteMessageCommand {
  orderId: string;
  channel: MessageChannel;
  messageId: string;
  senderId: string;
}

export class DeleteMessageUseCase {
  constructor(private readonly _chatRepository: ChatRepository) {}

  async execute(command: DeleteMessageCommand): Promise<void> {
    await this._chatRepository.deleteMessage(
      command.orderId,
      command.channel,
      command.messageId,
      command.senderId
    );
  }
}
