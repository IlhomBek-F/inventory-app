import { and, desc, eq, isNull, sql } from "drizzle-orm";
import type { db as Database } from "@/db";
import { order, shoe, stockMovement } from "@/db/schema";

type Db = typeof Database;

export class OrderService {
  constructor(private db: Db) {}

  async create(
    userId: string,
    data: {
      type: "sale" | "purchase";
      customerOrSupplier?: string;
      notes?: string;
      items: { shoeId: string; quantity: number }[];
    },
  ) {
    return this.db.transaction(async (tx) => {
      const [newOrder] = await tx
        .insert(order)
        .values({
          userId,
          type: data.type,
          customerOrSupplier: data.customerOrSupplier ?? "",
          notes: data.notes ?? "",
        })
        .returning();

      const movementType = data.type === "sale" ? "out" : "in";
      const reasonSuffix = data.customerOrSupplier
        ? data.type === "sale"
          ? ` to ${data.customerOrSupplier}`
          : ` from ${data.customerOrSupplier}`
        : "";
      const reason =
        data.type === "sale" ? `Sale${reasonSuffix}` : `Purchase${reasonSuffix}`;

      const movements = [];

      for (const item of data.items) {
        const [currentShoe] = await tx
          .select()
          .from(shoe)
          .where(and(eq(shoe.id, item.shoeId), eq(shoe.userId, userId), isNull(shoe.deletedAt)));

        if (!currentShoe) {
          throw new Error(`Shoe not found: ${item.shoeId}`);
        }

        let newQuantity = currentShoe.quantity;

        if (movementType === "out") {
          newQuantity -= item.quantity;
          if (newQuantity < 0) {
            throw new Error(`Insufficient stock for "${currentShoe.name}"`);
          }
        } else {
          newQuantity += item.quantity;
        }

        const [movement] = await tx
          .insert(stockMovement)
          .values({
            shoeId: item.shoeId,
            userId,
            type: movementType,
            quantity: item.quantity,
            reason,
            orderId: newOrder.id,
          })
          .returning();

        await tx.update(shoe).set({ quantity: newQuantity }).where(eq(shoe.id, item.shoeId));

        movements.push(movement);
      }

      return { order: newOrder, movements };
    });
  }

  async list(userId: string, limit = 50, offset = 0) {
    const items = await this.db
      .select({
        id: order.id,
        type: order.type,
        customerOrSupplier: order.customerOrSupplier,
        notes: order.notes,
        createdAt: order.createdAt,
        itemCount: sql<number>`cast(count(${stockMovement.id}) as int)`,
        totalQuantity: sql<number>`cast(coalesce(sum(${stockMovement.quantity}), 0) as int)`,
      })
      .from(order)
      .leftJoin(stockMovement, eq(stockMovement.orderId, order.id))
      .where(eq(order.userId, userId))
      .groupBy(order.id)
      .orderBy(desc(order.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ total }] = await this.db
      .select({ total: sql<number>`cast(count(*) as int)` })
      .from(order)
      .where(eq(order.userId, userId));

    return { items, total };
  }

  async getById(userId: string, orderId: string) {
    const [foundOrder] = await this.db
      .select()
      .from(order)
      .where(and(eq(order.id, orderId), eq(order.userId, userId)));

    if (!foundOrder) return null;

    const items = await this.db
      .select({
        id: stockMovement.id,
        shoeId: stockMovement.shoeId,
        shoeName: shoe.name,
        shoeBrand: shoe.brand,
        quantity: stockMovement.quantity,
      })
      .from(stockMovement)
      .innerJoin(shoe, eq(stockMovement.shoeId, shoe.id))
      .where(eq(stockMovement.orderId, orderId));

    return { ...foundOrder, items };
  }
}
