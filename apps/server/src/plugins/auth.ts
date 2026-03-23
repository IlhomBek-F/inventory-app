import type { FastifyInstance, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { auth } from "@/auth";

const PUBLIC_ROUTES = ["/", "/api/auth/*"];

function isPublicRoute(url: string): boolean {
  return PUBLIC_ROUTES.some((route) => {
    if (route.endsWith("*")) {
      return url.startsWith(route.slice(0, -1));
    }

    return url === route;
  });
}

async function authenticate(fastify: FastifyInstance, request: FastifyRequest) {
  const session = await auth.api.getSession({
    headers: request.headers as unknown as Headers,
  });

  if (!session) {
    throw fastify.httpErrors.unauthorized("Not authenticated");
  }

  request.session = session;

  return session;
}

export default fp(async (fastify) => {
  fastify.decorateRequest("session", null);

  fastify.addHook("onRoute", (routeOptions) => {
    if (isPublicRoute(routeOptions.url)) return;

    routeOptions.preHandler = async (request: FastifyRequest) => {
      await authenticate(fastify, request);
    };
  });
});

declare module "fastify" {
  interface FastifyRequest {
    session: { user: { id: string; name: string; email: string } } | null;
  }
}
