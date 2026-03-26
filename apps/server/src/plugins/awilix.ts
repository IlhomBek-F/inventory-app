import { diContainer, fastifyAwilixPlugin } from "@fastify/awilix";
import { asFunction, Lifetime } from "awilix";
import fp from "fastify-plugin";
import { auth } from "@/auth";
import { db } from "@/db";
import { OrderService } from "@/services/order.service";
import { ShoeService } from "@/services/shoe.service";
import { StockMovementService } from "@/services/stock-movement.service";

export default fp(async (fastify) => {
  await fastify.register(fastifyAwilixPlugin, {
    disposeOnClose: true,
    asyncDispose: true,
    asyncInit: true,
  });

  diContainer.register({
    db: asFunction(() => db, {
      lifetime: Lifetime.SINGLETON,
    }),
    auth: asFunction(() => auth, {
      lifetime: Lifetime.SINGLETON,
    }),
    shoeService: asFunction(() => new ShoeService(db), {
      lifetime: Lifetime.SINGLETON,
    }),
    stockMovementService: asFunction(() => new StockMovementService(db), {
      lifetime: Lifetime.SINGLETON,
    }),
    orderService: asFunction(() => new OrderService(db), {
      lifetime: Lifetime.SINGLETON,
    }),
  });
});
