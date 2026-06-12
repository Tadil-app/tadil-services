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
  cityNameBn?: string;
  cityNameHi?: string;
  cityNameUr?: string;
  cityId?: number;
  districtId?: string;
  districtNameAr?: string;
  districtNameEn?: string;
  districtNameBn?: string;
  districtNameHi?: string;
  districtNameUr?: string;
  street?: string;
  streetAr?: string;
  streetEn?: string;
  streetBn?: string;
  streetHi?: string;
  streetUr?: string;
  latitude?: number;
  longitude?: number;
}