import { buildApp } from "@/app";
import { startServer } from "@/server";

const fastify = buildApp();

startServer(fastify);
