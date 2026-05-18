import {
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Logger,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { MessageChannel } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadLocalPath } from '../utils';
import { ReadableFile, type FileStorageService } from '@tadil-common';
import { ChatRepository } from '@tadil-chat';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { environment } from '../../environments/environment';

@Controller('chat')
@ApiTags('Chat')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(
    @Inject('ChatRepository')
    private readonly _chatRepository: ChatRepository,
    @Inject('FileStorageService')
    private readonly _fileStorageService: FileStorageService
  ) {}

  @Get('/:orderId/:channel')
  @ApiOperation({ summary: 'Get chat history' })
  async getMessages(
    @Param('orderId') orderId: string,
    @Param('channel') channel: MessageChannel
  ) {
    this.logger.log(`Fetching chat history for order ${orderId} and channel ${channel}`);
    const chat = await this._chatRepository.getChat(orderId, channel);

    if (!chat) {
      this.logger.log(`No chat found for order ${orderId} and channel ${channel}`);
      return [];
    }

    this.logger.log(`Found ${chat.messages.length} messages for order ${orderId}`);

    const baseUrl = process.env.Tadil_MOBILE_API || `http://localhost:${environment.apiPort}`;

    return chat.messages.map((msg) => ({
      ...msg,
      content: msg.type !== 'TEXT' 
        ? `${baseUrl}/api/files/${msg.content}` 
        : msg.content,
    }));
  }


  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a file for chat (Image or Audio)' })
  @UseInterceptors(FileInterceptor('file', fileUploadLocalPath))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<string> {
    const imageFile: ReadableFile = {
      path: file.path,
      mimetype: file.mimetype,
      originalName: file.originalname,
      size: file.size,
    };

    const fileExtension = extname(imageFile.path);
    const fileId = uuidv4() + fileExtension;

    await this._fileStorageService.uploadFile(fileId, imageFile);

    // We return just the fileId, the client will then send it via WebSocket as 'content'
    return fileId;
  }
}
