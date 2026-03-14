import { Otp } from './otp.model';

export interface OtpsRepository {
  save(otp: Otp): Promise<void>;
  getLatestByPhone(phone: string): Promise<Otp | undefined>;
  delete(id: string): Promise<void>;
  deleteExpired(): Promise<void>;
}
