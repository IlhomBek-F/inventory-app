import fastifyHelmet from "@fastify/helmet";
import fp from "fastify-plugin";

export default fp(async (fastify) => {
  fastify.register(fastifyHelmet, {
    contentSecurityPolicy: false, // disable CSP for API-only server
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  });
});
