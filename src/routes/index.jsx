// src/routes/index.jsx
import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";

const Marketplace = lazy(() => import("../pages/Marketplace"));
const LinkBuilding = lazy(()=> import("../pages/Linkbuilding"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "marketplace", element: <Marketplace /> },
      {path: "link-building-services", element: <LinkBuilding />}
    ],
  },
]);