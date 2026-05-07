import { User, UsersRepository, LoginRequestStatusType } from '@tadil-users';
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
      loginRequestStatus: (user.loginRequestStatus as LoginRequestStatusType) ?? undefined,
      loginToken: user.loginToken ?? undefined,
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
      loginRequestStatus: (user.loginRequestStatus as LoginRequestStatusType) ?? undefined,
      loginToken: user.loginToken ?? undefined,
    };
  }

  async getUsersByLoginRequestStatus(
    status: LoginRequestStatusType
  ): Promise<User[]> {
    const users = await this._db.user.findMany({
      where: { loginRequestStatus: status },
    });
    return users.map((user) => ({
      ...user,
      email: user.email ?? undefined,
      loginRequestStatus: (user.loginRequestStatus as LoginRequestStatusType) ?? undefined,
      loginToken: user.loginToken ?? undefined,
    }));
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
        loginRequestStatus: user.loginRequestStatus,
        loginToken: user.loginToken,
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
        loginRequestStatus: user.loginRequestStatus,
        loginToken: user.loginToken,
      },
    });
  }

  async deleteUser(id: string): Promise<void> {
    await this._db.user.delete({
      where: { id },
    });
  }
}
