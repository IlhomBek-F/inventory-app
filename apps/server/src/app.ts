import path from "node:path";
import { fileURLToPath } from "node:url";
import autoload from "@fastify/autoload";
import Fastify from "fastify";
import { env } from "@/env";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = env.NODE_ENV === "production";

export function buildApp() {
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

  fastify.register(autoload, {
    dir: path.join(__dirname, "plugins"),
  });

  fastify.register(autoload, {
    dir: path.join(__dirname, "routes"),
  });

  return fastify;
}
