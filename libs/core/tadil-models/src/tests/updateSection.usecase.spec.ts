
import {
  UpdateSectionCommand,
  UpdateSectionUseCase,
} from '../application/updateSection.usecase';
import { ModelsRepository } from '../application/models.repository';
import {
  InvalidCommandException,
  NotFoundException,
  InfrastructureException,
} from '@tadil-common';
import { Section } from '../application/model.model';

describe('UpdateSectionUseCase', () => {
  let modelsRepository: ModelsRepository;
  let updateSectionUseCase: UpdateSectionUseCase;

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
    };
    updateSectionUseCase = new UpdateSectionUseCase(modelsRepository);
  });

  it('should update a section successfully', async () => {
    const command = new UpdateSectionCommand(
      'section-id',
      'test',
      'test',
      'test',
      'test',
      'test',
      [{ x: 1, y: 1 }],
      []
    );
    (modelsRepository.getSectionById as jest.Mock).mockResolvedValue({
      id: 'section-id',
    } as Section);
    await updateSectionUseCase.execute(command);
    expect(modelsRepository.updateSection).toHaveBeenCalled();
  });

  it('should throw InvalidCommandException if id is not provided', async () => {
    const command = new UpdateSectionCommand(
      '',
      'test',
      'test',
      'test',
      'test',
      'test',
      [{ x: 1, y: 1 }],
      []
    );
    await expect(updateSectionUseCase.execute(command)).rejects.toThrow(
      new InvalidCommandException('Section ID is required')
    );
  });

  it('should throw NotFoundException if section not found', async () => {
    const command = new UpdateSectionCommand(
      'section-id',
      'test',
      'test',
      'test',
      'test',
      'test',
      [{ x: 1, y: 1 }],
      []
    );
    (modelsRepository.getSectionById as jest.Mock).mockResolvedValue(undefined);
    await expect(updateSectionUseCase.execute(command)).rejects.toThrow(
      new NotFoundException('Section not found')
    );
  });

  it('should throw InfrastructureException if repository throws error', async () => {
    const command = new UpdateSectionCommand(
      'section-id',
      'test',
      'test',
      'test',
      'test',
      'test',
      [{ x: 1, y: 1 }],
      []
    );
    (modelsRepository.getSectionById as jest.Mock).mockResolvedValue({
      id: 'section-id',
    } as Section);
    (modelsRepository.updateSection as jest.Mock).mockRejectedValue(new Error('DB Error'));
    await expect(updateSectionUseCase.execute(command)).rejects.toThrow(
      new InfrastructureException('DB Error')
    );
  });
});
