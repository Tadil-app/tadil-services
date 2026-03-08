
import {
  DeleteUserCommand,
  DeleteUserUseCase,
} from '../application/deleteUser.usecase';
import { UsersRepository } from '../application/users.repository';
import {
  InvalidCommandException,
  InfrastructureException,
} from '@tadil-common';
import { User } from '../application/user.model';

describe('DeleteUserUseCase', () => {
  let usersRepository: UsersRepository;
  let deleteUserUseCase: DeleteUserUseCase;

  beforeEach(() => {
    usersRepository = {
      createUser: jest.fn(),
      getUserById: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
      getUserByPhone: jest.fn(),
    };
    deleteUserUseCase = new DeleteUserUseCase(usersRepository);
  });

  it('should delete a user successfully', async () => {
    const command = new DeleteUserCommand('user-id');
    (usersRepository.getUserById as jest.Mock).mockResolvedValue({
      id: 'user-id',
    } as User);
    await deleteUserUseCase.execute(command);
    expect(usersRepository.deleteUser).toHaveBeenCalledWith('user-id');
  });

  it('should throw InvalidCommandException if id is not provided', async () => {
    const command = new DeleteUserCommand('');
    await expect(deleteUserUseCase.execute(command)).rejects.toThrow(
      new InvalidCommandException('User id is required')
    );
  });

  it('should throw InvalidCommandException if user not found', async () => {
    const command = new DeleteUserCommand('user-id');
    (usersRepository.getUserById as jest.Mock).mockResolvedValue(undefined);
    await expect(deleteUserUseCase.execute(command)).rejects.toThrow(
      new InvalidCommandException('User not found')
    );
  });

  it('should throw InfrastructureException if repository throws error', async () => {
    const command = new DeleteUserCommand('user-id');
    (usersRepository.getUserById as jest.Mock).mockResolvedValue({
      id: 'user-id',
    } as User);
    (usersRepository.deleteUser as jest.Mock).mockRejectedValue(new InfrastructureException('DB Error'));
    await expect(deleteUserUseCase.execute(command)).rejects.toThrow(
      new InfrastructureException('DB Error')
    );
  });
});
