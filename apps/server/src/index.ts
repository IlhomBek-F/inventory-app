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
let isShuttingDown = false;
const SHUTDOWN_TIMEOUT = 10_000;

const gracefulShutdown = async (signal: string) => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  fastify.log.info(`Received ${signal}, shutting down gracefully...`);

  const forceExit = setTimeout(() => {
    fastify.log.error("Shutdown timed out, forcing exit");
    process.exit(1);
  }, SHUTDOWN_TIMEOUT);
  forceExit.unref();

  try {
    await fastify.close();
    fastify.log.info("Server closed successfully");
    process.exit(0);
  } catch (err) {
    fastify.log.error(err, "Error during shutdown");
    process.exit(1);
  }
};

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => gracefulShutdown(signal));
}

start();
