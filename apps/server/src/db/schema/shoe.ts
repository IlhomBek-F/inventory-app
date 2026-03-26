import { relations } from "drizzle-orm";
import { index, integer, numeric, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const orderTypeEnum = pgEnum("order_type", ["sale", "purchase"]);

export const order = pgTable(
  "order",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: orderTypeEnum("type").notNull(),
    customerOrSupplier: text("customer_or_supplier").default(""),
    notes: text("notes").default(""),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("order_userId_idx").on(table.userId)],
);

export const shoe = pgTable(
  "shoe",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    brand: text("brand").notNull(),
    category: text("category").notNull(),
    size: text("size").notNull(),
    color: text("color").default(""),
    condition: text("condition").default("New"),
    sku: text("sku").default(""),
    barcode: text("barcode").default(""),
    description: text("description").default(""),
    imageUrl: text("image_url").default(""),
    costPrice: numeric("cost_price", { precision: 10, scale: 2 }).notNull().default("0"),
    sellPrice: numeric("sell_price", { precision: 10, scale: 2 }).notNull().default("0"),
    quantity: integer("quantity").notNull().default(0),
    minStockAlert: integer("min_stock_alert").notNull().default(5),
    supplier: text("supplier").default(""),
    location: text("location").default(""),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    index("shoe_userId_idx").on(table.userId),
    index("shoe_sku_idx").on(table.sku),
    index("shoe_brand_idx").on(table.brand),
    index("shoe_category_idx").on(table.category),
  ],
);

export const movementTypeEnum = pgEnum("movement_type", ["in", "out", "adjustment"]);

export const stockMovement = pgTable(
  "stock_movement",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    shoeId: text("shoe_id")
      .notNull()
      .references(() => shoe.id, { onDelete: "cascade" }),
    type: movementTypeEnum("type").notNull(),
    quantity: integer("quantity").notNull(),
    reason: text("reason").default(""),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    orderId: text("order_id").references(() => order.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("stock_movement_shoeId_idx").on(table.shoeId),
    index("stock_movement_userId_idx").on(table.userId),
  ],
);

export const shoeRelations = relations(shoe, ({ one, many }) => ({
  user: one(user, {
    fields: [shoe.userId],
    references: [user.id],
  }),
  movements: many(stockMovement),
}));

export const stockMovementRelations = relations(stockMovement, ({ one }) => ({
  shoe: one(shoe, {
    fields: [stockMovement.shoeId],
    references: [shoe.id],
  }),
  user: one(user, {
    fields: [stockMovement.userId],
    references: [user.id],
  }),
  order: one(order, {
    fields: [stockMovement.orderId],
    references: [order.id],
  }),
}));

export const orderRelations = relations(order, ({ one, many }) => ({
  user: one(user, {
    fields: [order.userId],
    references: [user.id],
  }),
  movements: many(stockMovement),
}));
