import type { GraphQLContext } from "../../context";

export const productResolvers = {
  Query: {
    products: async (_: unknown, __: unknown, ctx: GraphQLContext) => {
      return ctx.prisma.product.findMany({
        include: {
          images: true,
          details: true,
          care: true,
          sizes: true,
          colors: true,
          variants: true,
          category: true,
        },
      });
    },
    product: async (_: unknown, args: { id: string }, ctx: GraphQLContext) => {
      return ctx.prisma.product.findUnique({
        where: { id: args.id },
        include: {
          images: true,
          details: true,
          care: true,
          sizes: true,
          colors: true,
          variants: true,
        },
      })
    },
    productsByCategory: async (_: unknown, args: { categoryId: string,limit:number }, ctx: GraphQLContext) => {
      if(args.categoryId === "all"){
        return ctx.prisma.product.findMany({
          include: {
            images: true,
            details: true,
            care: true,
            sizes: true,
            colors: true,
            variants: true,
          },
          take: args.limit,
        });
      }
      return ctx.prisma.product.findMany({
        where: { categoryId: args.categoryId },
        include: {
          images: true,
          details: true,
          care: true,
          sizes: true,
          colors: true,
          variants: true,
        },
        take: args.limit,
      });
    }
  },

};