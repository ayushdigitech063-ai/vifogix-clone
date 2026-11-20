
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Clock, TrendingUp, Link2, Layers } from "lucide-react";
import { getWebsiteSlug } from "../../utils/websiteHelpers";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { useWishlist } from "../../hooks/useWishlist";
import { toggleWishlist } from "../../services/wishlistService";

const Metric = ({ label, value }) => (
  <div className="rounded-lg bg-cream px-3 py-2 text-center">
    <p className="text-lg font-bold text-fg">{value !== null && value !== undefined && value !== "" ? value : "—"}</p>
    <p className="text-xs text-muted">{label}</p>
  </div>
);

const Stat = ({ icon: Icon, label, value }) => (
  <li className="flex items-center justify-between gap-3">
    <span className="flex items-center gap-2">
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </span>
    <span className="font-semibold text-fg">{value}</span>
  </li>
);

const WebsiteCard = ({ site, isWishlisted = false, onWishlistToggle }) => {
  const { isAuthenticated, user } = useAuth();
  const toast = useToast();
  const { toggleItem } = useWishlist();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(isWishlisted);
  const [toggling, setToggling] = useState(false);

  const websiteId = site._id || site.id;

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info("Please sign in as a buyer to save websites to your wishlist.", "Authentication Required");
      navigate("/signin");
      return;
    }

    if (user?.role?.toUpperCase() === "SELLER") {
      toast.error("Wishlist is available for buyer accounts.", "Action Not Allowed");
      return;
    }

    if (!websiteId || !/^[0-9a-fA-F]{24}$/.test(websiteId)) {
      setSaved((prev) => !prev);
      return;
    }

    setToggling(true);
    try {
      const res = toggleItem ? await toggleItem(websiteId) : await toggleWishlist(websiteId);
      const isNowWishlisted = res?.data?.isWishlisted ?? !saved;
      setSaved(isNowWishlisted);
      if (onWishlistToggle) {
        onWishlistToggle(websiteId, isNowWishlisted);
      }
      if (isNowWishlisted) {
        toast.success(res?.message || `${domain || "Website"} added to your wishlist!`, "Wishlist Updated");
      } else {
        toast.info(res?.message || `${domain || "Website"} removed from your wishlist.`, "Wishlist Updated");
      }
    } catch (err) {
      toast.error(err.message || "Failed to update wishlist.", "Wishlist Error");
    } finally {
      setToggling(false);
    }
  };

  // Normalize API and mock fields safely
  const domain = site.domain || "";
  const price = site.price ?? 0;
  const category = site.category || "General";
  const subCategories = Array.isArray(site.subCategories) ? site.subCategories : [];

  // Country with "+X Others"
  let countryDisplay = site.country || "Global";
  if (site.otherCountriesCount && Number(site.otherCountriesCount) > 0) {
    countryDisplay = `${site.country} +${site.otherCountriesCount} Others`;
  }

  // SEO Metrics
  const dr = site.ahrefsDR ?? site.dr ?? "—";
  const da = site.mozDA ?? site.da ?? "—";
  const as = site.semrushAS ?? site.as ?? "—";

  // Traffic
  const ahrefsTraffic = site.ahrefsTraffic || site.traffic?.ahrefs || site.monthlyTraffic || "—";
  const semrushTraffic = site.semrushTraffic || site.traffic?.semrush || "—";

  // Backlinks
  let backlinksDisplay = "—";
  if (site.followedBacklinks || site.noFollowedBacklinks) {
    backlinksDisplay = `${site.followedBacklinks || 0}/${site.noFollowedBacklinks || 0}`;
  } else if (site.backlinks?.followed || site.backlinks?.noFollowed) {
    backlinksDisplay = `${site.backlinks.followed || 0}/${site.backlinks.noFollowed || 0}`;
  }

  // Links allowed & Link type
  const maxLinksAllowed = site.maxLinksAllowed ?? site.maxLinks ?? 2;
  const linkType = site.linkType || "DoFollow";
  const linksDisplay = typeof site.maxLinks === "string" ? site.maxLinks : `${maxLinksAllowed} ${linkType} ${maxLinksAllowed === 1 ? "Link" : "Links"}`;

  // Turnaround days
  const turnaround = typeof site.turnaround === "string" 
    ? site.turnaround 
    : site.turnaroundDays 
    ? `${site.turnaroundDays} Days` 
    : "3 Days";

  // Total Deals
  const deals = site.totalDeals ?? site.deals ?? 0;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-lg">
      {/* Header */}
      <div className="relative bg-primary/5 p-5 pt-14">
        <div className="absolute left-4 top-4 flex max-w-[70%] flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary">
            {category}
          </span>
          {subCategories.slice(0, 2).map((sub) => (
            <span
              key={sub}
              className="hidden truncate rounded-full bg-cream px-2 py-0.5 text-[10px] font-medium text-muted sm:inline-block"
              title={sub}
            >
              {sub}
            </span>
          ))}
          {subCategories.length > 2 && (
            <span className="text-[10px] font-medium text-muted">
              +{subCategories.length - 2}
            </span>
          )}
        </div>

        <button
          onClick={handleToggleWishlist}
          disabled={toggling}
          aria-pressed={saved}
          aria-label={saved ? "Remove from saved" : "Save website"}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-surface text-muted hover:text-accent-red transition-colors disabled:opacity-50"
        >
          <Heart className={`h-4 w-4 ${saved ? "fill-accent-red text-accent-red" : ""}`} />
        </button>

        <div className="flex items-center gap-3">
          <img
            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
            alt="website icon"
            title={domain}
            className="h-10 w-10 rounded-lg bg-surface p-1"
          />
          <div className="min-w-0">
            <Link
              to={`/website/${getWebsiteSlug(site)}`}
              className="block truncate font-semibold text-fg hover:text-primary transition"
            >
              {domain}
            </Link>
            <p className="truncate text-xs text-muted">{countryDisplay}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="grid grid-cols-3 gap-2">
          <Metric label="DR" value={dr} />
          <Metric label="DA" value={da} />
          <Metric label="AS" value={as} />
        </div>  

        <ul className="space-y-2 text-sm text-muted">
          <Stat icon={TrendingUp} label="Traffic (Ahrefs)" value={ahrefsTraffic} />
          <Stat icon={TrendingUp} label="Traffic (Semrush)" value={semrushTraffic} />
          <Stat icon={Link2} label="Backlinks" value={backlinksDisplay} />
          <Stat icon={Layers} label="Links" value={linksDisplay} />
        </ul>

        <div className="mt-auto flex items-center justify-between rounded-xl bg-primary-50 px-4 py-3">
          <span className="flex items-center gap-2 text-sm text-fg">
            <Clock className="h-4 w-4 text-muted" />
            {turnaround}
          </span>
          <span className="text-right">
            <span className="flex items-center justify-end gap-1.5 text-xs text-muted">
              <span className="h-2 w-2 rounded-full bg-accent-yellow" />
              Starting at
            </span>
            <span className="text-xl font-bold text-fg">${price}</span>
          </span>
        </div>

        <button className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-light">
          Buy now · {deals} deals
        </button>
      </div>
    </article>
  );
};

export default WebsiteCard;