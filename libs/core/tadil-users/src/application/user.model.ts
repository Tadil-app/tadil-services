export const ROLE = {
  TAILOR: 'tailor',
  CUSTOMER: 'customer',
  COURIER: 'courier',
} as const;
export type RoleType = (typeof ROLE)[keyof typeof ROLE];

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: RoleType;
  email?: string;
}
