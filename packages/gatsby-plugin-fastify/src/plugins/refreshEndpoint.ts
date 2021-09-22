import { emitter } from "gatsby/dist/redux";
import type { FastifyPluginAsync, FastifyRequest } from "fastify";
import { getConfig } from "../utils";

async function refresh(req: FastifyRequest, pluginName?: string): Promise<void> {
  //Thi sis from Gatsby, not sure if we need it.
  // @ts-ignore
  // global.__GATSBY.buildId = uuidv4()

  emitter.emit(`WEBHOOK_RECEIVED`, {
    webhookBody: req.body,
    pluginName,
  });
}

const ENDPOINT_ERRORS = {
  "NOT_AUTHORIZED": `Authorization failed. Make sure you add authorization header to your refresh requests`,
  "NOT_ENABLED": `Refresh endpoint is not enabled. Run gatsby with "ENABLE_GATSBY_REFRESH_ENDPOINT=true" environment variable set.`,
};

export const handleRefreshEndpoint: FastifyPluginAsync = async (fastify, {}) => {
  console.info("Listening on refresh endpoint");
  const refreshEndpointPath = `/__refresh/:pluginName`;
  const {
    server: { refreshEndpoint: enableRefresh },
  } = getConfig();

  fastify.get<{
    Params: {
      pluginName: string;
    };
  }>(refreshEndpointPath, async (req, reply) => {
    const { pluginName } = req.params;

    if (enableRefresh) {
      reply.send(
        `You tried to update ${
          pluginName || "all plugins"
        } but that requires an HTTP POST and a body`,
      );
    } else {
      reply.code(403).send(ENDPOINT_ERRORS.NOT_ENABLED);
    }
  });

  fastify.post<{
    Params: { pluginName: string };
  }>(refreshEndpointPath, async (req, reply) => {
    const { pluginName } = req.params;

    const refreshToken = process.env.GATSBY_REFRESH_TOKEN;
    const authorizedRefresh = !refreshToken || req.headers.authorization === refreshToken;

    console.log("/__refresh webhook received POST request. ");

    reply.type("application/json");

    if (enableRefresh && authorizedRefresh) {
      refresh(req, pluginName);

      reply.code(202);
      reply.send(`ok, updating ${pluginName || "all plugins"}.`);
    } else {
      reply.code(authorizedRefresh ? 404 : 403);
      reply.send({
        error: enableRefresh
          ? ENDPOINT_ERRORS["NOT_AUTHORIZED"]
          : ENDPOINT_ERRORS["NOT_ENABLED"],
        isEnabled: !!enableRefresh,
      });
    }
  });
};
