
import {
  CreateUserCommand,
  CreateUserUseCase,
} from '../application/createUser.usecase';
import { UsersRepository } from '../application/users.repository';
import {
  InvalidCommandException,
  InfrastructureException,
} from '@tadil-common';
import { ROLE } from '../application/user.model';

jest.mock('uuid', () => ({ v4: () => 'mocked-uuid' }));

describe('CreateUserUseCase', () => {
  let usersRepository: UsersRepository;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    usersRepository = {
      createUser: jest.fn(),
      getUserById: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
      getUserByPhone: jest.fn(),
    };
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it('should create a user successfully', async () => {
    const command = new CreateUserCommand(
      'fist',
      'last',
      'phone',
      ROLE.CUSTOMER
    );
    (usersRepository.getUserByPhone as jest.Mock).mockResolvedValue(undefined);
    await createUserUseCase.execute(command);
    expect(usersRepository.createUser).toHaveBeenCalled();
  });

  it('should throw InvalidCommandException if firstName is not provided', async () => {
    const command = new CreateUserCommand(
      '',
      'last',
      'phone',
      ROLE.CUSTOMER
    );
    await expect(createUserUseCase.execute(command)).rejects.toThrow(
      new InvalidCommandException('First name is required')
    );
  });

  it('should throw InvalidCommandException if phone already exists', async () => {
    const command = new CreateUserCommand(
      'fist',
      'last',
      'phone',
      ROLE.CUSTOMER
    );
    (usersRepository.getUserByPhone as jest.Mock).mockResolvedValue({});
    await expect(createUserUseCase.execute(command)).rejects.toThrow(
      new InvalidCommandException('User Phone number already exists')
    );
  });

  it('should throw InfrastructureException if repository throws error', async () => {
    const command = new CreateUserCommand(
      'fist',
      'last',
      'phone',
      ROLE.CUSTOMER
    );
    (usersRepository.getUserByPhone as jest.Mock).mockResolvedValue(undefined);
    (usersRepository.createUser as jest.Mock).mockRejectedValue(
      new Error('DB Error')
    );
    await expect(createUserUseCase.execute(command)).rejects.toThrow(
      new InfrastructureException('DB Error')
    );
  });
});
