import path from "node:path";
import { fileURLToPath } from "node:url";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import type { FastifyInstance } from "fastify";
import { db } from "@/db";
import { env } from "@/env";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHUTDOWN_TIMEOUT = 10_000;

export async function startServer(fastify: FastifyInstance) {
  try {
    await migrate(db, { migrationsFolder: path.join(__dirname, "db/migrations") });
    fastify.log.info("Database migrations applied");
    await fastify.listen({ host: env.HOST, port: env.PORT });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  let isShuttingDown = false;

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
}
