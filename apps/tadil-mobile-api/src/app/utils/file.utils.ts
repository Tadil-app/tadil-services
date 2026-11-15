import { BadRequestException } from '@nestjs/common';
import { promises } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';

export function filterImageFiles(
  _req: Request,
  file: Express.Multer.File,
  cb: (err: Error | null, acceptFile: boolean) => void
) {
  // Accept images only
  // No SVG: it can carry script, and files are served from the API's address.
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const isMimeTypeValid = allowedMimeTypes.includes(file.mimetype);
  const isExtensionValid = RegExp(/\.(jpg|jpeg|png|webp)$/).test(
    file.originalname.toLowerCase()
  );
  if (!isMimeTypeValid || !isExtensionValid) {
    return cb(
      new BadRequestException('Only jpg, jpeg, png and webp files are allowed!'),
      false
    );
  }
  cb(null, true);
}

export function filterChatFiles(
  _req: Request,
  file: Express.Multer.File,
  cb: (err: Error | null, acceptFile: boolean) => void
) {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/aac',
    'audio/m4a',
    'audio/mp4',
    'audio/x-m4a',
    'audio/webm',
  ];
  const isMimeTypeValid = allowedMimeTypes.includes(file.mimetype.split(';')[0]);
  const isExtensionValid = RegExp(/\.(jpg|jpeg|png|webp|mp3|wav|ogg|aac|m4a|mp4|webm)$/).test(
    file.originalname.toLowerCase()
  );

  if (!isMimeTypeValid || !isExtensionValid) {
    return cb(
      new BadRequestException(
        'Invalid file type! Supported formats: images (jpg, png, webp) and audio (mp3, wav, m4a, mp4, ogg, aac, webm)'
      ),
      false
    );
  }
  cb(null, true);
}

/** Phone photos and voice notes fit well under this. */
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

export const fileUploadLocalPath = {
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 },
  storage: diskStorage({
    destination: './uploads',
    filename: (_req, file, cb) => {
      const fileExtension = extname(file.originalname);
      cb(null, uuidv4() + fileExtension);
    },
  }),
  fileFilter: filterImageFiles,
};

export const chatFileUploadOptions = {
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 },
  storage: diskStorage({
    destination: './uploads',
    filename: (_req, file, cb) => {
      const fileExtension = extname(file.originalname);
      cb(null, uuidv4() + fileExtension);
    },
  }),
  fileFilter: filterChatFiles,
};

export async function cleanupLocalFile(filePath: string) {
  try {
    await promises.unlink(filePath);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (cleanupError: any) {
    if (cleanupError.code !== 'ENOENT')
      console.error(
        `Failed to delete temporary file ${filePath}:`,
        cleanupError
      );
  }
}

export async function streamToBase64(stream: Readable): Promise<string> {
  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const buffer = Buffer.concat(chunks);
  return 'data:image/*;base64,' + buffer.toString('base64');
}
