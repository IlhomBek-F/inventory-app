import fastifyCors from "@fastify/cors";
import { env } from "@/env";
import type { FastifyPluginAsync } from "fastify";

const cors: FastifyPluginAsync = async (fastify) => {
  fastify.register(fastifyCors, {
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    maxAge: 86400,
  });
};

export default cors;
