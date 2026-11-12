import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  ExternalLink,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useDashboardStats } from "../../hooks/useDashboardStats";

const getPageTitle = (pathname) => {
  if (pathname.startsWith("/buyer-dashboard")) {
    if (pathname.includes("/orders")) return "My Orders";
    if (pathname.includes("/projects")) return "Campaign Projects";
    if (pathname.includes("/wallet")) return "Wallet & Billing";
    return "Buyer Dashboard";
  }
  if (pathname === "/publisher-dashboard" || pathname === "/publisher-dashboard/") {
    return "Publisher Dashboard";
  }
  if (pathname.includes("/orders")) return "Orders Management";
  if (pathname.includes("/websites/new")) return "Add New Website";
  if (pathname.includes("/websites")) return "My Websites";
  if (pathname.includes("/gigs/new")) return "Create New Gig";
  if (pathname.includes("/gigs")) return "Gigs & Services";
  if (pathname.includes("/earnings")) return "Earnings Details";
  return "Dashboard";
};

const DashboardTopbar = ({ onOpenSidebar }) => {
  const location = useLocation();
  const { user } = useDashboardStats();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const menuRef = useRef(null);
  const notifRef = useRef(null);

  const isBuyer = location.pathname.startsWith("/buyer-dashboard");
  const roleLabel = isBuyer ? "Buyer" : "Publisher";
  const title = getPageTitle(location.pathname);

  // Close dropdowns on outside click or escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setUserMenuOpen(false);
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Close menus on path changes
  useEffect(() => {
    setUserMenuOpen(false);
    setNotificationsOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-surface px-4 md:px-6">
      {/* Left: Mobile hamburger + Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="rounded-lg p-2 text-muted hover:bg-cream hover:text-fg lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2.5">
          <h2 className="text-lg font-bold text-fg md:text-xl tracking-tight">
            {title}
          </h2>
          <span
            className={`hidden sm:inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
              isBuyer
                ? "bg-accent-yellow/15 border-accent-yellow/30 text-fg"
                : "bg-primary/10 border-primary/20 text-primary"
            }`}
          >
            <Sparkles className="h-3 w-3" />
            {roleLabel}
          </span>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden md:flex md:w-64 lg:w-80">
        <div className="relative w-full">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
            <Search className="h-4 w-4" aria-hidden="true" />
          </span>
          <input
            type="search"
            placeholder={isBuyer ? "Search marketplace, orders..." : "Search gigs, websites, orders..."}
            className="w-full rounded-full border border-border bg-cream/40 py-1.5 pl-9 pr-4 text-xs text-fg outline-none placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Right: Actions, Notifications, Role Switch, User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Switch Workspace Role Button */}
        <Link
          to={isBuyer ? "/publisher-dashboard" : "/buyer-dashboard"}
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-fg transition hover:border-primary/40 hover:bg-cream"
          title={`Switch to ${isBuyer ? "Publisher" : "Buyer"} Workspace`}
        >
          <span>Switch to {isBuyer ? "Publisher" : "Buyer"}</span>
        </Link>

        {/* View Public Marketplace */}
        <Link
          to="/marketplace"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-lg p-2 text-muted transition hover:bg-cream hover:text-fg"
          title="Browse Marketplace"
          aria-label="Browse Marketplace"
        >
          <ExternalLink className="h-4 w-4" />
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative rounded-lg p-2 text-muted transition hover:bg-cream hover:text-fg"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent-red" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl border border-border bg-surface p-4 shadow-xl animate-fade-in z-50">
              <div className="flex items-center justify-between border-b border-border pb-2 mb-3">
                <span className="text-xs font-bold text-fg">Notifications</span>
                <span className="text-[10px] text-primary cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="space-y-2 text-xs text-muted">
                <div className="rounded-lg bg-cream/60 p-2.5">
                  <p className="font-semibold text-fg">Welcome to your dashboard!</p>
                  <p className="text-[11px] mt-0.5">Explore your tools and get started today.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 rounded-lg p-1.5 transition hover:bg-cream focus-visible:outline-2 focus-visible:outline-primary"
            aria-label="User menu"
            aria-expanded={userMenuOpen}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-xs text-white shadow-xs">
              {user?.initial || "U"}
            </div>
            <div className="hidden text-left xl:block">
              <p className="text-xs font-semibold text-fg leading-none">
                {user?.name || "Alex Morgan"}
              </p>
              <p className="text-[10px] text-muted leading-tight mt-0.5">
                {user?.email || "alex@example.com"}
              </p>
            </div>
            <ChevronDown className="hidden h-3.5 w-3.5 text-muted sm:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-surface py-1.5 shadow-xl animate-fade-in z-50">
              <div className="border-b border-border px-4 py-2.5">
                <p className="text-xs font-bold text-fg">{user?.name || "Alex Morgan"}</p>
                <p className="text-[11px] text-muted">{user?.email || "alex@example.com"}</p>
                <div className="mt-2 inline-flex items-center gap-1 rounded bg-cream px-2 py-0.5 text-[10px] font-semibold text-primary">
                  {roleLabel} Account
                </div>
              </div>

              <div className="py-1">
                <Link
                  to={isBuyer ? "/buyer-dashboard" : "/publisher-dashboard"}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-fg hover:bg-cream"
                >
                  <User className="h-4 w-4 text-muted" />
                  <span>Dashboard Home</span>
                </Link>

                <Link
                  to={isBuyer ? "/publisher-dashboard" : "/buyer-dashboard"}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-fg hover:bg-cream"
                >
                  <Sparkles className="h-4 w-4 text-accent-yellow" />
                  <span>Switch to {isBuyer ? "Publisher" : "Buyer"}</span>
                </Link>

                <Link
                  to="/"
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-fg hover:bg-cream"
                >
                  <Settings className="h-4 w-4 text-muted" />
                  <span>Account Settings</span>
                </Link>
              </div>

              <div className="border-t border-border pt-1">
                <Link
                  to="/signin"
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-xs text-accent-red hover:bg-cream"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardTopbar;

