import { Link, NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Zap, TrendingUp, Globe, X } from "lucide-react";
import { navItems, buyerNavItems } from "../data/dashboard";

const iconsMap = {
  LayoutDashboard,
  ShoppingBag,
  Zap,
  TrendingUp,
  Globe,
};

const DashboardSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const isBuyer = location.pathname.startsWith("/buyer-dashboard");
  const items = isBuyer ? buyerNavItems : navItems;
  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-fg/60 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        aria-label="Dashboard"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-fg text-white transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top brand header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
          <Link
            to="/"
            className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-accent-yellow rounded-md"
            title="Go to homepage"
          >
            <div className="flex items-center rounded-lg bg-white p-1.5 shadow-xs">
              <img
                src="/images/logo.png"
                alt="Sumit DevTech Logo"
                title="Sumit DevTech Logo"
                className="h-6 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Close button for mobile drawer */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation items */}
        <nav aria-label="Dashboard navigation" className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          {items.map((item) => {
            const IconComponent = iconsMap[item.icon] || LayoutDashboard;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "border-l-2 border-accent-yellow bg-white/10 text-white font-semibold"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <IconComponent className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer label */}
        <div className="p-4 border-t border-white/10 text-xs text-white/50 text-center">
          {isBuyer ? "Buyer Control Center" : "Publisher Control Center"}
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;

