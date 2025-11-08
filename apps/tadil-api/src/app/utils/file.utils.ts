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
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
  const isMimeTypeValid = allowedMimeTypes.includes(file.mimetype);
  const isExtensionValid = RegExp(/\.(jpg|jpeg|png|svg)$/).test(
    file.originalname.toLowerCase()
  );
  if (!isMimeTypeValid || !isExtensionValid) {
    return cb(
      new BadRequestException('Only jpg, jpeg, png and svg files are allowed!'),
      false
    );
  }
  cb(null, true);
}

export const fileUploadLocalPath = {
  storage: diskStorage({
    destination: './uploads',
    filename: (_req, file, cb) => {
      const fileExtension = extname(file.originalname);
      cb(null, uuidv4() + fileExtension);
    },
  }),
  fileFilter: filterImageFiles,
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
