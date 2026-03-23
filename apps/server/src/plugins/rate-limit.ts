import fastifyRateLimit from "@fastify/rate-limit";
import fp from "fastify-plugin";

export default fp(async (fastify) => {
  fastify.register(fastifyRateLimit, {
    max: 100,
    timeWindow: "1 minute",
    allowList: ["127.0.0.1", "::1"],
  });
});
