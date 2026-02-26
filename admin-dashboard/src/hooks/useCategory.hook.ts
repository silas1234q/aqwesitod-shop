import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { fetchGraphQL } from "../api/graphql.api";
import { GET_CATEGORIES, GET_CATEGORY } from "../graphql/category";

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
