import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchGraphQL } from "../api/graphql.api";
import { GET_PRODUCT, GET_PRODUCTS, GET_PRODUCTS_BY_CATEGORY } from "../graphql/Product";
import { apiCall } from "../api/apicall";

const URL = "http://localhost:4000";
//  import.meta.env.VITE_API_URL ||

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

export const useDeleteProduct = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const token = await getToken();
      return apiCall(`${URL}/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      // Invalidate or refetch queries related to products here if needed
      queryClient.invalidateQueries(["products"]);
    },
    onError: (error) => {
      console.error("Failed to delete product:", error);
    },
  });
};

export const useCreateProduct = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productData: any) => {
      const token = await getToken();
      return apiCall(`${URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });
    },
    onSuccess: () => {
      // Invalidate or refetch queries related to products here if needed
      queryClient.invalidateQueries(["products"]);
    },
  });
};

export const useUpdateProduct = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      productData,
    }: {
      productId: string;
      productData: any;
    }) => {
      const token = await getToken();
      return apiCall(`${URL}/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });
    },
    onSuccess: () => {
      // Invalidate or refetch queries related to products here if needed
      queryClient.invalidateQueries(["products"]);
    },
  });
};

export const useGetProductById = (productId: string,{...options}) => {
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
    ...options
  });
};
