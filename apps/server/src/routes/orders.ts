import type { FastifyPluginAsync, FastifyRequest } from "fastify";
import {
  ErrorResponse,
  IdParams,
  type IdParamsType,
  OrderBody,
  type OrderBodyType,
  OrderListResponse,
  OrderResponse,
} from "@/schemas/shoe.schema";

const orderRoutes: FastifyPluginAsync = async (fastify) => {
  function getUserId(request: FastifyRequest): string {
    return (request.session as NonNullable<typeof request.session>).user.id;
  }

  // GET /orders - List all orders
  fastify.get(
    "/orders",
    { schema: { response: { 200: OrderListResponse } } },
    async (request) => {
      const { orderService } = request.diScope.cradle;
      return orderService.list(getUserId(request));
    },
  );

  // GET /orders/:id - Get single order with items
  fastify.get<{ Params: IdParamsType }>(
    "/orders/:id",
    { schema: { params: IdParams, response: { 200: OrderResponse, 404: ErrorResponse } } },
    async (request) => {
      const { orderService } = request.diScope.cradle;
      const result = await orderService.getById(getUserId(request), request.params.id);
      if (!result) throw fastify.httpErrors.notFound("Order not found");
      return result;
    },
  );

  // POST /orders - Create an order
  fastify.post<{ Body: OrderBodyType }>(
    "/orders",
    { schema: { body: OrderBody, response: { 201: OrderResponse, 400: ErrorResponse } } },
    async (request, reply) => {
      const { orderService } = request.diScope.cradle;
      try {
        const result = await orderService.create(getUserId(request), request.body);
        reply.status(201);
        return { ...result.order, items: result.movements.map((m) => ({
          id: m.id,
          shoeId: m.shoeId,
          shoeName: "",
          shoeBrand: "",
          quantity: m.quantity,
        })) };
      } catch (error) {
        if (error instanceof Error) {
          throw fastify.httpErrors.badRequest(error.message);
        }
        throw error;
      }
    },
  );
};

export default orderRoutes;
