import { useState, useEffect, Suspense } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import { DashboardTopbar } from "../components/dashboard-sections";

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
        {/* Topbar for Desktop and Mobile */}
        <DashboardTopbar onOpenSidebar={() => setSidebarOpen(true)} />

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

