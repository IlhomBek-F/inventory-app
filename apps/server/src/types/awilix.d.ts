import type { db } from "@/db";
import type { auth } from "@/auth";
import type { OrderService } from "@/services/order.service";
import type { ShoeService } from "@/services/shoe.service";
import type { StockMovementService } from "@/services/stock-movement.service";

declare module "@fastify/awilix" {
  interface Cradle {
    db: typeof db;
    auth: typeof auth;
    shoeService: ShoeService;
    stockMovementService: StockMovementService;
    orderService: OrderService;
  }
}
