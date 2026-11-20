import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { websites } from "../data/website";
import {
  findWebsiteBySlug,
  getWebsiteDetail,
  getRelatedWebsites,
} from "../utils/websiteHelpers";
import { getPublicWebsiteDetails } from "../services/websiteService";

import DetailHero from "../components/website-detail-sections/DetailHero";
import MetricsStrip from "../components/website-detail-sections/MetricsStrip";
import SectionTabs from "../components/website-detail-sections/SectionTabs";
import AboutSite from "../components/website-detail-sections/AboutSite";
import MetricsBreakdown from "../components/website-detail-sections/MetricsBreakdown";
import PublishingDetails from "../components/website-detail-sections/PublishingDetails";
import Guidelines from "../components/website-detail-sections/Guidelines";
import WebsiteFaq from "../components/website-detail-sections/WebsiteFaq";
import OrderCard from "../components/website-detail-sections/OrderCard";
import MobileOrderBar from "../components/website-detail-sections/MobileOrderBar";
import RelatedWebsites from "../components/website-detail-sections/RelatedWebsites";
import WebsiteNotFound from "../components/website-detail-sections/WebsiteNotFound";
import { Loader2 } from "lucide-react";

const WebsiteDetail = () => {
  const { slug } = useParams();

  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadSite = async () => {
      setLoading(true);
      // 1. If slug is a 24-character hexadecimal MongoDB ObjectId, call API
      if (slug && /^[0-9a-fA-F]{24}$/.test(slug)) {
        try {
          const res = await getPublicWebsiteDetails(slug);
          if (!active) return;
          const apiSite = res?.data?.website || res?.data;
          if (apiSite) {
            // Normalize backend fields for components
            const normalized = {
              ...apiSite,
              id: apiSite._id || apiSite.id,
              dr: apiSite.ahrefsDR ?? apiSite.dr ?? 0,
              da: apiSite.mozDA ?? apiSite.da ?? 0,
              as: apiSite.semrushAS ?? apiSite.as ?? 0,
              traffic: apiSite.ahrefsTraffic || apiSite.semrushTraffic || apiSite.monthlyTraffic || "—",
              days: apiSite.turnaroundDays ? `${apiSite.turnaroundDays}` : "3",
              turnaround: apiSite.turnaroundDays ? `${apiSite.turnaroundDays} Days` : "3 Days",
              maxLinks: apiSite.maxLinksAllowed ?? 2,
              linkType: apiSite.linkType || "DoFollow",
              price: apiSite.price ?? 0,
              categories: Array.isArray(apiSite.subCategories) && apiSite.subCategories.length > 0
                ? [apiSite.category, ...apiSite.subCategories].filter(Boolean)
                : apiSite.category
                ? [apiSite.category]
                : ["General"],
              backlinks: {
                followed: apiSite.followedBacklinks || "0",
                noFollowed: apiSite.noFollowedBacklinks || "0",
              },
            };
            setSite(normalized);
            setLoading(false);
            return;
          }
        } catch {
          // If API call fails or 404, fallback to local match below
        }
      }

      // 2. Check local mock dataset by slug or domain
      const localSite = findWebsiteBySlug(websites, slug);
      if (active) {
        setSite(localSite || null);
        setLoading(false);
      }
    };

    loadSite();

    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    const originalTitle = document.title;
    if (site?.domain) {
      document.title = `${site.domain} | Guest Post Details`;
    }
    return () => {
      document.title = originalTitle;
    };
  }, [site]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-cream p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mt-3 text-xs font-medium text-gray-500">Loading website details...</span>
      </div>
    );
  }

  if (!site) {
    return <WebsiteNotFound />;
  }

  const detail = getWebsiteDetail(site);
  const related = getRelatedWebsites(websites, site, 3);

  return (
    <main className="font-sans bg-cream pb-24 lg:pb-0">
      {/* Hero section */}
      <DetailHero site={site} />

      {/* Metrics strip overlapping hero */}
      <MetricsStrip site={site} />

      {/* Two-column layout */}
      <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left content (2/3) */}
          <div className="space-y-6 lg:col-span-2">
            <SectionTabs />
            <AboutSite site={site} detail={detail} />
            <MetricsBreakdown site={site} />
            <PublishingDetails site={site} detail={detail} />
            <Guidelines detail={detail} />
            <WebsiteFaq detail={detail} />
          </div>

          {/* Right sticky order card (1/3) */}
          <div className="lg:col-span-1">
            <OrderCard site={site} />
          </div>
        </div>
      </div>

      {/* Related websites section */}
      <RelatedWebsites websites={related} />

      {/* Fixed bottom order bar on mobile */}
      <MobileOrderBar site={site} />
    </main>
  );
};

export default WebsiteDetail;
