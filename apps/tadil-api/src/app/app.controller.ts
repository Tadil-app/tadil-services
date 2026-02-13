import { Controller, Get, Inject, Param, Res } from '@nestjs/common';
import { type FileStorageService } from '@tadil-common';
import { type Response } from 'express';

@Controller('')
export class AppController {
  constructor(
    @Inject('FileStorageService')
    private readonly _fileStorageService: FileStorageService
  ) {}

  @Get('files/:id')
  async getFileStream(@Param('id') fileId: string, @Res() res: Response) {
    try {
      const fileStream = await this._fileStorageService.downloadFile(fileId);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('Content-Disposition', `inline; filename="${fileId}"`);
      fileStream.on('error', (error) => {
        if (!res.headersSent) {
          res.status(500).send('Error in file retrieval: ' + error.message);
        }
      });
      fileStream.on('end', () => {
        res.end();
      });
      fileStream.pipe(res);
    } catch (error: unknown) {
      if (!res.headersSent) {
        if (error instanceof Error)
          res.status(500).send('Error while retrieving file: ' + error.message);
        else res.status(500).send('Error while retrieving file: ' + error);
      }
    }
  }
}
