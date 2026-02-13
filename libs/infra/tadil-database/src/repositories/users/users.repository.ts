import { User, UsersRepository } from '@tadil-users';
import { DbClient } from '../../dbClient';

export class PrismaUsersRepository implements UsersRepository {
  constructor(private readonly _db: DbClient) {}

  async getUserById(id: string): Promise<User | undefined> {
    const user = await this._db.user.findUnique({
      where: { id },
    });

    if (!user) return undefined;
    return {
      ...user,
      email: user.email ?? undefined,
    };
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const user = await this._db.user.findUnique({
      where: { phone },
    });
    if (!user) return undefined;
    return {
      ...user,
      email: user.email ?? undefined,
    };
  }

  async createUser(user: User): Promise<void> {
    await this._db.user.create({
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        email: user.email,
      },
    });
  }

  async updateUser(user: User): Promise<void> {
    await this._db.user.update({
      where: { id: user.id },
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        email: user.email,
      },
    });
  }

  async deleteUser(id: string): Promise<void> {
    await this._db.user.delete({
      where: { id },
    });
  }
}
