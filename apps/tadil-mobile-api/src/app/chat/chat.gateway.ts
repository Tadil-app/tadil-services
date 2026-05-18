import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SendMessageUseCase } from '@tadil-chat';
import { Inject, UseGuards, Logger } from '@nestjs/common';
import { WsAuthGuard } from '../auth/ws-auth.guard';
import { SendMessageDto } from './dtos/sendMessage.dto';
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
    private readonly _sendMessageUseCase: SendMessageUseCase
  ) {
    this.logger.log('ChatGateway initialized');
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('joinOrderChat')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { orderId: string; channel: string }
  ) {
    const roomId = `order_${data.orderId}_${data.channel}`;
    client.join(roomId);
    this.logger.log(`Client ${client.id} joined room ${roomId}`);
    return { event: 'joined', data: roomId };
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: SendMessageDto
  ) {
    // @ts-ignore - sub is added by WsAuthGuard
    const senderId = client.user.sub;

    const message = await this._sendMessageUseCase.execute({
      ...dto,
      senderId,
    });

    const roomId = `order_${dto.orderId}_${dto.channel}`;
    
    // Map the message for the recipient (prepend URL if needed)
    const baseUrl = process.env.Tadil_MOBILE_API || `http://localhost:${environment.apiPort}`;
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
}
