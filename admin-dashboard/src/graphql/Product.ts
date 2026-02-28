import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query products {
    products {
      id
      name
      description
      priceCents
      instock
      primaryImageUrl
      categoryId
      images {
        id
        url
        alt
      }
      discountedPriceCents
      colors {
        name
        hex
        sortOrder
      }
      category{
        id
        name
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query product($id: ID!) {
    product(id: $id) {
      id
      name
      description
      priceCents
      primaryImageUrl
      images {
        id
        url
        alt
      }
      discountedPriceCents
      details {
        value
        sortOrder
        productId
      }
      fabric
      care {
        value
        sortOrder
        productId
      }
      sizes {
        size
        sortOrder
        productId
      }
      colors {
        name
        hex
        sortOrder
      }
      variants {
        id
        colorName
        size
        priceCents
        discountedPriceCents
        stockQuantity
        isActive
      }
      inStock
    }
  }
`;

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query productsByCategory($categoryId: ID!, $limit: Int!) {
    productsByCategory(categoryId: $categoryId, limit: $limit) {
      id
      name
      description
      priceCents
      inStock
      primaryImageUrl
      images {
        id
        url
        alt
      }
      discountedPriceCents
      colors {
        name
        hex
        sortOrder
      }
      category{
        id
        name
      }
    }
  }
`;
