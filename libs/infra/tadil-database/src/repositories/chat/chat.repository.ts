import { Chat, ChatMessage, ChatRepository } from '@tadil-chat';
import { MessageChannel, Prisma } from '@prisma/client';
import { DbClient } from '../../dbClient';

export class PrismaChatRepository implements ChatRepository {
  constructor(private readonly _db: DbClient) {}

  async getChat(orderId: string, channel: MessageChannel): Promise<Chat | undefined> {
    console.log(`[PrismaChatRepository] getChat: ${orderId}, ${channel}`);
    const chat = await this._db.chat.findUnique({
      where: {
        orderId_channel: {
          orderId,
          channel,
        },
      },
    });

    if (!chat) return undefined;

    return {
      id: chat.id,
      orderId: chat.orderId,
      channel: chat.channel,
      messages: chat.content as unknown as ChatMessage[],
      updatedAt: chat.updatedAt.toISOString(),
    };
  }

  async addMessage(orderId: string, channel: MessageChannel, message: ChatMessage): Promise<void> {
    console.log(`[PrismaChatRepository] addMessage: ${orderId}, ${channel}`);
    const existingChat = await this._db.chat.findUnique({
      where: {
        orderId_channel: {
          orderId,
          channel,
        },
      },
    });

    if (!existingChat) {
      await this._db.chat.create({
        data: {
          orderId,
          channel,
          content: [message] as unknown as Prisma.JsonArray,
        },
      });
    } else {
      const messages = Array.isArray(existingChat.content) ? (existingChat.content as any[]) : [];
      const updatedMessages = [...messages, message];

      await this._db.chat.update({
        where: { id: existingChat.id },
        data: {
          content: updatedMessages as unknown as Prisma.JsonArray,
        },
      });
    }
  }
}
