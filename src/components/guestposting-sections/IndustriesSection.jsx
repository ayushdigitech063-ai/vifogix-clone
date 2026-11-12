import SectionHeading from "../sheared/SectionHeading";

const IndustriesSection = ({ data }) => (
  <section className="bg-white py-12 md:py-16">
    <div className="mx-auto max-w-5xl px-4">
      <SectionHeading title={data.title} description={data.description} />
      <ul className="mt-8 flex flex-wrap justify-center gap-3">
        {data.items.map((name) => (
          <li
            key={name}
            className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-primary-light hover:text-primary"
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default IndustriesSection;