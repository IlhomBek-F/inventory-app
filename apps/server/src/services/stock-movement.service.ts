import { shoe, stockMovement } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import type { db as Database } from "@/db";

type Db = typeof Database;

export class StockMovementService {
  constructor(private db: Db) {}

  async create(
    shoeId: string,
    userId: string,
    data: { type: "in" | "out" | "adjustment"; quantity: number; reason?: string },
  ) {
    return this.db.transaction(async (tx) => {
      const [currentShoe] = await tx
        .select()
        .from(shoe)
        .where(and(eq(shoe.id, shoeId), eq(shoe.userId, userId)));

      if (!currentShoe) {
        throw new Error("Shoe not found");
      }

      let newQuantity = currentShoe.quantity;
      if (data.type === "in") {
        newQuantity += data.quantity;
      } else if (data.type === "out") {
        newQuantity -= data.quantity;
        if (newQuantity < 0) {
          throw new Error("Insufficient stock");
        }
      } else {
        newQuantity = data.quantity;
      }

      const [movement] = await tx
        .insert(stockMovement)
        .values({
          shoeId,
          userId,
          type: data.type,
          quantity: data.quantity,
          reason: data.reason ?? "",
        })
        .returning();

      await tx.update(shoe).set({ quantity: newQuantity }).where(eq(shoe.id, shoeId));

      return { movement, newQuantity };
    });
  }

  async listByShoe(shoeId: string, userId: string, limit = 50, offset = 0) {
    return this.db
      .select()
      .from(stockMovement)
      .where(and(eq(stockMovement.shoeId, shoeId), eq(stockMovement.userId, userId)))
      .orderBy(desc(stockMovement.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getRecent(userId: string, limit = 10) {
    return this.db
      .select({
        id: stockMovement.id,
        type: stockMovement.type,
        quantity: stockMovement.quantity,
        reason: stockMovement.reason,
        createdAt: stockMovement.createdAt,
        shoeName: shoe.name,
        shoeBrand: shoe.brand,
      })
      .from(stockMovement)
      .innerJoin(shoe, eq(stockMovement.shoeId, shoe.id))
      .where(eq(stockMovement.userId, userId))
      .orderBy(desc(stockMovement.createdAt))
      .limit(limit);
  }
}