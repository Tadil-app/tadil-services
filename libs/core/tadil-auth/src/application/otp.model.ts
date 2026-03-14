export interface Otp {
  id: string;
  code: string;
  phone: string;
  expiresAt: Date;
  createdAt: Date;
  userId?: string;
}
