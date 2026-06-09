import type { RoleType } from ".";

export interface DisplayUserDTO {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: RoleType;
  email?: string;
  commissionRate?: number;
  cityNameAr?: string;
  cityNameEn?: string;
  cityId?: number;
  districtId?: string;
  districtNameAr?: string;
  districtNameEn?: string;
  street?: string;
  latitude?: number;
  longitude?: number;
}