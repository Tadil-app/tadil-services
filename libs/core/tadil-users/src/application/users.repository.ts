import { User, LoginRequestStatusType } from './user.model';

export interface UsersRepository {
  getUserById(id: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  getUsersByLoginRequestStatus(
    status: LoginRequestStatusType
  ): Promise<User[]>;
  createUser(user: User): Promise<void>;
  updateUser(user: User): Promise<void>;
  deleteUser(id: string): Promise<void>;
}
