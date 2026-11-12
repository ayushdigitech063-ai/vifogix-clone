import { Link } from "react-router-dom";
import {
  Wallet,
  ShoppingBag,
  Clock,
  CheckCircle2,
  FolderKanban,
  Search,
  Plus,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  CreditCard,
  Building2,
  Globe,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formatters";
import OrderStatusBadge from "../../components/dashboard-sections/orders/OrderStatusBadge";

// Realistic buyer mock data
const buyerStats = {
  walletBalance: 840.0,
  escrowBalance: 275.0,
  activeOrdersCount: 3,
  completedOrdersCount: 28,
  totalSpent: 4290.0,
  savedSitesCount: 14,
};

const activeBuyerOrders = [
  {
    id: "ORD-1042",
    domain: "techpulse.io",
    packageName: "Premium Guest Post, 1200 words",
    linkType: "DoFollow",
    targetUrl: "https://mysaas.com/features",
    anchorText: "AI Content Automation",
    status: "in_progress",
    amount: 180,
    dueDate: "2026-11-14T18:00:00Z",
  },
  {
    id: "ORD-1040",
    domain: "financefrontier.com",
    packageName: "Editorial Link Insertion",
    linkType: "DoFollow",
    targetUrl: "https://mysaas.com/pricing",
    anchorText: "B2B SaaS Financial Models",
    status: "revision",
    amount: 95,
    dueDate: "2026-11-08T18:00:00Z",
  },
  {
    id: "ORD-1039",
    domain: "healthhub360.org",
    packageName: "Medical Authority Post, 1500 words",
    linkType: "DoFollow",
    targetUrl: "https://mywellnessbrand.com",
    anchorText: "Holistic Health Trends",
    status: "delivered",
    amount: 250,
    dueDate: "2026-11-07T18:00:00Z",
  },
];

const buyerCampaigns = [
  {
    id: "proj-1",
    name: "Q4 SaaS Backlink Velocity",
    targetUrl: "https://mysaas.com",
    niche: "Technology & Software",
    targetCountry: "United States",
    placedLinks: 8,
    targetLinks: 12,
  },
  {
    id: "proj-2",
    name: "DTC Health & Wellness Outreach",
    targetUrl: "https://mywellnessbrand.com",
    niche: "Health & Lifestyle",
    targetCountry: "Global",
    placedLinks: 14,
    targetLinks: 15,
  },
];

const featuredMarketplaceSites = [
  {
    domain: "techcrunchy.io",
    category: "Technology",
    mozDA: 68,
    ahrefsDR: 72,
    traffic: "240k",
    price: 180,
  },
  {
    domain: "dailybusinessinsider.net",
    category: "Business & Finance",
    mozDA: 55,
    ahrefsDR: 58,
    traffic: "95k",
    price: 125,
  },
  {
    domain: "modernhealthtoday.org",
    category: "Health & Wellness",
    mozDA: 62,
    ahrefsDR: 65,
    traffic: "140k",
    price: 150,
  },
];

const BuyerDashboard = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-8 animate-fade-in pb-12">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-accent-yellow/30 bg-accent-yellow/15 px-3 py-1 text-xs font-semibold text-fg">
            <Sparkles className="h-3.5 w-3.5 text-accent-yellow" aria-hidden="true" />
            <span>Buyer Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight">
            Buyer Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted">
            Manage your link-building campaigns, discover high-authority websites, and track order progress.
          </p>
        </div>

        {/* Quick Action CTAs */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-primary-light transition-colors"
          >
            <Search className="h-4 w-4" />
            <span>Browse Marketplace</span>
          </Link>

          <Link
            to="/buyer-dashboard/wallet"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs sm:text-sm font-semibold text-fg hover:bg-cream transition-colors"
          >
            <Wallet className="h-4 w-4 text-primary" />
            <span>Deposit Funds</span>
          </Link>
        </div>
      </div>

      {/* 2. Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Wallet Balance */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Available Balance</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-fg">{formatCurrency(buyerStats.walletBalance)}</div>
            <p className="mt-1 text-xs text-muted">
              + {formatCurrency(buyerStats.escrowBalance)} in escrow holds
            </p>
          </div>
        </div>

        {/* Active Orders */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Active Placements</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-yellow/20 text-fg">
              <Clock className="h-4 w-4 text-accent-yellow" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-fg">{buyerStats.activeOrdersCount} Orders</div>
            <p className="mt-1 text-xs text-muted">1 pending review or revision</p>
          </div>
        </div>

        {/* Completed Placements */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Delivered Links</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-fg">{buyerStats.completedOrdersCount} Published</div>
            <p className="mt-1 text-xs text-muted">100% indexed & live</p>
          </div>
        </div>

        {/* Total Spend */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Lifetime Investment</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cream text-muted">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-fg">{formatCurrency(buyerStats.totalSpent)}</div>
            <p className="mt-1 text-xs text-muted">Across 2 active campaigns</p>
          </div>
        </div>
      </div>

      {/* 3. Main Split Section: Live Orders & Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Active Orders Tracking */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-surface shadow-xs overflow-hidden">
            <div className="flex items-center justify-between border-b border-border p-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-fg">Active Orders &amp; Placements</h2>
                  <p className="text-xs text-muted">Track turnaround times and live article drafts</p>
                </div>
              </div>
              <Link
                to="/buyer-dashboard/orders"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark"
              >
                <span>View All Orders</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-cream/40 text-[11px] font-bold uppercase tracking-wider text-muted">
                    <th className="py-3 px-5">Target Domain</th>
                    <th className="py-3 px-4">Anchor &amp; Link</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Deadline</th>
                    <th className="py-3 px-5 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs sm:text-sm">
                  {activeBuyerOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-cream/30 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <img
                            src={`https://www.google.com/s2/favicons?domain=${ord.domain}&sz=64`}
                            alt=""
                            className="h-4 w-4 shrink-0 rounded-sm"
                          />
                          <div>
                            <p className="font-semibold text-fg">{ord.domain}</p>
                            <p className="text-[11px] text-muted">{ord.packageName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-medium text-fg truncate max-w-[160px]" title={ord.anchorText}>
                          &quot;{ord.anchorText}&quot;
                        </p>
                        <span className="text-[10px] text-primary font-semibold">{ord.linkType}</span>
                      </td>
                      <td className="py-4 px-4">
                        <OrderStatusBadge status={ord.status} />
                      </td>
                      <td className="py-4 px-4 text-xs text-muted">
                        {formatDate(ord.dueDate)}
                      </td>
                      <td className="py-4 px-5 text-right font-bold text-fg">
                        {formatCurrency(ord.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Discovery Showcase */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="text-base font-bold text-fg">Recommended High-Authority Publishers</h3>
                <p className="text-xs text-muted">Curated for optimal search visibility and domain trust</p>
              </div>
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark"
              >
                <span>Full Directory</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {featuredMarketplaceSites.map((site) => (
                <div
                  key={site.domain}
                  className="rounded-xl border border-border bg-cream/30 p-4 transition hover:border-primary/40 hover:bg-surface"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      {site.category}
                    </span>
                    <span className="font-bold text-sm text-fg">${site.price}</span>
                  </div>
                  <h4 className="mt-2 text-sm font-bold text-fg truncate">{site.domain}</h4>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-muted font-mono">
                    <span className="rounded bg-surface px-1.5 py-0.5 border border-border font-semibold text-fg">
                      DA {site.mozDA}
                    </span>
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 font-semibold text-primary">
                      DR {site.ahrefsDR}
                    </span>
                    <span>{site.traffic} visits</span>
                  </div>
                  <Link
                    to="/marketplace"
                    className="mt-4 block w-full rounded-lg bg-surface border border-border py-1.5 text-center text-xs font-semibold text-fg hover:border-primary hover:text-primary transition"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Projects & Workflow Shortcuts */}
        <div className="space-y-6">
          {/* Active Campaigns Card */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-fg">Campaign Projects</h3>
              </div>
              <span className="text-xs font-semibold text-muted">
                {buyerCampaigns.length} Active
              </span>
            </div>

            <div className="space-y-3">
              {buyerCampaigns.map((camp) => {
                const progressPct = Math.round((camp.placedLinks / camp.targetLinks) * 100);
                return (
                  <div key={camp.id} className="rounded-xl border border-border bg-cream/30 p-3.5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-fg truncate">{camp.name}</p>
                      <span className="text-[10px] font-bold text-primary">{progressPct}%</span>
                    </div>
                    <p className="text-[11px] text-muted truncate mt-0.5">{camp.targetUrl}</p>

                    {/* Progress Bar */}
                    <div className="mt-3 h-1.5 w-full rounded-full bg-border overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-muted">
                      <span>{camp.placedLinks} links placed</span>
                      <span>Target: {camp.targetLinks}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              to="/buyer-dashboard/projects"
              className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-border bg-surface py-2 text-xs font-semibold text-fg hover:bg-cream transition"
            >
              <Plus className="h-3.5 w-3.5 text-muted" />
              <span>Create New Project</span>
            </Link>
          </div>

          {/* Wallet Summary Card */}
          <div className="rounded-2xl border border-border bg-gradient-to-br from-surface to-cream/50 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-fg">Deposit Account</span>
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>

            <div className="mt-3">
              <p className="text-xs text-muted">Total Available Liquidity</p>
              <p className="text-2xl font-black text-fg mt-0.5">
                {formatCurrency(buyerStats.walletBalance)}
              </p>
            </div>

            <div className="mt-4 rounded-xl border border-border/80 bg-surface p-3 text-xs text-muted">
              <div className="flex justify-between py-0.5">
                <span>Pending Escrow:</span>
                <span className="font-semibold text-fg">{formatCurrency(buyerStats.escrowBalance)}</span>
              </div>
              <div className="flex justify-between py-0.5 border-t border-border mt-1 pt-1">
                <span>Free Processing:</span>
                <span className="font-semibold text-primary">Active</span>
              </div>
            </div>

            <Link
              to="/buyer-dashboard/wallet"
              className="mt-4 block w-full rounded-xl bg-primary py-2 text-center text-xs font-semibold text-white shadow-xs hover:bg-primary-light transition"
            >
              Add Funds to Wallet
            </Link>
          </div>

          {/* Quick Link Tools */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
              Outreach Tools
            </h4>
            <div className="space-y-2">
              <Link
                to="/marketplace"
                className="flex items-center justify-between rounded-lg p-2.5 text-xs text-fg hover:bg-cream transition"
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="h-4 w-4 text-primary" />
                  <span className="font-medium">Guest Post Directory</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted" />
              </Link>

              <Link
                to="/link-building-services"
                className="flex items-center justify-between rounded-lg p-2.5 text-xs text-fg hover:bg-cream transition"
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="font-medium">Link Building Packages</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted" />
              </Link>

              <Link
                to="/press-release"
                className="flex items-center justify-between rounded-lg p-2.5 text-xs text-fg hover:bg-cream transition"
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span className="font-medium">Press Release Distribution</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
