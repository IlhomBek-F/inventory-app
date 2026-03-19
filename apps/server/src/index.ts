import path from "node:path";
import { fileURLToPath } from "node:url";
import autoload from "@fastify/autoload";
import Fastify from "fastify";
import { env } from "@/env";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = env.NODE_ENV === "production";

const fastify = Fastify({
  logger: isProduction
    ? {
        level: "info",
        serializers: {
          req(request) {
            return {
              method: request.method,
              url: request.url,
              hostname: request.hostname,
              remoteAddress: request.ip,
            };
          },
        },
      }
    : {
        level: "debug",
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
      },
  trustProxy: isProduction,
  requestTimeout: 30_000,
  bodyLimit: 1_048_576, // 1MB
  caseSensitive: true,
  ignoreDuplicateSlashes: true,
  ignoreTrailingSlash: true,
});

// Auto-load plugins (cors, helmet, rate-limit, etc.)
fastify.register(autoload, {
  dir: path.join(__dirname, "plugins"),
});

// Auto-load routes
fastify.register(autoload, {
  dir: path.join(__dirname, "routes"),
});

const start = async () => {
  try {
    await fastify.listen({ host: env.HOST, port: env.PORT });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  fastify.log.info(`Received ${signal}, shutting down gracefully...`);
  await fastify.close();
  process.exit(0);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

start();
