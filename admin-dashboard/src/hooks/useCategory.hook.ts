import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchGraphQL } from "../api/graphql.api";
import { GET_CATEGORIES, GET_CATEGORY } from "../graphql/category";
import { apiCall } from "../api/apicall";

const URL = "http://localhost:4000";
// import.meta.env.VITE_API_URL;

export const useGetCategories = () => {
  const { getToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["categories"],
    enabled: !!isSignedIn, // or: !!isSignedIn if your endpoint requires auth
    queryFn: async () => {
      const token = await getToken(); // ✅ ok here, because getToken is just a function
      return fetchGraphQL({
        query: GET_CATEGORIES,
        variables: {},
        token: token ?? undefined,
      });
    },
    staleTime: 1000 * 60, // optional
  });
};

export const useGetCategoryById = (id: string) =>
  useQuery({
    queryKey: ["category", id],
    queryFn: async () => {
      const { getToken } = useAuth();
      const token = await getToken();
      return fetchGraphQL({
        query: GET_CATEGORY,
        variables: { id },
        token,
      });
    },
  });
export const useCreateCategory = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (categoryData: any) => {
      const token = await getToken();
      console.log("Creating category with data:", categoryData); // Debug log
      return apiCall(`${URL}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryData),
      });
    },
    onSuccess: () => {
      // Invalidate the categories query to refetch the updated list after creation
      queryClient.invalidateQueries(["categories"]);
    },
  });
};

export const useUpdateCategory = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ categoryId,categoryData }: any) => {
      const token = await getToken();
      return apiCall(`${URL}/api/categories/${categoryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryData),
      });
    },
    onSuccess: () => {
      // Invalidate the categories query to refetch the updated list after update
      queryClient.invalidateQueries(["categories"]);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      return apiCall(`${URL}/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      // Invalidate the categories query to refetch the updated list after deletion
      queryClient.invalidateQueries(["categories"]);
    },
  });
};
