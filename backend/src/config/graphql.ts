import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import type { Express } from "express";
import { schema } from "../graphql/schema";
import { buildContext } from "../graphql/context";

export async function applyApollo(app: Express) {
  const server = new ApolloServer({ schema });
  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => buildContext(req),
    })
  );
}