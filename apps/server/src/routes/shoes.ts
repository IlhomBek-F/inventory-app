import type { FastifyPluginAsync, FastifyRequest } from "fastify";

import {
  DashboardResponse,
  ErrorResponse,
  IdParams,
  type IdParamsType,
  ListShoesQuery,
  type ListShoesQueryType,
  ListShoesResponse,
  MovementListQuery,
  type MovementListQueryType,
  ShoeBody,
  type ShoeBodyType,
  ShoeResponse,
  ShoeUpdateBody,
  type ShoeUpdateBodyType,
  StockMovementBody,
  type StockMovementBodyType,
  StockMovementListItem,
  StockMovementResponse,
  SuccessResponse,
} from "@/schemas/shoe.schema";

const shoeRoutes: FastifyPluginAsync = async (fastify) => {
  function getUserId(request: FastifyRequest): string {
    return (request.session as NonNullable<typeof request.session>).user.id;
  }

  // GET /shoes - List all shoes
  fastify.get<{ Querystring: ListShoesQueryType }>(
    "/shoes",
    {
      schema: {
        querystring: ListShoesQuery,
        response: { 200: ListShoesResponse },
      },
    },
    async (request) => {
      const { shoeService } = request.diScope.cradle;

      return shoeService.list({
        userId: getUserId(request),
        search: request.query.search,
        sortBy: request.query.sortBy,
        sortOrder: request.query.sortOrder,
        limit: request.query.limit,
        offset: request.query.offset,
      });
    },
  );

  // GET /shoes/dashboard - Dashboard stats
  fastify.get(
    "/shoes/dashboard",
    {
      schema: {
        response: { 200: DashboardResponse },
      },
    },
    async (request) => {
      const { shoeService, stockMovementService } = request.diScope.cradle;

      const userId = getUserId(request);

      const [stats, lowStock, recentMovements] = await Promise.all([
        shoeService.getDashboardStats(userId),
        shoeService.getLowStockItems(userId),
        stockMovementService.getRecent(userId),
      ]);

      return { stats, lowStock, recentMovements };
    },
  );

  // GET /shoes/:id - Get a shoe by ID
  fastify.get<{ Params: IdParamsType }>(
    "/shoes/:id",
    {
      schema: {
        params: IdParams,
        response: {
          200: ShoeResponse,
          404: ErrorResponse,
        },
      },
    },
    async (request) => {
      const { shoeService } = request.diScope.cradle;

      const item = await shoeService.getById(request.params.id, getUserId(request));

      if (!item) {
        throw fastify.httpErrors.notFound("Shoe not found");
      }

      return item;
    },
  );

  // POST /shoes - Create a shoe
  fastify.post<{ Body: ShoeBodyType }>(
    "/shoes",
    {
      schema: {
        body: ShoeBody,
        response: {
          201: ShoeResponse,
        },
      },
    },
    async (request, reply) => {
      const { shoeService } = request.diScope.cradle;

      const item = await shoeService.create(getUserId(request), request.body);
      reply.status(201);

      return item;
    },
  );

  // PUT /shoes/:id - Update a shoe
  fastify.put<{ Params: IdParamsType; Body: ShoeUpdateBodyType }>(
    "/shoes/:id",
    {
      schema: {
        params: IdParams,
        body: ShoeUpdateBody,
        response: {
          200: ShoeResponse,
          404: ErrorResponse,
        },
      },
    },
    async (request) => {
      const { shoeService } = request.diScope.cradle;

      const item = await shoeService.update(request.params.id, getUserId(request), request.body);

      if (!item) {
        throw fastify.httpErrors.notFound("Shoe not found");
      }

      return item;
    },
  );

  // DELETE /shoes/:id - Delete a shoe
  fastify.delete<{ Params: IdParamsType }>(
    "/shoes/:id",
    {
      schema: {
        params: IdParams,
        response: {
          200: SuccessResponse,
          404: ErrorResponse,
        },
      },
    },
    async (request) => {
      const { shoeService } = request.diScope.cradle;

      const item = await shoeService.delete(request.params.id, getUserId(request));

      if (!item) {
        throw fastify.httpErrors.notFound("Shoe not found");
      }

      return { success: true };
    },
  );

  // POST /shoes/:id/movements - Record a stock movement
  fastify.post<{ Params: IdParamsType; Body: StockMovementBodyType }>(
    "/shoes/:id/movements",
    {
      schema: {
        params: IdParams,
        body: StockMovementBody,
        response: {
          201: StockMovementResponse,
          400: ErrorResponse,
          404: ErrorResponse,
        },
      },
    },
    async (request, reply) => {
      const { stockMovementService } = request.diScope.cradle;

      try {
        const result = await stockMovementService.create(
          request.params.id,
          getUserId(request),
          request.body,
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
    },
  );

  // GET /shoes/:id/movements - List stock movements for a shoe
  fastify.get<{ Params: IdParamsType; Querystring: MovementListQueryType }>(
    "/shoes/:id/movements",
    {
      schema: {
        params: IdParams,
        querystring: MovementListQuery,
        response: {
          200: { type: "array", items: StockMovementListItem },
        },
      },
    },
    async (request) => {
      const { stockMovementService } = request.diScope.cradle;

      return stockMovementService.listByShoe(
        request.params.id,
        getUserId(request),
        request.query.limit,
        request.query.offset,
      );
    },
  );
};

export default shoeRoutes;
