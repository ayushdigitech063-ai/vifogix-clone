// src/data/linkbuilding.js
import {
  Tag, Calendar, Zap, Search, Headphones, ShieldCheck,
  PenLine, Globe, Newspaper, Link2,
} from "lucide-react";

export const heroHighlights = [
  { icon: Tag, text: "Single links from $2" },
  { icon: Calendar, text: "Monthly plans from $30" },
  { icon: Zap, text: "Live placements in 24 hours" },
  { icon: Search, text: "Free SEO audit with every plan" },
];

export const heroPerks = [
  { icon: Headphones, text: "24/7 support across all time zones" },
  { icon: ShieldCheck, text: "90 day link replacement guarantee" },
];

export const reviewPlatforms = ["Trustpilot", "Clutch", "GoodFirms", "TopFirms"];

export const stats = [
  { value: "128,108+", label: "Sites Available" },
  { value: "5,000+", label: "Brands Served" },
  { value: "4.8★", label: "Customer Rating" },
  { value: "24 hrs", label: "Live Link Delivery" },
  { value: "24/7", label: "Support Available" },
  { value: "Free", label: "SEO Audit Included" },
];

export const services = [
  {
    icon: PenLine,
    title: "Guest Post Service",
    description:
      "Editorial guest posts on real, niche-relevant websites. Content writing included, and you approve the site, anchor and article before publishing.",
    to: "/guest-posting-services",
  },
  {
    icon: Globe,
    title: "White Label SEO Reseller Services",
    description:
      "Target international markets with localised links from publishers in 150+ countries. Ideal for global SEO campaigns.",
    to: "/seo-reseller-services",
  },
  {
    icon: Newspaper,
    title: "Press Release Service",
    description:
      "Distribute your story across 300+ news outlets for brand authority at scale.",
    to: "/press-release",
  },
  {
    icon: Link2,
    title: "Niche Edit Insertions",
    description:
      "Insert backlinks into existing, high-authority articles. You approve the site, anchor and placement before it goes live.",
    to: "/link-insertion",
  },
];

export const plans = [
  {
    name: "Starter",
    price: "$30",
    period: "/mo",
    audience: "New websites, bloggers",
    features: ["Free SEO audit", "24/7 support", "24 hour delivery", "White hat links only", "90 day guarantee"],
  },
  {
    name: "Growth",
    price: "$80",
    period: "/mo",
    audience: "Growing brands, startups",
    featured: true,
    features: ["Free SEO audit", "24/7 support", "24 hour delivery", "Niche relevant placements", "Indexing report"],
  },
  {
    name: "Authority",
    price: "$200",
    period: "/mo",
    audience: "Established businesses",
    features: ["Priority support", "Free SEO audit", "24 hour delivery", "Premium publisher access", "90 day guarantee"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    audience: "SEO agencies",
    features: ["White label reports", "Net 15 payment terms", "Dedicated manager", "35% reseller margin", "Client dashboard"],
  },
];

export const singleLink = {
  price: "$2",
  title: "Need an Individual Backlink?",
  description:
    "Choose a publisher from the marketplace and purchase a single placement with no monthly commitment. Pay only for that placement.",
  bulk: "Bulk discounts: 10+ links per month gets 15% off. 25+ links gets 20% off. 50+ links gets 25% off plus a dedicated account manager.",
};

export const whyChoose = [
  { title: "Relevant Publisher Selection", description: "Publishers matched to your niche, target market and campaign goals." },
  { title: "Competitor-Based Strategy", description: "We analyse competing backlink profiles to find realistic opportunities." },
  { title: "Target-Page Alignment", description: "Campaigns are planned around the pages and keywords you want to strengthen." },
  { title: "Placement Transparency", description: "Review publisher and placement details before links go live." },
  { title: "Managed Outreach", description: "We handle research, outreach, content and placement coordination." },
  { title: "Reporting & Monitoring", description: "Track published links and campaign progress through clear reports." },
];

export const comparisonRows = [
  { feature: "Total sites available", us: "128,108+", them: "Limited inventory" },
  { feature: "Pricing transparency", us: "See exact cost per site", them: "Quote based" },
  { feature: "Single link option", us: "Yes, from $2", them: "Usually package based" },
  { feature: "You pick the publishers", us: "Yes, full control", them: "Agency decides" },
  { feature: "Free SEO audit", us: "Yes, included", them: "May be charged separately" },
  { feature: "Support availability", us: "24/7 all time zones", them: "Business hours" },
  { feature: "Minimum commitment", us: "None, cancel any time", them: "Often 3 to 6 months" },
];

export const steps = [
  { title: "Share Your SEO Goals", description: "Tell us your website, target pages, keywords, niche, countries and competitors." },
  { title: "Get Your Strategy", description: "We analyse your requirements and identify suitable publishers and placements." },
  { title: "Review & Approve", description: "Review the recommended opportunities and approve the ones that fit." },
  { title: "Publish, Monitor & Report", description: "We coordinate publication and provide reporting and link monitoring." },
];

export const outsourcePoints = [
  "128,108+ pre-vetted sites for high DR link building",
  "50+ niches including casino, crypto, finance and SaaS",
  "150+ countries for geo targeted campaigns",
  "Branded white label reports for agency clients",
  "Dedicated account manager from the Agency tier",
];

export const buildOptions = [
  {
    title: "Managed Link Building",
    description:
      "Tell us what you want to rank for. Our SEO team plans and manages the campaign around your target pages, competitors, niche and budget.",
  },
  {
    title: "Self-Serve Link Building",
    description:
      "Prefer to choose publishers yourself? Browse the marketplace, filter opportunities, review placements and select individual backlinks.",
  },
];

export const benefits = [
  { title: "Buy Link Building Services That Match Your Budget", description: "Start at $2 per link or step up to full packages. No contract locks you in." },
  { title: "Buy Authority Backlinks From Vetted Publishers", description: "Placements on sites vetted for real traffic and editorial standards." },
  { title: "High DR Link Building for Competitive Niches", description: "Filter the marketplace by Domain Rating, niche and country." },
  { title: "Manual Outreach, Not Automation", description: "A real person vets the publisher, negotiates the placement and confirms it is live." },
  { title: "Affordable Without Cutting Corners", description: "Every tier meets the same white hat standard; you pay for volume, not quality." },
  { title: "Real-Time Backlink Tracking", description: "A dashboard shows live status, anchor text and target URL for every placement." },
];

// Placeholder reviews: replace with your own
export const testimonials = [
  { name: "Rachel", date: "23rd Feb 2026", text: "Sample review text about ranking improvements after a few months of steady link building." },
  { name: "Anna", date: "17th Feb 2026", text: "Sample review text about lower cost per link compared with doing outreach in-house." },
  { name: "Chris", date: "28th Feb 2026", text: "Sample review text from an agency owner who white-labels the service for clients." },
  { name: "James", date: "3rd Mar 2026", text: "Sample review text praising the quality of the publisher vetting." },
  { name: "Lin", date: "1st Mar 2026", text: "Sample review text about receiving a sample report before paying." },
  { name: "Tariq", date: "6th Feb 2026", text: "Sample review text from a consultant managing clients across several industries." },
];

export const countries = [
  { name: "United States", code: "us" }, { name: "United Kingdom", code: "gb" },
  { name: "India", code: "in" }, { name: "Canada", code: "ca" },
  { name: "Australia", code: "au" }, { name: "Germany", code: "de" },
  { name: "France", code: "fr" }, { name: "Spain", code: "es" },
  { name: "Italy", code: "it" }, { name: "Brazil", code: "br" },
  { name: "Mexico", code: "mx" }, { name: "Japan", code: "jp" },
  { name: "Singapore", code: "sg" }, { name: "UAE", code: "ae" },
  { name: "South Africa", code: "za" }, { name: "Netherlands", code: "nl" },
];

export const faqs = [
  { q: "What are link building services?", a: "They help you acquire high-quality backlinks from authoritative websites to improve rankings and domain authority." },
  { q: "Why is link building important for SEO?", a: "Quality links from relevant, authoritative sites signal trust to search engines and can improve your position in results." },
  { q: "Can I choose the websites where my backlinks are placed?", a: "Yes. The marketplace lets you browse and filter publishers by niche, DR, traffic and more." },
  { q: "What types of backlinks do you offer?", a: "Guest posts, niche edits, press releases and white-label packages for different budgets." },
  { q: "Are your link building services safe?", a: "Every link is white hat, editorially placed and compliant with Google's webmaster guidelines." },
  { q: "How do I track my backlinks?", a: "A live dashboard tracks every placement with URL, anchor text, DR and traffic data." },
];

export const companySizes = ["1-49", "50-99", "100-249", "250-999", "1000+"];

export const buyerGoals = [
  "Grow backlink profile for my company/site",
  "Reach higher SERP positions",
  "Build links for clients",
  "Grow brand awareness",
  "Get more pages indexed",
  "Other",
];