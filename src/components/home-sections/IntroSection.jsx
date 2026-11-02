
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import BannerHeading from "../sheared/BannerHeading";

const points = [
  "Earn strong backlinks from trusted websites",
  "Build brand credibility in your niche",
  "Drive targeted traffic and improve site authority",
];

const IntroSection = () => (
  <section className="bg-surface py-16 md:py-20">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-2">
      <article className="rounded-2xl border border-border bg-background p-8">
        <BannerHeading
          as="h2"
          align="left"
          maxWidth="full"
          eyebrow="Guest Posting"
          title="Access Premium Guest Posting Websites"
          highlight="Now"
          description="Boost your SEO with smart guest posting and powerful link building services. Connect with high-quality blogs through one easy-to-use marketplace."
        >
          <Link to="/link-building-services" className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-light">
            Explore Link Building Services
          </Link>
        </BannerHeading>
      </article>

      <article className="rounded-2xl border border-border bg-background p-8">
        <BannerHeading
          as="h2"
          align="left"
          maxWidth="full"
          eyebrow="Why it matters"
          title="Why Link Building is Essential for Your"
          highlight="Business"
          description="Guest writing is still a powerful SEO strategy when done correctly. Quality content on trusted websites earns links and builds credibility."
        />
        <ul className="mt-6 space-y-3">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-3 text-sm text-fg">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" /> {p}
            </li>
          ))}
        </ul>
      </article>
    </div>
  </section>
);

export default IntroSection;