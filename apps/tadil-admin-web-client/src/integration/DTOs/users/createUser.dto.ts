export interface CreateUserDTO {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  commissionRate?: number;
  city?: string;
}
