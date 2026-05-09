import { User, LoginRequestStatusType, Address } from './user.model';

export interface UsersRepository {
  getUserById(id: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  getUsersByLoginRequestStatus(
    status: LoginRequestStatusType
  ): Promise<User[]>;
  createUser(user: User): Promise<void>;
  updateUser(user: User): Promise<void>;
  deleteUser(id: string): Promise<void>;

  // Address management
  getAddressesByUserId(userId: string): Promise<Address[]>;
  getAddressById(id: string): Promise<Address | undefined>;
  addAddress(address: Address): Promise<void>;
  updateAddress(address: Address): Promise<void>;
  deleteAddress(id: string): Promise<void>;
}
