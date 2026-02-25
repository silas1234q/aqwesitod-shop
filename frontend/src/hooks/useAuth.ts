import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { apiCall } from "../api/apicall";

const API_URL = import.meta.env.VITE_API_URL;

export const useAuthApi = () => {
  const { getToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["auth", "me"],
    enabled: !!isSignedIn, // only run when signed in
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No Clerk token available");

      return apiCall(`${API_URL}/api/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    },
    retry: false,
    staleTime: 1000 * 60,
  });
};
