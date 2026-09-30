import { DeleteMyAccountUseCase } from '../application/deleteMyAccount.usecase';
import { UsersRepository } from '../application/users.repository';
import { InvalidCommandException } from '@tadil-common';
import { User } from '../application/user.model';

describe('DeleteMyAccountUseCase', () => {
  let usersRepository: UsersRepository;
  let useCase: DeleteMyAccountUseCase;

  beforeEach(() => {
    usersRepository = {
      createUser: jest.fn(),
      getUserById: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
      anonymizeAccount: jest.fn(),
      getUserByPhone: jest.fn(),
      getUsersByLoginRequestStatus: jest.fn(),
      getAddressesByUserId: jest.fn(),
      getAddressById: jest.fn(),
      addAddress: jest.fn(),
      updateAddress: jest.fn(),
      deleteAddress: jest.fn(),
    };
    useCase = new DeleteMyAccountUseCase(usersRepository);
  });

  it('anonymizes the signed-in account', async () => {
    (usersRepository.getUserById as jest.Mock).mockResolvedValue({
      id: 'user-id',
      phone: '0500000000',
    } as User);

    await useCase.execute('user-id');

    expect(usersRepository.anonymizeAccount).toHaveBeenCalledWith('user-id');
    expect(usersRepository.deleteUser).not.toHaveBeenCalled();
  });

  it('rejects a missing id', async () => {
    await expect(useCase.execute('')).rejects.toThrow(
      new InvalidCommandException('User id is required')
    );
  });

  it('rejects an unknown user', async () => {
    (usersRepository.getUserById as jest.Mock).mockResolvedValue(undefined);
    await expect(useCase.execute('user-id')).rejects.toThrow(
      new InvalidCommandException('User not found')
    );
  });

  it('rejects an account that is already deleted', async () => {
    (usersRepository.getUserById as jest.Mock).mockResolvedValue({
      id: 'user-id',
      phone: 'deleted-user-id',
    } as User);
    await expect(useCase.execute('user-id')).rejects.toThrow(
      new InvalidCommandException('Account already deleted')
    );
  });
});
