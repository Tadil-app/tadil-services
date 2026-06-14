import type { DisplayUserDTO } from "./displayUser.dto";

export interface PaginatedUsersDTO {
  data: DisplayUserDTO[];
  total: number;
  page: number;
  pageSize: number;
}
