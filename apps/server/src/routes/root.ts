import type { FastifyPluginAsync } from "fastify";

const root: FastifyPluginAsync = async (fastify) => {
  fastify.get("/", async () => {
    return "OK";
  });
};

export default root;
