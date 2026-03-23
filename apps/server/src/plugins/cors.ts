import fastifyCors from "@fastify/cors";
import fp from "fastify-plugin";
import { env } from "@/env";

export default fp(async (fastify) => {
  fastify.register(fastifyCors, {
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    maxAge: 86400,
  });
});
