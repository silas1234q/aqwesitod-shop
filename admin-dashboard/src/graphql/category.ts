import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query categories {
    categories {
      id
      name
      image
      description
      products {
        id
      }
    }
  }
`;

export const GET_CATEGORY = gql`
  query category($id: ID!) {
    category(id: $id) {
      id
      name
    }
  }
`;
