import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./routes/Root";
import Home from "./routes/Home";
import ProductDetailsPage from "./routes/[productId]";
import Collections from "./routes/Collections";
import About from "./routes/About";
import Contact from "./routes/Contact";
import Cart from "./routes/Cart";
import Wishlist from "./routes/WishList";
import SearchPage from "./routes/SearchPage";
import { ClerkProvider } from "@clerk/clerk-react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";


const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "collections",
          element: <Collections />,
        },
        {
          path: "about",
          element: <About />,
        },
        {
          path: "contact",
          element: <Contact />,
        },
        {
          path: "cart",
          element: <Cart />,
        },
        {
          path: "wishlist",
          element: <Wishlist />,
        },
        {
          path: "search",
          element: <SearchPage />,
        },
      ],
    },
    {
      path: "product/:productId",
      element: <ProductDetailsPage />,
    },
  ],
);
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Retry failed requests once
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnReconnect: false, // Don't refetch on reconnect
      staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
      cacheTime: 10 * 60 * 1000, // Cache time for unused cache after 10 minutes
    },
  },
});
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ClerkProvider>
  </React.StrictMode>,
);
