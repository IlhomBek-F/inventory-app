import { diContainer, fastifyAwilixPlugin } from "@fastify/awilix";
import { asFunction, Lifetime } from "awilix";
import type { FastifyPluginAsync } from "fastify";
import { auth } from "@/auth";
import { db } from "@/db";
import { ShoeService } from "@/services/shoe.service";
import { StockMovementService } from "@/services/stock-movement.service";

const awilix: FastifyPluginAsync = async (fastify) => {
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
  });
};

export default awilix;
