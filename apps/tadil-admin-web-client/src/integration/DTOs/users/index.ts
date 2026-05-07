export * from "./displayUser.dto";
export * from "./createUser.dto";
export * from "./updateUser.dto";

export const ROLE = {
  TAILOR: "tailor",
  CUSTOMER: "customer",
  COURIER: "courier",
} as const;
export type RoleType = (typeof ROLE)[keyof typeof ROLE];
