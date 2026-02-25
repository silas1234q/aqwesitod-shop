import { useQuery } from "@tanstack/react-query";
import { fetchGraphQL } from "../api/graphql.api";
import { GET_PRODUCT, GET_PRODUCTS, GET_PRODUCTS_BY_CATEGORY } from "../graphql/Product";
import { useAuth } from "@clerk/clerk-react";

export const useGetProducts = () => {
  const { getToken } = useAuth();
  const token = getToken();
  return useQuery({
    queryKey: ["products"],
    queryFn: () =>
      fetchGraphQL({
        query: GET_PRODUCTS,
        token,
      }),
  });
};

export const useGetProductById = (productId: string) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const token = await getToken();
      return fetchGraphQL({
        query: GET_PRODUCT,
        variables: { id: productId },
        token,
      });
    },
    enabled: !!productId,
  });
};


export const useGetProductsByCategory = (categoryId: string, limit: number) => {
  const { getToken } = useAuth();
  const token = getToken();
  return useQuery({
    queryKey: ["products", categoryId],
    queryFn: () =>
      fetchGraphQL({
        query: GET_PRODUCTS_BY_CATEGORY,
        variables: { categoryId, limit },
        token,
      }),
  });
};
