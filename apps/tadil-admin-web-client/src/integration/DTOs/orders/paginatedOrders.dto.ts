import type { DisplayOrderDTO } from "./displayOrder.dto";

export interface PaginatedOrdersDto {
  data: DisplayOrderDTO[];
  total: number;
  page: number;
  pageSize: number;
}
