import { and, eq, ilike, or, sql } from "drizzle-orm";
import type { db as Database } from "@/db";
import { shoe } from "@/db/schema";

type Db = typeof Database;

export interface CreateShoeInput {
  name: string;
  brand: string;
  category: string;
  size: string;
  color?: string;
  condition?: string;
  sku?: string;
  barcode?: string;
  description?: string;
  imageUrl?: string;
  costPrice: number;
  sellPrice: number;
  quantity: number;
  minStockAlert?: number;
  supplier?: string;
  location?: string;
}

export interface UpdateShoeInput extends Partial<CreateShoeInput> {}

export interface ListShoesParams {
  userId: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export class ShoeService {
  constructor(private db: Db) {}

  async list({ userId, search, sortBy, sortOrder, limit = 50, offset = 0 }: ListShoesParams) {
    const conditions = [eq(shoe.userId, userId)];

    if (search) {
      const searchCondition = or(
        ilike(shoe.name, `%${search}%`),
        ilike(shoe.brand, `%${search}%`),
        ilike(shoe.category, `%${search}%`),
        ilike(shoe.sku, `%${search}%`),
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    const shoeColumns: Record<string, unknown> = shoe as any;
    const orderColumn = sortBy && sortBy in shoe ? shoeColumns[sortBy] : shoe.createdAt;
    const orderDir = sortOrder === "asc" ? sql`asc` : sql`desc`;

    const [items, countResult] = await Promise.all([
      this.db
        .select()
        .from(shoe)
        .where(and(...conditions))
        .orderBy(sql`${orderColumn} ${orderDir}`)
        .limit(limit)
        .offset(offset),
      this.db
        .select({ count: sql<number>`count(*)` })
        .from(shoe)
        .where(and(...conditions)),
    ]);

    return {
      items,
      total: Number(countResult[0]?.count ?? 0),
    };
  }

  async getById(id: string, userId: string) {
    const result = await this.db
      .select()
      .from(shoe)
      .where(and(eq(shoe.id, id), eq(shoe.userId, userId)));

    return result[0] ?? null;
  }

  async create(userId: string, data: CreateShoeInput) {
    const result = await this.db
      .insert(shoe)
      .values({
        ...data,
        costPrice: String(data.costPrice),
        sellPrice: String(data.sellPrice),
        userId,
      })
      .returning();

    return result[0];
  }

  async update(id: string, userId: string, data: UpdateShoeInput) {
    const { costPrice, sellPrice, ...rest } = data;
    const result = await this.db
      .update(shoe)
      .set({
        ...rest,
        ...(costPrice !== undefined && { costPrice: String(costPrice) }),
        ...(sellPrice !== undefined && { sellPrice: String(sellPrice) }),
      })
      .where(and(eq(shoe.id, id), eq(shoe.userId, userId)))
      .returning();

    return result[0] ?? null;
  }

  async delete(id: string, userId: string) {
    const result = await this.db
      .delete(shoe)
      .where(and(eq(shoe.id, id), eq(shoe.userId, userId)))
      .returning();

    return result[0] ?? null;
  }

  async getDashboardStats(userId: string) {
    const stats = await this.db
      .select({
        totalModels: sql<number>`count(*)`,
        totalUnits: sql<number>`coalesce(sum(${shoe.quantity}), 0)`,
        inventoryValue: sql<number>`coalesce(sum(${shoe.quantity} * ${shoe.costPrice}), 0)`,
        lowStockCount: sql<number>`count(*) filter (where ${shoe.quantity} <= ${shoe.minStockAlert})`,
      })
      .from(shoe)
      .where(eq(shoe.userId, userId));

    return stats[0];
  }

  async getLowStockItems(userId: string, limit = 10) {
    return this.db
      .select()
      .from(shoe)
      .where(and(eq(shoe.userId, userId), sql`${shoe.quantity} <= ${shoe.minStockAlert}`))
      .orderBy(shoe.quantity)
      .limit(limit);
  }
}


