
import {
  DeleteSectionCommand,
  DeleteSectionUseCase,
} from '../application/deleteSection.usecase';
import { ModelsRepository } from '../application/models.repository';
import {
  InvalidCommandException,
  NotFoundException,
  InfrastructureException,
} from '@tadil-common';
import { Section } from '../application/model.model';

describe('DeleteSectionUseCase', () => {
  let modelsRepository: ModelsRepository;
  let deleteSectionUseCase: DeleteSectionUseCase;

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
    deleteSectionUseCase = new DeleteSectionUseCase(modelsRepository);
  });

  it('should delete a section successfully', async () => {
    const command = new DeleteSectionCommand('section-id');
    (modelsRepository.getSectionById as jest.Mock).mockResolvedValue({
      id: 'section-id',
    } as Section);
    await deleteSectionUseCase.execute(command);
    expect(modelsRepository.deleteSection).toHaveBeenCalledWith('section-id');
  });

  it('should throw InvalidCommandException if sectionId is not provided', async () => {
    const command = new DeleteSectionCommand('');
    await expect(deleteSectionUseCase.execute(command)).rejects.toThrow(
      new InvalidCommandException('Section ID is required')
    );
  });

  it('should throw NotFoundException if section not found', async () => {
    const command = new DeleteSectionCommand('section-id');
    (modelsRepository.getSectionById as jest.Mock).mockResolvedValue(undefined);
    await expect(deleteSectionUseCase.execute(command)).rejects.toThrow(
      new NotFoundException('Section not found')
    );
  });

  it('should throw InfrastructureException if repository throws error', async () => {
    const command = new DeleteSectionCommand('section-id');
    (modelsRepository.getSectionById as jest.Mock).mockResolvedValue({
      id: 'section-id',
    } as Section);
    (modelsRepository.deleteSection as jest.Mock).mockRejectedValue(new InfrastructureException('DB Error'));
    await expect(deleteSectionUseCase.execute(command)).rejects.toThrow(
      new InfrastructureException('DB Error')
    );
  });
});
