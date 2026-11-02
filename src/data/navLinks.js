export const navLinks = [
  { label: "Marketplace", href: "/marketplace" },
  { label: "Link Building", href: "/link-building-services" },
  { label: "Guest Posting", href: "/guest-posting-services" },
  { label: "Press Release", href: "/press-release" },
  {
    label: "Resources",
    children: [
      { label: "Blogs", href: "/blogs", description: "Guides and SEO tips" },
      { label: "About us", href: "/about-us", description: "Who we are" },
      { label: "FAQs", href: "/faqs", description: "Answers to common questions" },
      { label: "Contact us", href: "/contact-us", description: "Get in touch" },
    ],
  },
];

export const authLinks = {
  signIn: { label: "Sign In", href: "/signin" },
  signUp: { label: "Sign Up", href: "/signup" },
  dashboard: { label: "Dashboard", href: "/dashboard" },
};