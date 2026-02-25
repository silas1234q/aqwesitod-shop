import { GraphQLContext } from "../../context";

export const CategoryResolver = {
    Query:{
        categories: async (_: any, __: any, ctx: GraphQLContext) => {
            return await ctx.prisma.category.findMany({
                include: {
                    products: true
                }
            });
        },
        category: async (_: any, args: any, ctx: GraphQLContext) => {
            return await ctx.prisma.category.findUnique({
                where: {
                    id: args.id
                },
                include: {
                    products: true
                }
            });
        }
    }
}