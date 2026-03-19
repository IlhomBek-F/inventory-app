import fastifyCors from "@fastify/cors";
import type { FastifyPluginAsync } from "fastify";
import { env } from "@/env";

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
