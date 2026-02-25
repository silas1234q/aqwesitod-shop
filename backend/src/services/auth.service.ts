import { clerkClient } from "@clerk/express";
import { prisma } from "../config/prisma";
import AuthError from "../errors/AuthError";
import NotFoundError from "../errors/NotFoundError";

export const authService = async (clerkId: string) => {
  const clerkUser = await clerkClient.users.getUser(clerkId);
  if (!clerkUser) throw new AuthError("user not authenticated");
  const primaryEmail = clerkUser.primaryEmailAddress?.emailAddress;
  if(!primaryEmail) throw new AuthError('user email not found');
  const phone = clerkUser.phoneNumbers[0]?.phoneNumber
  console.log(phone)

  const user = prisma.user.upsert({
    where: { clerkId },
    update: {
      email: primaryEmail,
      firstName: clerkUser.firstName ?? undefined,
      lastName: clerkUser.lastName ?? undefined,
    },
    create: {
      clerkId: clerkUser.id,
      email: primaryEmail,
      firstName: clerkUser.firstName ?? undefined,
      lastName: clerkUser.lastName ?? undefined,
      phone : phone ?? undefined,
    },
  });
  if(!user) throw new NotFoundError('user')

    return user
};
