// src/routes/PackageManagerRoutes.jsx
import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import PackageManagerProtectedRoute from "./PackageManagerProtectedRoute";

const PackageManagerLayout = lazy(() => import("../layouts/PackageManagerLayout"));
const PackageManagerLogin = lazy(() => import("../pages/packageManagerAdmin/PackageManagerLogin"));
const PackageListing = lazy(() => import("../pages/packageManagerAdmin/packageListing"));
const CreatePackage = lazy(() => import("../pages/packageManagerAdmin/createPackage"));
const PackageDetail = lazy(() => import("../pages/packageManagerAdmin/packageDetail"));
const PackageManagerPackages = lazy(() => import("../pages/packageManagerAdmin/PackageManagerPackages"));

const LoadingFallback = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      <span className="text-xs font-medium text-gray-500">Loading package manager...</span>
    </div>
  </div>
);

export const packageManagerRoutes = [
  {
    path: "/package-manager/login",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <PackageManagerLogin />
      </Suspense>
    ),
  },
  {
    path: "/package-manager",
    element: <PackageManagerProtectedRoute />,
    children: [
      {
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PackageManagerLayout />
          </Suspense>
        ),
        children: [
          { index: true, element: <Navigate to="packages" replace /> },
          { path: "packages", element: <PackageListing /> },
          { path: "packages/new", element: <CreatePackage /> },
          { path: "packages/edit/:slug", element: <CreatePackage /> },
          { path: "packages/:slug", element: <PackageDetail /> },
        ],
      },
    ],
  },
];
