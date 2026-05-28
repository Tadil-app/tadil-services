import { MessageChannel } from '@prisma/client';
import { ChatRepository } from '../chat.repository';

export interface EditMessageCommand {
  orderId: string;
  channel: MessageChannel;
  messageId: string;
  senderId: string;
  newContent: string;
}

export class EditMessageUseCase {
  constructor(private readonly _chatRepository: ChatRepository) {}

  async execute(command: EditMessageCommand): Promise<void> {
    await this._chatRepository.editMessage(
      command.orderId,
      command.channel,
      command.messageId,
      command.senderId,
      command.newContent
    );
  }
}
