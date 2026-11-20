import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { getWebsiteSlug } from "../../utils/websiteHelpers";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { useWishlist } from "../../hooks/useWishlist";
import { toggleWishlist } from "../../services/wishlistService";

const Metric = ({ value, label }) => (
  <div className="flex-1 rounded-lg bg-cream py-2 text-center">
    <div className="text-lg font-bold text-fg">
      {value !== null && value !== undefined && value !== "" ? value : "—"}
    </div>
    <div className="text-[11px] text-gray-500">{label}</div>
  </div>
);

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="font-semibold text-fg">{value}</span>
  </div>
);

const WebsiteCard = ({ site, isWishlisted = false, onWishlistToggle }) => {
  const { isAuthenticated, user } = useAuth();
  const toast = useToast();
  const { toggleItem } = useWishlist();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(isWishlisted);
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
      setLiked((prev) => !prev);
      return;
    }

    setToggling(true);
    try {
      const res = toggleItem ? await toggleItem(websiteId) : await toggleWishlist(websiteId);
      const isNowWishlisted = res?.data?.isWishlisted ?? !liked;
      setLiked(isNowWishlisted);
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

  // Categories & Subcategories
  const categoriesList = Array.isArray(site.subCategories) && site.subCategories.length > 0
    ? [site.category, ...site.subCategories].filter(Boolean)
    : Array.isArray(site.categories)
    ? site.categories
    : [site.category || "General"];

  // Country with "+X Others"
  let countryDisplay = site.country || "Global";
  if (site.otherCountriesCount && Number(site.otherCountriesCount) > 0) {
    countryDisplay = `${site.country} +${site.otherCountriesCount} Others`;
  }

  // Authority Metrics
  const dr = site.ahrefsDR ?? site.dr ?? "—";
  const da = site.mozDA ?? site.da ?? "—";
  const as = site.semrushAS ?? site.as ?? "—";

  // Traffic
  const trafficDisplay = site.ahrefsTraffic || site.traffic?.ahrefs || site.traffic || site.monthlyTraffic || "—";

  // Backlinks
  let backlinksDisplay = "—";
  if (site.followedBacklinks || site.noFollowedBacklinks) {
    backlinksDisplay = `${site.followedBacklinks || 0}/${site.noFollowedBacklinks || 0}`;
  } else if (site.backlinks?.followed || site.backlinks?.noFollowed) {
    backlinksDisplay = `${site.backlinks.followed || 0}/${site.backlinks.noFollowed || 0}`;
  } else if (typeof site.backlinks === "string") {
    backlinksDisplay = site.backlinks;
  }

  // Links & Type
  const maxLinks = site.maxLinksAllowed ?? site.maxLinks ?? 2;
  const linkType = site.linkType || "DoFollow";

  // Turnaround days
  const days = site.turnaroundDays ?? site.days ?? (parseInt(site.turnaround, 10) || 3);

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-xs transition hover:shadow-md">
      <div className="bg-primary/5 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {categoriesList.slice(0, 3).map((c) => (
              <span key={c} className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-primary shadow-2xs">
                {c}
              </span>
            ))}
            {categoriesList.length > 3 && (
              <span className="rounded-full bg-white px-2 py-1 text-[10px] font-medium text-muted">
                +{categoriesList.length - 3}
              </span>
            )}
          </div>
          <button
            onClick={handleToggleWishlist}
            disabled={toggling}
            aria-label={liked ? "Remove from wishlist" : "Save website"}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-gray-500 hover:text-accent-red transition-colors disabled:opacity-50"
          >
            <Heart
              className={`h-4 w-4 ${liked ? "fill-accent-red text-accent-red" : "text-gray-500"}`}
              aria-hidden="true"
            />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <img
            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
            alt="website icon"
            title={domain}
            width="40"
            height="40"
            className="rounded-lg bg-white p-1"
          />
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-fg">
              <Link
                to={`/website/${getWebsiteSlug(site)}`}
                className="transition hover:text-primary"
              >
                {domain}
              </Link>
            </h3>
            <p className="text-xs text-gray-500">{countryDisplay}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="flex gap-2">
          <Metric value={dr} label="DR" />
          <Metric value={da} label="DA" />
          <Metric value={as} label="AS" />
        </div>

        <div className="space-y-2">
          <Row label="Traffic (Ahrefs)" value={trafficDisplay} />
          <Row label="Backlinks" value={backlinksDisplay} />
          <Row label="Links" value={`${maxLinks} ${linkType} ${maxLinks === 1 ? "Link" : "Links"}`} />
        </div>

        <div className="flex items-center justify-between rounded-xl bg-primary-50 p-3">
          <span className="text-sm font-semibold text-fg">{days} Days</span>
          <div className="text-right">
            <p className="flex items-center justify-end gap-1 text-[11px] text-gray-500">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-yellow" />
              Starting at
            </p>
            <p className="text-xl font-extrabold text-fg">${price}</p>
          </div>
        </div>

        <a
          href="/signup"
          className="block rounded-lg bg-primary py-2 text-center text-sm font-semibold text-white transition hover:bg-primary-light"
        >
          Buy now
        </a>
      </div>
    </article>
  );
};

export default WebsiteCard;
