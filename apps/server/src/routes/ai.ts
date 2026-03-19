import { devToolsMiddleware } from "@ai-sdk/devtools";
import { google } from "@ai-sdk/google";
import { streamText, type UIMessage, convertToModelMessages, wrapLanguageModel } from "ai";
import type { FastifyPluginAsync } from "fastify";

interface AiRequestBody {
  id?: string;
  messages: UIMessage[];
}

const aiRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post("/ai", async function (request) {
    const { messages } = request.body as AiRequestBody;
    const model = wrapLanguageModel({
      model: google("gemini-2.5-flash"),
      middleware: devToolsMiddleware(),
    });
    const result = streamText({
      model,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  });
};

export default aiRoute;
