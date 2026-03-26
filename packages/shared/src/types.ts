import type { Static } from "@sinclair/typebox";
import type {
  DashboardResponse,
  IdParams,
  ListShoesQuery,
  ListShoesResponse,
  MovementListQuery,
  OrderBody,
  OrderListItem,
  OrderListResponse,
  OrderResponse,
  PaginationQuery,
  ReportsResponse,
  ShoeBody,
  ShoeResponse,
  ShoeUpdateBody,
  StockMovementBody,
  StockMovementListItem,
  StockMovementResponse,
} from "./schemas";

export type IdParamsType = Static<typeof IdParams>;
export type PaginationQueryType = Static<typeof PaginationQuery>;
export type ShoeBodyType = Static<typeof ShoeBody>;
export type ShoeUpdateBodyType = Static<typeof ShoeUpdateBody>;
export type ShoeResponseType = Static<typeof ShoeResponse>;
export type ListShoesQueryType = Static<typeof ListShoesQuery>;
export type ListShoesResponseType = Static<typeof ListShoesResponse>;
export type StockMovementBodyType = Static<typeof StockMovementBody>;
export type StockMovementResponseType = Static<typeof StockMovementResponse>;
export type StockMovementListItemType = Static<typeof StockMovementListItem>;
export type MovementListQueryType = Static<typeof MovementListQuery>;
export type DashboardResponseType = Static<typeof DashboardResponse>;
export type ReportsResponseType = Static<typeof ReportsResponse>;
export type OrderBodyType = Static<typeof OrderBody>;
export type OrderResponseType = Static<typeof OrderResponse>;
export type OrderListItemType = Static<typeof OrderListItem>;
export type OrderListResponseType = Static<typeof OrderListResponse>;
