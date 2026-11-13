import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SendMessageUseCase, DeleteMessageUseCase, EditMessageUseCase } from '@tadil-chat';
import { Inject, UseGuards, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { DbClient } from '@tadil-database';
import { canAccessChat, findOrderParticipants, isChatChannel } from './chat-access';
import { WsAuthGuard } from '../auth/ws-auth.guard';
import { SendMessageDto } from './dtos/sendMessage.dto';
import { DeleteMessageDto } from './dtos/deleteMessage.dto';
import { EditMessageDto } from './dtos/editMessage.dto';
import { environment } from '../../environments/environment';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    @Inject('SendMessageUseCase')
    private readonly _sendMessageUseCase: SendMessageUseCase,
    @Inject('DeleteMessageUseCase')
    private readonly _deleteMessageUseCase: DeleteMessageUseCase,
    @Inject('EditMessageUseCase')
    private readonly _editMessageUseCase: EditMessageUseCase,
    private readonly _db: DbClient
  ) {
    this.logger.log('ChatGateway initialized');
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('joinOrderChat')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { orderId: string; channel: string }
  ) {
    await this._assertAccess(client, data?.orderId, data?.channel);
    const roomId = `order_${data.orderId}_${data.channel}`;
    await client.join(roomId);
    this.logger.log(`Client ${client.id} joined room ${roomId}`);
    // Plain object so the client receives it as the acknowledgement.
    return { joined: roomId };
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: SendMessageDto
  ) {
    const senderId = await this._assertAccess(client, dto?.orderId, dto?.channel);
    if (!['TEXT', 'IMAGE', 'AUDIO'].includes(dto.type) || typeof dto.content !== 'string' || !dto.content.trim()) {
      throw new WsException('Invalid message');
    }

    const message = await this._sendMessageUseCase.execute({
      ...dto,
      senderId,
    });

    const roomId = `order_${dto.orderId}_${dto.channel}`;
    
    // Map the message for the recipient (prepend URL if needed)
    const baseUrl = process.env.TADIL_MOBILE_API || `http://localhost:${environment.apiPort}`;
    const mappedMessage = {
      ...message,
      content: message.type !== 'TEXT' 
        ? `${baseUrl}/api/files/${message.content}` 
        : message.content,
    };

    this.logger.log(`Broadcasting message to room ${roomId}: ${JSON.stringify(mappedMessage)}`);
    this.server.to(roomId).emit('newMessage', mappedMessage);
    
    return mappedMessage;
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('deleteMessage')
  async handleDelete(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: DeleteMessageDto
  ) {
    const senderId = await this._assertAccess(client, dto?.orderId, dto?.channel);

    await this._deleteMessageUseCase.execute({
      ...dto,
      senderId,
    });

    const roomId = `order_${dto.orderId}_${dto.channel}`;
    this.logger.log(`Broadcasting deletion to room ${roomId}: ${dto.messageId}`);
    this.server.to(roomId).emit('messageDeleted', { messageId: dto.messageId });
    
    return { status: 'deleted' };
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('editMessage')
  async handleEdit(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: EditMessageDto
  ) {
    const senderId = await this._assertAccess(client, dto?.orderId, dto?.channel);

    await this._editMessageUseCase.execute({
      ...dto,
      senderId,
    });

    const roomId = `order_${dto.orderId}_${dto.channel}`;
    this.logger.log(`Broadcasting edit to room ${roomId}: ${dto.messageId}`);
    this.server.to(roomId).emit('messageEdited', { 
      messageId: dto.messageId, 
      newContent: dto.newContent 
    });
    
    return { status: 'edited' };
  }

  /**
   * Only the people on an order's chat may join, read or write it.
   * Returns the caller's user id.
   */
  private async _assertAccess(client: Socket, orderId: string, channel: string): Promise<string> {
    // @ts-expect-error - user is added by WsAuthGuard
    const userId: string = client.user?.sub;
    if (!isChatChannel(channel)) {
      throw new WsException('Unknown chat channel');
    }
    const order = await findOrderParticipants(this._db, orderId);
    if (!order || !canAccessChat(order, channel, userId)) {
      this.logger.warn(`User ${userId} denied access to chat ${orderId}/${channel}`);
      throw new WsException('Forbidden');
    }
    return userId;
  }
}
