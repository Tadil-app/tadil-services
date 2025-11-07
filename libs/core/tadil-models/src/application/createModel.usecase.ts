import { ModelsRepository } from './models.repository';
import {
  FileStorageService,
  InfrastructureException,
  InvalidCommandException,
  ReadableFile,
} from '@tadil-common';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

export class CreateModelUseCase {
  private _modelsRepository: ModelsRepository;
  private _fileStorageService: FileStorageService;

  constructor(
    modelsRepository: ModelsRepository,
    fileStorageService: FileStorageService
  ) {
    this._modelsRepository = modelsRepository;
    this._fileStorageService = fileStorageService;
  }

  async execute(createModelCommand: CreateModelCommand): Promise<void> {
    if (!createModelCommand.englishName) {
      throw new InvalidCommandException('Model English Name is required');
    }
    if (!createModelCommand.arabicName) {
      throw new InvalidCommandException('Model Arabic Name is required');
    }
    if (!createModelCommand.hindiName) {
      throw new InvalidCommandException('Model Hindi Name is required');
    }
    if (!createModelCommand.urduName) {
      throw new InvalidCommandException('Model Urdu Name is required');
    }
    if (!createModelCommand.bengaliName) {
      throw new InvalidCommandException('Model Bengali Name is required');
    }
    if (!createModelCommand.imageFile) {
      throw new InvalidCommandException('Model Image is required');
    }

    try {
      const newModelId = uuidv4();

      const fileExtension = path.extname(createModelCommand.imageFile.path);
      const imageFileId = newModelId + fileExtension;
      await this._fileStorageService.uploadFile(
        imageFileId,
        createModelCommand.imageFile
      );

      try {
        await this._modelsRepository.createModel({
          id: newModelId,
          imageFileId: imageFileId,
          englishName: createModelCommand.englishName,
          arabicName: createModelCommand.arabicName,
          hindiName: createModelCommand.hindiName,
          urduName: createModelCommand.urduName,
          bengaliName: createModelCommand.bengaliName,
          sections: [],
        });
      } catch (error: unknown) {
        await this._fileStorageService.deleteFile(imageFileId);
        if (error instanceof Error)
          throw new InfrastructureException(error.message);
        else throw error;
      }
    } catch (uploadError: unknown) {
      if (uploadError instanceof Error)
        throw new InfrastructureException(uploadError.message);
      else throw uploadError;
    }
  }
}

export class CreateModelCommand {
  readonly englishName: string;
  readonly arabicName: string;
  readonly hindiName: string;
  readonly urduName: string;
  readonly bengaliName: string;
  readonly imageFile: ReadableFile;
  constructor(
    englishName: string,
    arabicName: string,
    hindiName: string,
    urduName: string,
    bengaliName: string,
    imageFile: ReadableFile
  ) {
    this.englishName = englishName;
    this.arabicName = arabicName;
    this.hindiName = hindiName;
    this.urduName = urduName;
    this.bengaliName = bengaliName;
    this.imageFile = imageFile;
  }
}
