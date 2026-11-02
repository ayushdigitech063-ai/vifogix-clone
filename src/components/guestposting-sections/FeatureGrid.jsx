import SectionHeading from "../sheared/SectionHeading";

const FeatureGrid = ({ data, numbered = false, bg = "bg-white", cols = "lg:grid-cols-3" }) => (
  <section className={`${bg} py-12 md:py-16`}>
    <div className="mx-auto max-w-7xl px-4">
      <SectionHeading eyebrow={data.eyebrow} title={data.title} description={data.description} />
      <div className={`mt-10 grid gap-5 sm:grid-cols-2 ${cols}`}>
        {data.items.map((item, i) => (
          <div key={item.title} className="rounded-2xl border border-border bg-white p-6">
            {numbered && (
              <span className="text-sm font-bold text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
            )}
            <h3 className="mt-1 text-lg font-bold text-fg">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeatureGrid;