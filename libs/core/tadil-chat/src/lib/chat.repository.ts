import { MessageChannel } from '@prisma/client';

export interface ChatMessage {
  id: string;
  senderId: string;
  type: 'TEXT' | 'IMAGE' | 'AUDIO';
  content: string; // The message text, or the file URL
  timestamp: string;
  metadata?: any; // e.g., audio duration, image dimensions
}

export interface Chat {
  id: string;
  orderId: string;
  channel: MessageChannel;
  messages: ChatMessage[];
  updatedAt: string;
}

export interface ChatRepository {
  getChat(orderId: string, channel: MessageChannel): Promise<Chat | undefined>;
  addMessage(orderId: string, channel: MessageChannel, message: ChatMessage): Promise<void>;
}
