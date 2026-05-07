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

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: RoleType;
  email?: string;
  loginRequestStatus?: LoginRequestStatusType;
  loginToken?: string;
}
