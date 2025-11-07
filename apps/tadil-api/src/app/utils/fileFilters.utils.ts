import { BadRequestException } from "@nestjs/common";

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
      new BadRequestException('Only jpg, png and svg files are allowed!'),
      false
    );
  }
  cb(null, true);
}
