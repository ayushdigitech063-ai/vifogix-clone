import { useState, useRef, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Menu,
  Search,
  ExternalLink,
  Bell,
  ChevronDown,
  Settings,
  LogOut,
} from "lucide-react";
import { adminNav } from "../../../data/admin/adminNav";
import { useAuth } from "../../../hooks/useAuth";

const getPageTitle = (pathname) => {
  if (pathname === "/admin" || pathname === "/admin/") return "Dashboard";
  for (const group of adminNav) {
    for (const item of group.items) {
      if (item.href === pathname) return item.label;
    }
  }
  return "Admin";
};

const Topbar = ({ onOpenSidebar }) => {
  const { admin, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const title = getPageTitle(location.pathname);

  // Close dropdown on click outside or escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const initials = admin?.name
    ? admin.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border bg-white px-4 md:px-6">
      {/* Left: Mobile hamburger + Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-fg lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <h2 className="text-lg font-bold text-fg md:text-xl">{title}</h2>
      </div>

      {/* Middle: Search (hidden below md) */}
      <div className="hidden md:flex md:w-72 lg:w-96">
        <div className="relative w-full">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search className="h-4 w-4" aria-hidden="true" />
          </span>
          <input
            type="search"
            placeholder="Search admin..."
            className="w-full rounded-full border border-border bg-cream/50 py-1.5 pl-9 pr-4 text-xs text-fg outline-none placeholder:text-gray-400 focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* View Site link */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-fg"
          title="View public website"
        >
          <span>View site</span>
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>

        {/* Notifications */}
        <button
          type="button"
          className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-fg"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent-red" />
        </button>

        {/* User Menu Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {initials}
            </div>
            <span className="hidden text-xs font-semibold text-fg sm:inline-block">
              {admin?.name || "Admin"}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform ${menuOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-white py-1.5 shadow-lg"
            >
              <div className="border-b border-border px-4 py-2">
                <p className="truncate text-xs font-semibold text-fg">{admin?.name}</p>
                <p className="truncate text-[11px] text-gray-500">{admin?.email}</p>
              </div>
              <Link
                to="/admin/settings"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-fg"
              >
                <Settings className="h-4 w-4 text-gray-400" aria-hidden="true" />
                Settings
              </Link>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-xs font-medium text-accent-red hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
