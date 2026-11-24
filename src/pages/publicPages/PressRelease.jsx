import { useState, useEffect } from "react";
import HeroBanner from "../../components/press-release-sections/HeroBanner";
import PackageListing from "../../components/press-release-sections/PackageListing";
import IntroSection from "../../components/press-release-sections/IntroSection";
import FeatureGrid from "../../components/guestposting-sections/FeatureGrid";
import ProcessSection from "../../components/guestposting-sections/ProcessSection";
import TestimonialsSection from "../../components/sheared/TestimonialsSection";
import FaqSection from "../../components/sheared/FaqSection";
import {
  hero, packages as defaultPackages, intro, benefits, process,
  features, testimonials, faqs, contact,
} from "../../data/pressRelease";
import ContactForm from "../../components/sheared/ContactForm";
import { getPublicPressReleases } from "../../services/pressReleaseService";

const PressRelease = () => {
  const [prPackages, setPrPackages] = useState(defaultPackages);

  useEffect(() => {
    let isMounted = true;
    const fetchPublicPRs = async () => {
      try {
        const response = await getPublicPressReleases({ limit: 50 });
        const prList = response?.data?.pressReleases || response?.data || response?.pressReleases || [];
        if (isMounted && Array.isArray(prList) && prList.length > 0) {
          const mapped = prList.map((pr) => {
            const rawFeatured = Array.isArray(pr.included) && pr.included.length > 0
              ? pr.included
              : (pr.outletDomain ? [pr.outletDomain] : [pr.category || "General"]);

            const highlights = [
              pr.category,
              pr.outletsCount > 1 ? `${pr.outletsCount}+ outlets` : null,
              pr.mozDA ? `DA ${pr.mozDA}` : null,
              pr.ahrefsDR ? `DR ${pr.ahrefsDR}` : null,
              pr.estimatedReach ? `${pr.estimatedReach} Reach` : null,
              pr.maxWordsAllowed ? `${pr.maxWordsAllowed} Words` : null,
            ].filter(Boolean);

            return {
              id: pr._id || pr.id,
              slug: pr.slug || pr._id || pr.id,
              title: pr.title || "Press Release Package",
              logoDomain: pr.outletDomain || "",
              days: Number(pr.turnaroundDays) || 3,
              backlinks: pr.maxLinksAllowed ? `${pr.maxLinksAllowed} Links` : "2 Links",
              price: Number(pr.price) || 0,
              featured: rawFeatured,
              highlights: highlights.length > 0 ? highlights : ["Guaranteed Placements"],
            };
          });
          setPrPackages(mapped);
        }
      } catch {
        // Fallback to static packages
      }
    };

    fetchPublicPRs();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="font-sans">
      <HeroBanner data={hero} />
      <PackageListing packages={prPackages} />
      <IntroSection data={intro} />
      <FeatureGrid data={benefits} bg="bg-white" />
      <ProcessSection data={process} />
      <FeatureGrid data={features} bg="bg-white" />
      <TestimonialsSection data={testimonials} tone="cream" />
      <FaqSection items={faqs} tone="white" />
      <ContactForm data={contact} tone="navy-950" />
    </main>
  );
};

export default PressRelease;
