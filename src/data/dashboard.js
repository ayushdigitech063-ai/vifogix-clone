export const publisherUser = {
  name: "Alex Morgan",
  initial: "A",
  email: "alex@example.com",
};

export const navItems = [
  { label: "Overview", path: "/publisher-dashboard", icon: "LayoutDashboard", end: true },
  { label: "My Websites", path: "/publisher-dashboard/websites", icon: "Globe" },
  { label: "Orders", path: "/publisher-dashboard/orders", icon: "ShoppingBag" },
  { label: "Gigs", path: "/publisher-dashboard/gigs", icon: "Zap" },
  { label: "Earnings", path: "/publisher-dashboard/earnings", icon: "TrendingUp" },
];

export const buyerNavItems = [
  { label: "Overview", path: "/buyer-dashboard", icon: "LayoutDashboard", end: true },
  { label: "Marketplace", path: "/marketplace", icon: "Globe" },
  { label: "My Orders", path: "/buyer-dashboard/orders", icon: "ShoppingBag" },
  { label: "My Projects", path: "/buyer-dashboard/projects", icon: "FolderKanban" },
  { label: "Wallet & Billing", path: "/buyer-dashboard/wallet", icon: "Wallet" },
];

export const defaultStats = {
  netIncome: 0,
  totalOrders: 0,
  completedOrders: 0,
  gigsListed: 0,
  avgRating: 0.0,
  totalReviews: 0,
  responseRate: 100,
};

export const defaultEarnings = [
  {
    key: "completed",
    label: "Completed earnings",
    hint: "Verified and ready",
    amount: 0,
    icon: "CheckCircle",
  },
  {
    key: "pending",
    label: "Pending clearance",
    hint: "Under verification",
    amount: 0,
    icon: "Clock",
  },
  {
    key: "escrow",
    label: "In escrow",
    hint: "Held for active orders",
    amount: 0,
    icon: "ShieldAlert",
  },
];

// Empty series by default (triggers empty state)
export const defaultSeries = [];

// Sample series for testing and visual verification
// Swap this in or use in useDashboardStats to verify the chart renders:
export const sampleSeries = [
  { label: "W1", value: 12 },
  { label: "W2", value: 19 },
  { label: "W3", value: 8 },
  { label: "W4", value: 27 },
  { label: "W5", value: 34 },
  { label: "W6", value: 22 },
  { label: "W7", value: 45 },
  { label: "W8", value: 38 },
  { label: "W9", value: 50 },
  { label: "W10", value: 42 },
  { label: "W11", value: 60 },
  { label: "W12", value: 75 },
];

