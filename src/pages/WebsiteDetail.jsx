import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { websites } from "../data/website";
import {
  findWebsiteBySlug,
  getWebsiteDetail,
  getRelatedWebsites,
} from "../utils/websiteHelpers";

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

const WebsiteDetail = () => {
  const { slug } = useParams();

  const site = useMemo(() => findWebsiteBySlug(websites, slug), [slug]);
  const detail = useMemo(() => (site ? getWebsiteDetail(site) : null), [site]);
  const related = useMemo(
    () => (site ? getRelatedWebsites(websites, site, 3) : []),
    [site]
  );

  useEffect(() => {
    const originalTitle = document.title;
    if (site) {
      document.title = `${site.domain} | Guest Post Details`;
    }
    return () => {
      document.title = originalTitle;
    };
  }, [site]);

  if (!site || !detail) {
    return <WebsiteNotFound />;
  }

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

