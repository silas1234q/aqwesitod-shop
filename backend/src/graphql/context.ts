import type { Request } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { prisma } from "../config/prisma";

export type GraphQLContext = {
  req: Request;
  prisma: typeof prisma;
  userId: string | null;      // Clerk userId
  dbUser: { id: string; clerkId: string; role: string } | null; // optional
};

export async function buildContext(req: Request): Promise<GraphQLContext> {
  const { userId } = getAuth(req);

  // Optional: load dbUser for RBAC
  const dbUser = userId
    ? await prisma.user.findUnique({
        where: { clerkId: userId },
        select: { id: true, clerkId: true, role: true },
      })
    : null;

  return {
    req,
    prisma,
    userId: userId ?? null,
    dbUser,
  };
}