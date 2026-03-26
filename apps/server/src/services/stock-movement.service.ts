import { and, desc, eq, gte, sql } from "drizzle-orm";
import type { db as Database } from "@/db";
import { shoe, stockMovement, user } from "@/db/schema";

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
      .select({
        id: stockMovement.id,
        shoeId: stockMovement.shoeId,
        type: stockMovement.type,
        quantity: stockMovement.quantity,
        reason: stockMovement.reason,
        userId: stockMovement.userId,
        userName: user.name,
        createdAt: stockMovement.createdAt,
      })
      .from(stockMovement)
      .innerJoin(user, eq(stockMovement.userId, user.id))
      .where(and(eq(stockMovement.shoeId, shoeId), eq(stockMovement.userId, userId)))
      .orderBy(desc(stockMovement.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getMovementTrends(userId: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const rows = await this.db
      .select({
        date: sql<string>`to_char(date_trunc('day', ${stockMovement.createdAt}), 'YYYY-MM-DD')`,
        type: stockMovement.type,
        total: sql<number>`cast(sum(${stockMovement.quantity}) as int)`,
      })
      .from(stockMovement)
      .where(and(eq(stockMovement.userId, userId), gte(stockMovement.createdAt, since)))
      .groupBy(
        sql`date_trunc('day', ${stockMovement.createdAt})`,
        stockMovement.type,
      )
      .orderBy(sql`date_trunc('day', ${stockMovement.createdAt})`);

    const byDate = new Map<string, { date: string; in: number; out: number }>();
    for (const row of rows) {
      if (!byDate.has(row.date)) byDate.set(row.date, { date: row.date, in: 0, out: 0 });
      const entry = byDate.get(row.date);
      if (!entry) continue;
      if (row.type === "in") entry.in += row.total;
      else if (row.type === "out") entry.out += row.total;
    }

    return Array.from(byDate.values());
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
