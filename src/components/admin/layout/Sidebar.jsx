import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Globe,
  Package,
  ShoppingCart,
  Users,
  Mail,
  Settings,
  X,
  LogOut,
} from "lucide-react";
import { adminNav } from "../../../data/admin/adminNav";
import { useAdminAuth } from "../../../hooks/useAdminAuth";

const renderNavIcon = (name) => {
  const common = {
    className: "h-[18px] w-[18px]",
    "aria-hidden": "true",
  };

  switch (name) {
    case "dashboard":
      return <LayoutDashboard {...common} />;
    case "blogs":
      return <BookOpen {...common} />;
    case "globe":
      return <Globe {...common} />;
    case "package":
      return <Package {...common} />;
    case "orders":
      return <ShoppingCart {...common} />;
    case "users":
      return <Users {...common} />;
    case "mail":
      return <Mail {...common} />;
    case "settings":
      return <Settings {...common} />;
    default:
      return null;
  }
};

const Sidebar = ({ isOpen, onClose }) => {
  const { admin, logout } = useAdminAuth();
  const location = useLocation();
  const drawerRef = useRef(null);

  // Close on route change
  useEffect(() => {
    onClose?.();
  }, [location.pathname, onClose]);

  // Handle escape key and lock body scroll on mobile
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus drawer when opened
    drawerRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  const initials = admin?.name
    ? admin.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  const navContent = (
    <div className="flex h-full flex-col justify-between bg-[#101626] text-white">
      {/* Brand */}
      <div>
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-white">Sumit DevTech</span>
            <span className="rounded bg-accent-yellow/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-yellow">
              Admin
            </span>
          </div>
          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation Groups */}
        <nav aria-label="Admin Navigation" className="space-y-6 px-3 py-6">
          {adminNav.map((group) => (
            <div key={group.group}>
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                {group.group}
              </p>
              <ul className="mt-2 space-y-1">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <NavLink
                      to={item.href}
                      end={item.href === "/admin"}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                          isActive
                            ? "border-l-[3px] border-accent-yellow bg-white/10 text-white font-semibold"
                            : "border-l-[3px] border-transparent text-gray-300 hover:bg-white/5 hover:text-white"
                        }`
                      }
                    >
                      <span className="text-gray-400 group-hover:text-white">
                        {renderNavIcon(item.icon)}
                      </span>
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* User & Logout section */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {admin?.name || "Administrator"}
            </p>
            <p className="truncate text-xs text-gray-400">{admin?.email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded p-1.5 text-gray-400 hover:bg-white/10 hover:text-white"
            title="Log out"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-[260px] lg:flex-col">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Dimmed backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer container */}
          <aside
            ref={drawerRef}
            tabIndex={-1}
            role="dialog"
            aria-label="Mobile Admin Navigation"
            aria-modal="true"
            className="fixed inset-y-0 left-0 w-[260px] shadow-2xl focus:outline-none"
          >
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
