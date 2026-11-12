import { websites as defaultWebsites, defaultWebsiteDetail } from "../data/website.js";

/**
 * Derives a clean URL slug for a website entry.
 * e.g. "finance.yahoo.com" -> "finance-yahoo-com"
 */
export const getWebsiteSlug = (site) => {
  if (!site) return "";
  if (site.slug) return site.slug;
  return String(site.domain || "")
    .toLowerCase()
    .trim()
    .replace(/[.\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/^-+|-+$/g, "");
};

/**
 * Finds a website by its slug from an array of websites.
 */
export const findWebsiteBySlug = (websitesList = defaultWebsites, slug) => {
  if (!slug) return null;
  const target = String(slug).toLowerCase().trim();
  return (
    websitesList.find((w) => getWebsiteSlug(w) === target || String(w.domain).toLowerCase() === target) ||
    null
  );
};

/**
 * Merges the generic fallback detail with site-specific detail overrides.
 */
export const getWebsiteDetail = (site) => {
  if (!site) return defaultWebsiteDetail;
  const custom = site.detail || {};

  return {
    ...defaultWebsiteDetail,
    ...custom,
    guidelines: {
      ...defaultWebsiteDetail.guidelines,
      ...(custom.guidelines || {}),
      allowed: custom.guidelines?.allowed || defaultWebsiteDetail.guidelines.allowed,
      notAllowed: custom.guidelines?.notAllowed || defaultWebsiteDetail.guidelines.notAllowed,
    },
    faqs: custom.faqs || defaultWebsiteDetail.faqs,
  };
};

/**
 * Returns related websites sharing at least one category, excluding current site.
 */
export const getRelatedWebsites = (websitesList = defaultWebsites, currentSite, limit = 3) => {
  if (!currentSite || !Array.isArray(websitesList)) return [];

  const otherSites = websitesList.filter(
    (w) => w.domain !== currentSite.domain && w.id !== currentSite.id
  );

  const currentCategories = new Set(
    (currentSite.categories || (currentSite.category ? [currentSite.category] : [])).map((c) =>
      c.toLowerCase()
    )
  );

  // Partition into shared category vs others
  const sharedCategory = [];
  const others = [];

  for (const site of otherSites) {
    const siteCategories = (site.categories || (site.category ? [site.category] : [])).map((c) =>
      c.toLowerCase()
    );
    const hasOverlap = siteCategories.some((cat) => currentCategories.has(cat));
    if (hasOverlap) {
      sharedCategory.push(site);
    } else {
      others.push(site);
    }
  }

  return [...sharedCategory, ...others].slice(0, limit);
};
