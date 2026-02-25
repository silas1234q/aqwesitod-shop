import { getAuth } from "@clerk/express";
import { getCartService } from "../../../services/cart.service";
import { GraphQLContext } from "../../context";

export const cartResolvers = {
  Query: {
    cart: async (_: unknown, args: {clerkId:string}, ctx: GraphQLContext) => {
        
      return getCartService(args.clerkId);
    },
  },
};
