import { type Static, Type } from "@sinclair/typebox";

// ── Shared ──

export const IdParams = Type.Object({
  id: Type.String(),
});

export type IdParamsType = Static<typeof IdParams>;

export const PaginationQuery = Type.Object({
  limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100, default: 50 })),
  offset: Type.Optional(Type.Integer({ minimum: 0, default: 0 })),
});

export type PaginationQueryType = Static<typeof PaginationQuery>;

export const ErrorResponse = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

export const SuccessResponse = Type.Object({
  success: Type.Boolean(),
});

// ── Shoe ──

export const ShoeBody = Type.Object({
  name: Type.String({ minLength: 1 }),
  brand: Type.String({ minLength: 1 }),
  category: Type.String({ minLength: 1 }),
  size: Type.String({ minLength: 1 }),
  color: Type.Optional(Type.String()),
  condition: Type.Optional(Type.String()),
  sku: Type.Optional(Type.String()),
  barcode: Type.Optional(Type.String()),
  description: Type.Optional(Type.String()),
  imageUrl: Type.Optional(Type.String()),
  costPrice: Type.Number({ minimum: 0 }),
  sellPrice: Type.Number({ minimum: 0 }),
  quantity: Type.Integer({ minimum: 0 }),
  minStockAlert: Type.Optional(Type.Integer({ minimum: 0 })),
  supplier: Type.Optional(Type.String()),
  location: Type.Optional(Type.String()),
});

export type ShoeBodyType = Static<typeof ShoeBody>;

export const ShoeUpdateBody = Type.Partial(ShoeBody);

export type ShoeUpdateBodyType = Static<typeof ShoeUpdateBody>;

export const ShoeResponse = Type.Object({
  id: Type.String(),
  name: Type.String(),
  brand: Type.String(),
  category: Type.String(),
  size: Type.String(),
  color: Type.Union([Type.String(), Type.Null()]),
  condition: Type.Union([Type.String(), Type.Null()]),
  sku: Type.Union([Type.String(), Type.Null()]),
  barcode: Type.Union([Type.String(), Type.Null()]),
  description: Type.Union([Type.String(), Type.Null()]),
  imageUrl: Type.Union([Type.String(), Type.Null()]),
  costPrice: Type.String(),
  sellPrice: Type.String(),
  quantity: Type.Integer(),
  minStockAlert: Type.Integer(),
  supplier: Type.Union([Type.String(), Type.Null()]),
  location: Type.Union([Type.String(), Type.Null()]),
  userId: Type.String(),
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
});

export type ShoeResponseType = Static<typeof ShoeResponse>;

export const ListShoesQuery = Type.Object({
  search: Type.Optional(Type.String()),
  sortBy: Type.Optional(Type.String()),
  sortOrder: Type.Optional(Type.Union([Type.Literal("asc"), Type.Literal("desc")])),
  limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100, default: 50 })),
  offset: Type.Optional(Type.Integer({ minimum: 0, default: 0 })),
});

export type ListShoesQueryType = Static<typeof ListShoesQuery>;

export const ListShoesResponse = Type.Object({
  items: Type.Array(ShoeResponse),
  total: Type.Number(),
});

export type ListShoesResponseType = Static<typeof ListShoesResponse>;

// ── Stock Movement ──

export const StockMovementBody = Type.Object({
  type: Type.Union([Type.Literal("in"), Type.Literal("out"), Type.Literal("adjustment")]),
  quantity: Type.Integer({ minimum: 1 }),
  reason: Type.Optional(Type.String()),
});

export type StockMovementBodyType = Static<typeof StockMovementBody>;

export const StockMovementResponse = Type.Object({
  movement: Type.Object({
    id: Type.String(),
    shoeId: Type.String(),
    type: Type.String(),
    quantity: Type.Integer(),
    reason: Type.Union([Type.String(), Type.Null()]),
    userId: Type.String(),
    createdAt: Type.String({ format: "date-time" }),
  }),
  newQuantity: Type.Integer(),
});

export type StockMovementResponseType = Static<typeof StockMovementResponse>;

export const StockMovementListItem = Type.Object({
  id: Type.String(),
  shoeId: Type.String(),
  type: Type.String(),
  quantity: Type.Integer(),
  reason: Type.Union([Type.String(), Type.Null()]),
  userId: Type.String(),
  createdAt: Type.String({ format: "date-time" }),
});

export type StockMovementListItemType = Static<typeof StockMovementListItem>;

export const MovementListQuery = Type.Object({
  limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100, default: 50 })),
  offset: Type.Optional(Type.Integer({ minimum: 0, default: 0 })),
});

export type MovementListQueryType = Static<typeof MovementListQuery>;

// ── Dashboard ──

export const DashboardResponse = Type.Object({
  stats: Type.Object({
    totalModels: Type.Number(),
    totalUnits: Type.Number(),
    inventoryValue: Type.Number(),
    lowStockCount: Type.Number(),
  }),
  lowStock: Type.Array(ShoeResponse),
  recentMovements: Type.Array(
    Type.Object({
      id: Type.String(),
      type: Type.String(),
      quantity: Type.Integer(),
      reason: Type.Union([Type.String(), Type.Null()]),
      createdAt: Type.String({ format: "date-time" }),
      shoeName: Type.String(),
      shoeBrand: Type.String(),
    }),
  ),
});

export type DashboardResponseType = Static<typeof DashboardResponse>;
