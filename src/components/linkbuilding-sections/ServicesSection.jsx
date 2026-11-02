// ServicesSection.jsx
import { Link } from "react-router-dom";
import SectionHeading from "../sheared/SectionHeading";
import { services } from "../../data/linkbuilding";

const ServicesSection = () => (
  <section className="bg-surface py-16 md:py-20">
    <div className="mx-auto max-w-7xl px-4">
      <SectionHeading
        eyebrow="Our Services"
        title="Link Building Services Built Around Your SEO Goals"
        description="Choose a managed campaign or select individual placements from the marketplace."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map(({ icon: Icon, title, description, to }) => (
          <article key={title} className="flex flex-col rounded-xl border border-border bg-background p-6 transition-shadow hover:shadow-md">
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-6 w-6" />
            </span>
            <h3>{title}</h3>
            <p className="mt-2 flex-1 text-sm text-muted">{description}</p>
            <Link to={to} className="mt-4 text-sm font-semibold text-primary hover:underline">
              Get Started →
            </Link>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;