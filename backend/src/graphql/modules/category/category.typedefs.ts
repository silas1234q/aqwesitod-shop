import gql from "graphql-tag";

export const CategoryTypeDefs = gql`
  type Category {
    id: ID!
    name: String!
    products:[Product!]!
    slug:String!
    image:String!
    description:String
    createdAt:String
    updatedAt:String
  }

  type Query{
    categories: [Category!]!
    category(id: ID!): Category
  }
`;
