import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";


import { productTypeDefs } from "./modules/product/product.typedefs";
import { productResolvers } from "./modules/product/product.resolvers";
import { cartTypeDefs } from "./modules/cart/cart.typedefs";
import { cartResolvers } from "./modules/cart/cart.resolvers";
import { CategoryTypeDefs } from "./modules/category/category.typedefs";
import { CategoryResolver } from "./modules/category/category.resolver";

// add more modules here...

const typeDefs = mergeTypeDefs([productTypeDefs,cartTypeDefs,CategoryTypeDefs]);
const resolvers = mergeResolvers([productResolvers, cartResolvers, CategoryResolver]);


export const schema = makeExecutableSchema({ typeDefs, resolvers });