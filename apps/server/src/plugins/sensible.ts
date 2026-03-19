import fastifySensible from "@fastify/sensible";
import type { FastifyPluginAsync } from "fastify";

const sensible: FastifyPluginAsync = async (fastify) => {
  fastify.register(fastifySensible);
};

export default sensible;
