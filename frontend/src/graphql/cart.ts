import { gql } from "@apollo/client";

export const GET_CART = gql`
  query carts($clerkId: ID!) {
    cart(clerkId: $clerkId) {
      id
      quantity
      variant {
        id
        size
        colorName
        priceCents
        discountedPriceCents
        product {
          name
          images{
            url
          }
        }
      }
    }
  }
`;
