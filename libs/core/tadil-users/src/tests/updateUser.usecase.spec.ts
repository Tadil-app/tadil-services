
import {
  UpdateUserCommand,
  UpdateUserUseCase,
} from '../application/updateUser.usecase';
import { UsersRepository } from '../application/users.repository';
import {
  InvalidCommandException,
  InfrastructureException,
} from '@tadil-common';
import { User, ROLE } from '../application/user.model';

describe('UpdateUserUseCase', () => {
  let usersRepository: UsersRepository;
  let updateUserUseCase: UpdateUserUseCase;

  beforeEach(() => {
    usersRepository = {
      createUser: jest.fn(),
      getUserById: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
      getUserByPhone: jest.fn(),
    };
    updateUserUseCase = new UpdateUserUseCase(usersRepository);
  });

  it('should update a user successfully', async () => {
    const command = new UpdateUserCommand(
      'user-id',
      'first',
      'last',
      'phone'
    );
    (usersRepository.getUserById as jest.Mock).mockResolvedValue({
      id: 'user-id',
      role: ROLE.CUSTOMER
    } as User);
    (usersRepository.getUserByPhone as jest.Mock).mockResolvedValue(undefined);
    await updateUserUseCase.execute(command);
    expect(usersRepository.updateUser).toHaveBeenCalled();
  });

  it('should throw InvalidCommandException if id is not provided', async () => {
    const command = new UpdateUserCommand(
      '',
      'first',
      'last',
      'phone'
    );
    await expect(updateUserUseCase.execute(command)).rejects.toThrow(
      new InvalidCommandException('User id is required')
    );
  });

  it('should throw InvalidCommandException if user not found', async () => {
    const command = new UpdateUserCommand(
      'user-id',
      'first',
      'last',
      'phone'
    );
    (usersRepository.getUserById as jest.Mock).mockResolvedValue(undefined);
    await expect(updateUserUseCase.execute(command)).rejects.toThrow(
      new InvalidCommandException('User not found')
    );
  });

  it('should throw InvalidCommandException if phone number is used by another user', async () => {
    const command = new UpdateUserCommand(
      'user-id',
      'first',
      'last',
      'phone'
    );
    (usersRepository.getUserById as jest.Mock).mockResolvedValue({
      id: 'user-id',
    } as User);
    (usersRepository.getUserByPhone as jest.Mock).mockResolvedValue({
      id: 'another-user-id',
    } as User);
    await expect(updateUserUseCase.execute(command)).rejects.toThrow(
      new InvalidCommandException('User Phone number already exists for another user')
    );
  });

  it('should throw InfrastructureException if repository throws error', async () => {
    const command = new UpdateUserCommand(
      'user-id',
      'first',
      'last',
      'phone'
    );
    (usersRepository.getUserById as jest.Mock).mockResolvedValue({
      id: 'user-id',
      role: ROLE.CUSTOMER
    } as User);
    (usersRepository.getUserByPhone as jest.Mock).mockResolvedValue(undefined);
    (usersRepository.updateUser as jest.Mock).mockRejectedValue(new Error('DB Error'));
    await expect(updateUserUseCase.execute(command)).rejects.toThrow(
      new InfrastructureException('DB Error')
    );
  });
});
