import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { fetchGraphQL } from "../api/graphql.api";
import { GET_PRODUCTS, GET_PRODUCTS_BY_CATEGORY } from "../graphql/Product";

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

export const useGetProductsByCategory = (
  categoryId: string | undefined,
  limit: number,
) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["products", { categoryId: categoryId ?? "all", limit }],
    enabled: Number.isFinite(limit) && limit > 0, // allow "all"
    queryFn: async () => {
      const token = await getToken(); // ✅ await here

      return fetchGraphQL({
        query: GET_PRODUCTS_BY_CATEGORY,
        variables: {
          categoryId: categoryId ?? null, // ✅ send null for "all" (adjust to your API)
          limit,
        },
        token,
      });
    },
  });
};
