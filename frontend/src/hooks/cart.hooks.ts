import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiCall } from "../api/apicall";
import { useAuth } from "@clerk/clerk-react";
import { fetchGraphQL } from "../api/graphql.api";
import { GET_CART } from "../graphql/cart";
import type { CartItemsType } from "../types/cartTypes";

const URl = import.meta.env.VITE_API_URL;

type AddToCartParams = {
  variantId: string;
  quantity: number;
};

export const useAddToCart = () => {
  const { getToken, isSignedIn } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ variantId, quantity }: AddToCartParams) => {
      if (!isSignedIn) throw new Error("Not authenticated");

      const token = await getToken();
      if (!token) throw new Error("No token available");

      return apiCall(`${URl}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ correct
        },
        body: JSON.stringify({ variantId, quantity }),
      });
    },
    onSuccess: () => {
      // Invalidate cart query to refetch updated cart data
      queryClient.invalidateQueries<CartItemsType[]>(["cart"]);
    },
  });
};

export const useCart = () => {
  const { getToken, isSignedIn, userId } = useAuth();

  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      if (!isSignedIn) throw new Error("Not authenticated");
      const token = await getToken();
      if (!token) throw new Error("No token available");

      return fetchGraphQL({
        query: GET_CART,
        variables: { clerkId: userId! },
        token: token,
      });
    },
  });
};

export const useRemoveFromCart = () => {
  const { getToken, isSignedIn } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cartItemId: string) => {
      if (!isSignedIn) throw new Error("Not authenticated");
      const token = await getToken();
      if (!token) throw new Error("No token available");
      return apiCall(`${URl}/api/cart/${cartItemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      // Invalidate cart query to refetch updated cart data
      queryClient.invalidateQueries<CartItemsType[]>(["cart"]);
    },
  });
};


export const useUpdateCartQuantity = ()=>{
  const { getToken, isSignedIn } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({cartItemId,quantity}:{cartItemId:string,quantity:number}) => {
      if (!isSignedIn) throw new Error("Not authenticated");
      const token = await getToken();
      if (!token) throw new Error("No token available");
      return apiCall(`${URl}/api/cart/${cartItemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({quantity})
      });
    },
    onSuccess: () => {
      // Invalidate cart query to refetch updated cart data
      queryClient.invalidateQueries<CartItemsType[]>(["cart"]);
    },
  });
}