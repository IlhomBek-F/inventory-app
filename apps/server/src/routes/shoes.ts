import type { FastifyPluginAsync, FastifyRequest } from "fastify";

const shoeRoutes: FastifyPluginAsync = async (fastify) => {
  function getUserId(request: FastifyRequest): string {
    return (request.session as NonNullable<typeof request.session>).user.id;
  }

  fastify.get("/shoes", async (request) => {
    const { shoeService } = request.diScope.cradle;

    const query = request.query as {
      search?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
      limit?: string;
      offset?: string;
    };

    return shoeService.list({
      userId: getUserId(request),
      search: query.search,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      limit: query.limit ? Number(query.limit) : undefined,
      offset: query.offset ? Number(query.offset) : undefined,
    });
  });

  fastify.get("/shoes/dashboard", async (request) => {
    const { shoeService, stockMovementService } = request.diScope.cradle;
    const userId = getUserId(request);

    const [stats, lowStock, recentMovements] = await Promise.all([
      shoeService.getDashboardStats(userId),
      shoeService.getLowStockItems(userId),
      stockMovementService.getRecent(userId),
    ]);

    return { stats, lowStock, recentMovements };
  });

  fastify.get("/shoes/:id", async (request) => {
    const { shoeService } = request.diScope.cradle;
    const { id } = request.params as { id: string };

    const item = await shoeService.getById(id, getUserId(request));
    if (!item) {
      throw fastify.httpErrors.notFound("Shoe not found");
    }
    return item;
  });

  fastify.post("/shoes", async (request, reply) => {
    const { shoeService } = request.diScope.cradle;

    const body = request.body as {
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
    };

    const item = await shoeService.create(getUserId(request), body);
    reply.status(201);
    return item;
  });

  fastify.put("/shoes/:id", async (request) => {
    const { shoeService } = request.diScope.cradle;
    const { id } = request.params as { id: string };

    const body = request.body as Record<string, unknown>;
    const item = await shoeService.update(id, getUserId(request), body);
    if (!item) {
      throw fastify.httpErrors.notFound("Shoe not found");
    }
    return item;
  });

  fastify.delete("/shoes/:id", async (request) => {
    const { shoeService } = request.diScope.cradle;
    const { id } = request.params as { id: string };

    const item = await shoeService.delete(id, getUserId(request));
    if (!item) {
      throw fastify.httpErrors.notFound("Shoe not found");
    }
    return { success: true };
  });

  fastify.post("/shoes/:id/movements", async (request, reply) => {
    const { stockMovementService } = request.diScope.cradle;
    const { id } = request.params as { id: string };

    const body = request.body as {
      type: "in" | "out" | "adjustment";
      quantity: number;
      reason?: string;
    };

    try {
      const result = await stockMovementService.create(
        id,
        getUserId(request),
        body,
      );
      reply.status(201);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Shoe not found") {
          throw fastify.httpErrors.notFound(error.message);
        }
        if (error.message === "Insufficient stock") {
          throw fastify.httpErrors.badRequest(error.message);
        }
      }
      throw error;
    }
  });

  fastify.get("/shoes/:id/movements", async (request) => {
    const { stockMovementService } = request.diScope.cradle;
    const { id } = request.params as { id: string };

    const query = request.query as { limit?: string; offset?: string };

    return stockMovementService.listByShoe(
      id,
      getUserId(request),
      query.limit ? Number(query.limit) : undefined,
      query.offset ? Number(query.offset) : undefined,
    );
  });
};

export default shoeRoutes;
