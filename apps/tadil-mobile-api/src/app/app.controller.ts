import { Controller, Get, Headers, Inject, Param, Query, Res } from '@nestjs/common';
import { type FileStorageService } from '@tadil-common';
import { DataReader } from '@tadil-database';
import { type Response } from 'express';
import { verifyFileToken } from './common/files/file.link';

@Controller('')
export class AppController {
  constructor(
    @Inject('FileStorageService')
    private readonly _fileStorageService: FileStorageService,
    private readonly _dataReader: DataReader
  ) {}

  @Get('files/:id')
  async getFileStream(
    @Param('id') fileId: string,
    @Query('token') token: string | undefined,
    @Headers('accept') accept: string | undefined,
    @Res() res: Response
  ) {
    // Catalog images are public. Everything else (order photos, chat media)
    // needs a signed link, which the API hands only to people on the order.
    const signed = verifyFileToken(token, fileId);
    if (!signed && !(await this._isCatalogImage(fileId))) {
      res.status(404).send('File not found');
      return;
    }

    try {
      const { contentType } = await this._fileStorageService.statFile(fileId);
      const fileStream = await this._fileStorageService.downloadFile(fileId);
      res.type(contentType || fileId);
      if (
        !contentType &&
        res.getHeader('Content-Type') === 'application/octet-stream' &&
        accept?.includes('image/')
      )
        res.type('image/jpeg');
      res.setHeader(
        'Cache-Control',
        signed ? 'private, max-age=86400' : 'public, max-age=31536000, immutable'
      );
      res.setHeader('Content-Disposition', `inline; filename="${fileId}"`);
      res.setHeader('X-Content-Type-Options', 'nosniff');
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

  private async _isCatalogImage(fileId: string): Promise<boolean> {
    const image = await this._dataReader.queries.modelImage.findFirst({
      where: { fileId },
      select: { id: true },
    });
    return image !== null;
  }
}
