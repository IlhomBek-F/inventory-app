// biome-ignore lint/performance/noBarrelFile: intentional re-export from shared package
export {
  DashboardResponse,
  ErrorResponse,
  IdParams,
  ListShoesQuery,
  ListShoesResponse,
  MovementListQuery,
  ReportsResponse,
  ShoeBody,
  ShoeResponse,
  ShoeUpdateBody,
  StockMovementBody,
  StockMovementListItem,
  StockMovementResponse,
  SuccessResponse,
} from "@inventory/shared/schemas";

export type {
  DashboardResponseType,
  IdParamsType,
  ListShoesQueryType,
  ListShoesResponseType,
  MovementListQueryType,
  PaginationQueryType,
  ShoeBodyType,
  ShoeResponseType,
  ShoeUpdateBodyType,
  StockMovementBodyType,
  StockMovementListItemType,
  StockMovementResponseType,
} from "@inventory/shared/types";
