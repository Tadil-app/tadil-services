import { InvalidCommandException } from '@tadil-common';
import { UsersRepository } from './users.repository';

export class DeleteUserUseCase {
  private readonly _usersRepository: UsersRepository;
  constructor(usersRepository: UsersRepository) {
    this._usersRepository = usersRepository;
  }

  async execute(command: DeleteUserCommand): Promise<void> {
    if (!command.id) {
      throw new InvalidCommandException('User id is required');
    }

    const user = await this._usersRepository.getUserById(command.id);
    if (!user) {
      throw new InvalidCommandException('User not found');
    }

    await this._usersRepository.deleteUser(command.id);
  }
}

export class DeleteUserCommand {
  readonly id: string;

  constructor(id: string) {
    this.id = id;
  }
}
