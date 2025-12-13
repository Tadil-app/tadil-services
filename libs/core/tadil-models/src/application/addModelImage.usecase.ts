import {
  FileStorageService,
  InfrastructureException,
  ReadableFile,
} from '@tadil-common';
import { ModelsRepository } from './models.repository';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export class AddModelImageUseCase {
  private _modelsRepository: ModelsRepository;
  private _fileStorageService: FileStorageService;

  constructor(
    modelsRepository: ModelsRepository,
    fileStorageService: FileStorageService
  ) {
    this._modelsRepository = modelsRepository;
    this._fileStorageService = fileStorageService;
  }

  async execute(addModelImageCommand: AddModelImageCommand) {
    if (!addModelImageCommand.modelId) {
      throw new Error('Model ID is required');
    }
    if (!addModelImageCommand.imageFile) {
      throw new Error('Image is required');
    }

    const model = await this._modelsRepository.getModelById(
      addModelImageCommand.modelId
    );
    if (!model) {
      throw new Error('Model not found');
    }

    const newImageId = uuidv4();
    const fileExtension = extname(addModelImageCommand.imageFile.path);
    const imageFileId = newImageId + fileExtension;

    try {
      await this._fileStorageService.uploadFile(
        imageFileId,
        addModelImageCommand.imageFile
      );

      try {
        await this._modelsRepository.addModelImage({
          id: newImageId,
          modelId: addModelImageCommand.modelId,
          fileId: imageFileId,
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

export class AddModelImageCommand {
  readonly modelId: string;
  readonly imageFile: ReadableFile;

  constructor(modelId: string, imageFile: ReadableFile) {
    this.modelId = modelId;
    this.imageFile = imageFile;
  }
}
