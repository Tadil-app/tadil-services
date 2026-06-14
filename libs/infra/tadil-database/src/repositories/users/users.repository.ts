import { User, UsersRepository, LoginRequestStatusType, Address } from '@tadil-users';
import { DbClient } from '../../dbClient';

type AddressRow = {
  id: string;
  cityId: number | null;
  cityNameAr: string;
  cityNameEn: string;
  cityNameBn: string;
  cityNameHi: string;
  cityNameUr: string;
  districtId: string | null;
  districtNameAr: string | null;
  districtNameEn: string | null;
  districtNameBn: string | null;
  districtNameHi: string | null;
  districtNameUr: string | null;
  street: string | null;
  streetAr: string | null;
  streetEn: string | null;
  streetBn: string | null;
  streetHi: string | null;
  streetUr: string | null;
  latitude: number | null;
  longitude: number | null;
  userId: string;
};

function toAddress(a: AddressRow): Address {
  return {
    id: a.id,
    cityId: a.cityId ?? undefined,
    cityNameAr: a.cityNameAr,
    cityNameEn: a.cityNameEn,
    cityNameBn: a.cityNameBn,
    cityNameHi: a.cityNameHi,
    cityNameUr: a.cityNameUr,
    districtId: a.districtId ?? undefined,
    districtNameAr: a.districtNameAr ?? undefined,
    districtNameEn: a.districtNameEn ?? undefined,
    districtNameBn: a.districtNameBn ?? undefined,
    districtNameHi: a.districtNameHi ?? undefined,
    districtNameUr: a.districtNameUr ?? undefined,
    street: a.street ?? undefined,
    streetAr: a.streetAr ?? undefined,
    streetEn: a.streetEn ?? undefined,
    streetBn: a.streetBn ?? undefined,
    streetHi: a.streetHi ?? undefined,
    streetUr: a.streetUr ?? undefined,
    latitude: a.latitude,
    longitude: a.longitude,
    userId: a.userId,
  };
}

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
      addresses: user.addresses.map(toAddress),
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
      addresses: user.addresses.map(toAddress),
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
      addresses: user.addresses.map(toAddress),
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
    return addresses.map(toAddress);
  }

  async getAddressById(id: string): Promise<Address | undefined> {
    const address = await this._db.address.findUnique({
      where: { id },
    });
    if (!address) return undefined;
    return toAddress(address);
  }

  async addAddress(address: Address): Promise<void> {
    await this._db.address.create({
      data: {
        id: address.id,
        cityId: address.cityId,
        cityNameAr: address.cityNameAr,
        cityNameEn: address.cityNameEn,
        cityNameBn: address.cityNameBn,
        cityNameHi: address.cityNameHi,
        cityNameUr: address.cityNameUr,
        districtId: address.districtId,
        districtNameAr: address.districtNameAr,
        districtNameEn: address.districtNameEn,
        districtNameBn: address.districtNameBn,
        districtNameHi: address.districtNameHi,
        districtNameUr: address.districtNameUr,
        street: address.street,
        streetAr: address.streetAr,
        streetEn: address.streetEn,
        streetBn: address.streetBn,
        streetHi: address.streetHi,
        streetUr: address.streetUr,
        latitude: address.latitude,
        longitude: address.longitude,
        userId: address.userId,
      },
    });
  }

  async updateAddress(address: Address): Promise<void> {
    await this._db.address.update({
      where: { id: address.id },
      data: {
        cityId: address.cityId,
        cityNameAr: address.cityNameAr,
        cityNameEn: address.cityNameEn,
        cityNameBn: address.cityNameBn,
        cityNameHi: address.cityNameHi,
        cityNameUr: address.cityNameUr,
        districtId: address.districtId,
        districtNameAr: address.districtNameAr,
        districtNameEn: address.districtNameEn,
        districtNameBn: address.districtNameBn,
        districtNameHi: address.districtNameHi,
        districtNameUr: address.districtNameUr,
        street: address.street,
        streetAr: address.streetAr,
        streetEn: address.streetEn,
        streetBn: address.streetBn,
        streetHi: address.streetHi,
        streetUr: address.streetUr,
        latitude: address.latitude,
        longitude: address.longitude,
      },
    });
  }

  async deleteAddress(id: string): Promise<void> {
    await this._db.address.delete({
      where: { id },
    });
  }
}
