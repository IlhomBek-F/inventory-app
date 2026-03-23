import fastifySensible from "@fastify/sensible";
import fp from "fastify-plugin";

export default fp(async (fastify) => {
  fastify.register(fastifySensible);
});
