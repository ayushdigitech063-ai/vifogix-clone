import { useState, useEffect, Suspense } from "react";
import { Outlet, Link } from "react-router-dom";
import { Menu } from "lucide-react";
import DashboardSidebar from "./DashboardSidebar";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Lock body scroll when mobile sidebar drawer is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar for Desktop + Off-canvas Drawer for Mobile */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main wrapper shifted on desktop */}
      <div className="flex min-h-screen flex-col lg:pl-64">
        {/* Mobile slim top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-fg hover:bg-cream focus-visible:outline-2 focus-visible:outline-primary"
            aria-label="Open menu"
            aria-expanded={sidebarOpen}
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link
            to="/"
            className="flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-primary rounded-md"
            title="Go to homepage"
          >
            <div className="flex items-center rounded-lg bg-white p-1 shadow-xs border border-border">
              <img
                src="/images/logo.png"
                alt="Logo"
                className="h-6 w-auto object-contain"
              />
            </div>
          </Link>

          <div className="w-8" aria-hidden="true" />
        </header>

        {/* Scrollable content area */}
        <main className="flex-1 p-4 md:p-8">
          <Suspense fallback={<div className="p-10 text-center text-muted">Loading…</div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

