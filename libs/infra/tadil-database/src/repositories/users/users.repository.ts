import { User, UsersRepository, LoginRequestStatusType, Address } from '@tadil-users';
import { DbClient } from '../../dbClient';

export class PrismaUsersRepository implements UsersRepository {
  constructor(private readonly _db: DbClient) {}

  async getUserById(id: string): Promise<User | undefined> {
    const user = await this._db.user.findUnique({
      where: { id },
      include: { addresses: true },
    });

    if (!user) return undefined;
    return {
      ...user,
      email: user.email ?? undefined,
      loginRequestStatus: (user.loginRequestStatus as LoginRequestStatusType) ?? undefined,
      loginToken: user.loginToken ?? undefined,
      addresses: user.addresses.map((a) => ({
        ...a,
        street: a.street ?? undefined,
        district: a.district ?? undefined,
      })),
    };
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const user = await this._db.user.findUnique({
      where: { phone },
      include: { addresses: true },
    });
    if (!user) return undefined;
    return {
      ...user,
      email: user.email ?? undefined,
      loginRequestStatus: (user.loginRequestStatus as LoginRequestStatusType) ?? undefined,
      loginToken: user.loginToken ?? undefined,
      addresses: user.addresses.map((a) => ({
        ...a,
        street: a.street ?? undefined,
        district: a.district ?? undefined,
      })),
    };
  }

  async getUsersByLoginRequestStatus(
    status: LoginRequestStatusType
  ): Promise<User[]> {
    const users = await this._db.user.findMany({
      where: { loginRequestStatus: status },
      include: { addresses: true },
    });
    return users.map((user) => ({
      ...user,
      email: user.email ?? undefined,
      loginRequestStatus: (user.loginRequestStatus as LoginRequestStatusType) ?? undefined,
      loginToken: user.loginToken ?? undefined,
      addresses: user.addresses.map((a) => ({
        ...a,
        street: a.street ?? undefined,
        district: a.district ?? undefined,
      })),
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
        walletBalance: user.walletBalance ?? 0,
        commissionRate: user.commissionRate ?? 10,
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
        walletBalance: user.walletBalance,
        commissionRate: user.commissionRate,
      },
    });
  }

  async deleteUser(id: string): Promise<void> {
    await this._db.user.delete({
      where: { id },
    });
  }

  // Address Management
  async getAddressesByUserId(userId: string): Promise<Address[]> {
    const addresses = await this._db.address.findMany({
      where: { userId },
    });
    return addresses.map((a) => ({
      ...a,
      street: a.street ?? undefined,
      district: a.district ?? undefined,
    }));
  }

  async getAddressById(id: string): Promise<Address | undefined> {
    const address = await this._db.address.findUnique({
      where: { id },
    });
    if (!address) return undefined;
    return {
      ...address,
      street: address.street ?? undefined,
      district: address.district ?? undefined,
    };
  }

  async addAddress(address: Address): Promise<void> {
    await this._db.address.create({
      data: {
        id: address.id,
        city: address.city,
        street: address.street,
        district: address.district,
        userId: address.userId,
      },
    });
  }

  async updateAddress(address: Address): Promise<void> {
    await this._db.address.update({
      where: { id: address.id },
      data: {
        city: address.city,
        street: address.street,
        district: address.district,
      },
    });
  }

  async deleteAddress(id: string): Promise<void> {
    await this._db.address.delete({
      where: { id },
    });
  }
}
