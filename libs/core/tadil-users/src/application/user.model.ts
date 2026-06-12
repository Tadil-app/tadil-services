export const ROLE = {
  TAILOR: 'tailor',
  CUSTOMER: 'customer',
  COURIER: 'courier',
} as const;
export type RoleType = (typeof ROLE)[keyof typeof ROLE];

export const LOGIN_REQUEST_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;
export type LoginRequestStatusType =
  (typeof LOGIN_REQUEST_STATUS)[keyof typeof LOGIN_REQUEST_STATUS];

export interface Address {
  id: string;
  cityId?: number | null;
  cityNameAr: string;
  cityNameEn: string;
  cityNameBn: string;
  cityNameHi: string;
  cityNameUr: string;
  districtId?: string | null;
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
  latitude?: number | null;
  longitude?: number | null;
  userId: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: RoleType;
  email?: string;
  loginRequestStatus?: LoginRequestStatusType;
  loginToken?: string;
  addresses?: Address[];

  walletBalance?: number;
  commissionRate?: number;
}
