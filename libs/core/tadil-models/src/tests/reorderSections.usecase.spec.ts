import {
  ReorderSectionsCommand,
  ReorderSectionsUseCase,
} from '../application/reorderSections.usecase';
import { ModelsRepository } from '../application/models.repository';
import {
  InvalidCommandException,
  NotFoundException,
} from '@tadil-common';

describe('ReorderSectionsUseCase', () => {
  let modelsRepository: ModelsRepository;
  let useCase: ReorderSectionsUseCase;

  beforeEach(() => {
    modelsRepository = {
      createModel: jest.fn(),
      getModelById: jest.fn(),
      updateModel: jest.fn(),
      deleteModel: jest.fn(),
      addModelImage: jest.fn(),
      deleteModelImage: jest.fn(),
      getModelImageById: jest.fn(),
      addSection: jest.fn(),
      deleteSection: jest.fn(),
      getSectionById: jest.fn(),
      updateSection: jest.fn(),
      reorderSections: jest.fn(),
    };
    useCase = new ReorderSectionsUseCase(modelsRepository);
  });

  it('reorders sections for an existing image', async () => {
    (modelsRepository.getModelImageById as jest.Mock).mockResolvedValue({
      id: 'image-id',
    });
    await useCase.execute(new ReorderSectionsCommand('image-id', ['a', 'b']));
    expect(modelsRepository.reorderSections).toHaveBeenCalledWith('image-id', [
      'a',
      'b',
    ]);
  });

  it('throws if model image is missing', async () => {
    (modelsRepository.getModelImageById as jest.Mock).mockResolvedValue(
      undefined
    );
    await expect(
      useCase.execute(new ReorderSectionsCommand('image-id', ['a']))
    ).rejects.toThrow(new NotFoundException('Model Image not found'));
  });

  it('throws if section ids are empty', async () => {
    await expect(
      useCase.execute(new ReorderSectionsCommand('image-id', []))
    ).rejects.toThrow(new InvalidCommandException('Section IDs are required'));
  });
});
