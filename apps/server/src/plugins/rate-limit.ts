import fastifyRateLimit from "@fastify/rate-limit";
import type { FastifyPluginAsync } from "fastify";

const rateLimit: FastifyPluginAsync = async (fastify) => {
  fastify.register(fastifyRateLimit, {
    max: 100,
    timeWindow: "1 minute",
    allowList: ["127.0.0.1", "::1"],
  });
};

export default rateLimit;
