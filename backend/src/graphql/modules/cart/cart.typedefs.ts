import { gql } from "graphql-tag";

export const cartTypeDefs = gql`
  scalar DateTime

  type Cart {
    id: ID!
    clerkUserId: ID!
    items: [CartItem!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type CartItem {
    id: ID!
    cartId: ID!
    variantId: ID!
    quantity: Int!

    cart: Cart!
    variant: ProductVariant!
  }

  type Query {
    cart(clerkId: ID!): [CartItem]!
  }
`;
