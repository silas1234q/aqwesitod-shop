import type { GraphQLContext } from "../context";

export function requireAuth(ctx: GraphQLContext) {
  if (!ctx.userId) throw new Error("Unauthenticated");
}

export function requireRole(ctx: GraphQLContext, roles: string[]) {
  requireAuth(ctx);
  if (!ctx.dbUser) throw new Error("User not found");
  if (!roles.includes(ctx.dbUser.role)) throw new Error("Forbidden");
}