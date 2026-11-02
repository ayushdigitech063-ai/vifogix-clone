import { Link } from "react-router-dom";
import SectionHeading from "../sheared/SectionHeading";

const ServicesSection = ({ services }) => {
  return (
    <section className="bg-background py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow={services.eyebrow}
          title={services.title}
          description={services.description}
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.items.map((item) => (
            <article
              key={item.title}
              className="flex flex-col justify-between rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-md"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-base font-bold text-white shadow-sm">
                  {item.title[0]}
                </div>

                <h3 className="mt-4 text-lg font-bold text-fg">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {item.text}
                </p>
              </div>

              <div className="mt-6 border-t border-border/60 pt-4">
                <Link
                  to={item.href}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition hover:text-primary-light"
                >
                  <span>{item.cta}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
