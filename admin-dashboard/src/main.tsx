import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import "./index.css";
import Layout    from "./components/Layouts";
import Overview  from "./pages/Overview";
import Products  from "./pages/Products";
import ProductForm from "./pages/ProductForm";
import Orders    from "./pages/Orders";
import Customers from "./pages/Customers";
import Settings  from "./pages/Settings";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true,              element: <Overview /> },
      { path: "products",         element: <Products /> },
      { path: "products/new",     element: <ProductForm /> },
      { path: "products/:id/edit",element: <ProductForm /> },
      { path: "orders",           element: <Orders /> },
      { path: "customers",        element: <Customers /> },
      { path: "settings",         element: <Settings /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    
    <RouterProvider router={router} />
  </StrictMode>
);