import type { RoleType } from ".";

export interface DisplayUserDTO {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: RoleType;
  email?: string;
  commissionRate?: number;
  city?: string;
}