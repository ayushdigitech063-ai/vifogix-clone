import { lazy, Suspense } from "react";
import { Loader2, Clock } from "lucide-react";
import ProtectedRoute from "./ProtectedRoute";
import PageHeader from "../components/admin/layout/PageHeader";

// Lazy-loaded Admin Layout and Pages to keep public bundle light
const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const AdminLogin = lazy(() => import("../pages/admin/AdminLogin"));
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));

const AdminLoadingFallback = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
      <span className="text-xs font-medium text-gray-500">Loading admin panel...</span>
    </div>
  </div>
);

const ComingSoonPage = ({ title, description }) => (
  <div className="space-y-6">
    <PageHeader title={title} description={description} />
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white p-8 text-center shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cream text-primary">
        <Clock className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-base font-bold text-fg">{title} Management</h3>
      <p className="mt-1 max-w-sm text-xs text-gray-500">
        This section is currently under development and will be available in the upcoming release.
      </p>
    </div>
  </div>
);

export const adminRoutes = [
  {
    path: "/admin/login",
    element: (
      <Suspense fallback={<AdminLoadingFallback />}>
        <AdminLogin />
      </Suspense>
    ),
  },
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      {
        element: (
          <Suspense fallback={<AdminLoadingFallback />}>
            <AdminLayout />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<AdminLoadingFallback />}>
                <Dashboard />
              </Suspense>
            ),
          },
          {
            path: "blogs",
            element: (
              <ComingSoonPage
                title="Blogs"
                description="Manage, create and publish blog posts and articles."
              />
            ),
          },
          {
            path: "websites",
            element: (
              <ComingSoonPage
                title="Websites"
                description="Manage publisher sites, metrics and pricing."
              />
            ),
          },
          {
            path: "packages",
            element: (
              <ComingSoonPage
                title="Packages"
                description="Configure guest posting and link building packages."
              />
            ),
          },
          {
            path: "orders",
            element: (
              <ComingSoonPage
                title="Orders"
                description="Review customer orders, update statuses and process deliverables."
              />
            ),
          },
          {
            path: "users",
            element: (
              <ComingSoonPage
                title="Users"
                description="Manage registered clients, publishers and roles."
              />
            ),
          },
          {
            path: "enquiries",
            element: (
              <ComingSoonPage
                title="Enquiries"
                description="View contact form submissions and sales leads."
              />
            ),
          },
          {
            path: "settings",
            element: (
              <ComingSoonPage
                title="Settings"
                description="Configure platform preferences, branding and security options."
              />
            ),
          },
        ],
      },
    ],
  },
];
