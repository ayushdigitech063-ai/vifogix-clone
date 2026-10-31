// src/data/home.js
import {
  PenLine, Link2, Newspaper, FileText,
  Layers, ArrowLeftRight, Rocket, Wallet,
} from "lucide-react";

export const popularServices = [
  { icon: PenLine, title: "Guest Posting", description: "Editorial posts on relevant sites, with content written for you.", to: "/guest-posting-services" },
  { icon: Link2, title: "Link Insertion", description: "Add a link to an existing high-authority article.", to: "/link-insertion" },
  { icon: Newspaper, title: "Press Release", description: "Distribute your news across trusted media outlets.", to: "/marketplace" },
  { icon: FileText, title: "Content Marketing", description: "SEO-focused articles and content that earn links naturally.", to: "/content-marketing-services" },
];

export const featuredOn = [
  "AP News", "Digital Journal", "APSense", "Big News Network", "Business Insider",
  "US Times Now", "USA Today", "Yahoo News", "The Mercury News", "Global NewsWire", "Chicago Tribune",
];

// placeholder packages
export const packages = [
  { name: "Starter Guest Posts", price: "$49", note: "one-time", features: ["2 guest posts", "DR 30+ websites", "Content writing included", "Delivery in 7 days"] },
  { name: "Authority Pack", price: "$149", note: "one-time", featured: true, features: ["5 guest posts", "DR 50+ websites", "Dofollow links", "Indexing report"] },
  { name: "Press Release Pack", price: "$199", note: "one-time", features: ["Distribution on 100+ news sites", "Professionally written release", "Publication report", "Delivery in 5 days"] },
];

export const processSteps = [
  { title: "Discover Websites", description: "Browse the marketplace and filter sites by DR, traffic and niche." },
  { title: "Select Your Match", description: "Pick the site that fits your content and audience." },
  { title: "Customize Your Order", description: "Add your own content or request a custom article from our team." },
  { title: "Finalize and Track", description: "Complete the order and follow publication updates." },
];

export const whyChooseUs = [
  { title: "High-Quality Content", description: "Writers and marketers who match your brand voice and goals." },
  { title: "White-Hat Backlink Strategies", description: "Ethical links that follow search engine guidelines." },
  { title: "Private Label Services", description: "Resell guest posting and link building under your own brand." },
  { title: "Comprehensive Reporting", description: "Referral traffic, engagement and SEO impact for every campaign." },
  { title: "Customised Approach", description: "Strategies built around the sites that fit your brand best." },
  { title: "SEO Optimization", description: "Every post follows SEO best practice for Google." },
  { title: "Customer Support", description: "A support team for questions, updates and order issues." },
  { title: "Backlink Monitor", description: "We watch link status and quality so your links stay live." },
  { title: "SEO Audit by Wranker", description: "A detailed audit of technical issues, content, speed and indexing." },
];

export const flexibleServices = [
  { icon: Layers, title: "Diverse Network of High-Quality Websites", description: "Only sites that meet strict quality standards and fit your field are listed." },
  { icon: ArrowLeftRight, title: "Flexible Solutions for Buying and Selling", description: "Buy guest posts to grow your traffic, or sell them to earn from your blog." },
  { icon: Rocket, title: "Efficient and Scalable Outreach", description: "Skip the manual outreach and connect with trusted websites faster." },
  { icon: Wallet, title: "Affordable Paid Guest Posting", description: "Fair prices for a wide range of budgets, without giving up quality." },
];

// placeholder posts
export const featuredBlogs = [
  { title: "How Guest Posting Builds Real SEO Authority", excerpt: "What makes a guest post valuable, and how to choose the right sites.", category: "Guest Posting", date: "12 Oct 2026", to: "/blogs" },
  { title: "Link Building Mistakes That Hurt Rankings", excerpt: "Common errors and how to avoid them with a white-hat approach.", category: "Link Building", date: "02 Oct 2026", to: "/blogs" },
  { title: "A Publisher's Guide to Selling Guest Posts", excerpt: "How to price, list and manage guest post orders on your site.", category: "Publishers", date: "24 Sep 2026", to: "/blogs" },
];

export const homeFaqs = [
  { q: "What is guest posting in marketing?", a: "Publishing content on another website to reach a wider audience, earn backlinks and build authority." },
  { q: "Does guest blogging still work?", a: "Yes, when the content is useful and the sites are relevant and trustworthy." },
  { q: "How much does a guest post cost?", a: "It depends on the site's authority, niche and traffic. Prices range from a few dollars to several hundred." },
  { q: "What is link insertion?", a: "Adding your link to an existing article on a relevant site, instead of publishing a new post." },
  { q: "Can I earn money from guest posting?", a: "Yes. Website owners can list their sites and sell guest post placements to buyers." },
  { q: "How do I find websites that accept guest posts?", a: "Use the marketplace and filter by category, DR, traffic and price." },
];