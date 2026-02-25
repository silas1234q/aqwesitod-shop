export const productTypeDefs = `#graphql
  scalar DateTime

  type Product {
    id: ID!
    name: String!
    description: String
    fabric: String
    inStock: Boolean!

    priceCents: Int!
    discountedPriceCents: Int
    categoryId: String!
    category: Category

    primaryImageUrl: String

    images: [ProductImage!]!
    details: [ProductDetail!]!
    care: [ProductCare!]!
    sizes: [ProductSize!]!
    colors: [ProductColor!]!
    variants: [ProductVariant!]!

    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type ProductImage {
    id: ID!
    url: String!
    alt: String!
    sortOrder: Int!
    productId: ID!
  }

  type ProductDetail {
    id: ID!
    value: String!
    sortOrder: Int!
    productId: ID!
  }

  type ProductCare {
    id: ID!
    value: String!
    sortOrder: Int!
    productId: ID!
  }

  type ProductSize {
    id: ID!
    size: String!
    sortOrder: Int!
    productId: ID!
  }

  type ProductColor {
    id: ID!
    name: String!
    hex: String!
    sortOrder: Int!
    productId: ID!
  }

  type ProductVariant {
    id: ID!
    size: String
    colorName: String
    sku: String

    priceCents: Int!
    discountedPriceCents: Int

    stockQuantity: Int!
    isActive: Boolean!

    productId: ID!
    product: Product!
  }

  type Query {
    products: [Product!]!
    product(id: ID!): Product
    productsByCategory(categoryId: ID!,limit:Int!): [Product!]!
  }
`;
