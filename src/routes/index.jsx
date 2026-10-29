// src/routes/index.jsx
import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

const Marketplace = lazy(() => import("../pages/Marketplace"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Marketplace /> },
      { path: "marketplace", element: <Marketplace /> },
    ],
  },
]);