import SectionHeading from "../sheared/SectionHeading";
import WebsiteCard from "../guestposting-sections/WebsiteCard";

const RelatedWebsites = ({ websites = [] }) => {
  if (!websites || websites.length === 0) return null;

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="Similar options"
          title="Similar websites"
          description="Explore related publisher options sharing similar niches and authority metrics."
        />

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {websites.map((site) => (
            <WebsiteCard key={site.id || site.domain} site={site} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedWebsites;
