import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import SectionHeading from "../sheared/SectionHeading";

const CheckIcon = () => (
  <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
);

const AudienceSection = ({ audiences }) => {
  const cards = [
    { ...audiences.buyers, key: "buyers" },
    { ...audiences.publishers, key: "publishers" },
  ];

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow={audiences.eyebrow}
          title={audiences.title}
          description={audiences.description}
        />

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {cards.map((card) => (
            <article
              key={card.key}
              className="flex flex-col justify-between rounded-2xl border border-border bg-white p-7 shadow-sm transition hover:shadow-md md:p-9"
            >
              <div>
                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {card.title}
                </span>

                <h3 className="mt-4 text-xl font-bold text-fg md:text-2xl">
                  {card.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-gray-500">
                  {card.text}
                </p>

                <ul className="mt-6 space-y-2.5">
                  {card.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2.5 text-sm font-medium text-fg">
                      <CheckIcon />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <Link
                  to={card.button.href}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-primary py-2.5 text-center text-sm font-semibold text-white transition hover:opacity-90 sm:w-auto sm:px-6"
                >
                  {card.button.label}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;

