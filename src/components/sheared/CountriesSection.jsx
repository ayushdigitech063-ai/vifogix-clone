// CountriesSection.jsx
import { Link } from "react-router-dom";
import SectionHeading from "./SectionHeading";
import { countries } from "../../data/linkbuilding";

const CountriesSection = () => (
  <section className="bg-surface py-16 md:py-20">
    <div className="mx-auto max-w-7xl px-4">
      <SectionHeading
        eyebrow="Countries"
        title="Explore Link Building Opportunities in Your Target Market"
        description="Need a specific publisher, country, niche or individual backlink? Use the marketplace alongside our managed services."
      />
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {countries.map(({ name, code }) => (
          <li key={code}>
            <Link
              to={`/marketplace?country=${code}`}
              className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-fg hover:border-primary-light hover:text-primary"
            >
              <img
                src={`https://flagcdn.com/w40/${code}.png`}
                alt=""
                loading="lazy"
                className="h-4 w-6 rounded-sm object-cover"
              />
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default CountriesSection;