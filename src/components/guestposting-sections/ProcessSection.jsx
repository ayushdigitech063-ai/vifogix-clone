import SectionHeading from "../sheared/SectionHeading";

const ProcessSection = ({ data }) => (
  <section className="bg-cream py-12 md:py-16">
    <div className="mx-auto max-w-7xl px-4">
      <SectionHeading title={data.title} description={data.description} />
      <ol className="mt-10 grid gap-6 md:grid-cols-5">
        {data.steps.map((s, i) => (
          <li key={s.title} className="rounded-2xl border border-border bg-white p-5">
            <span className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${(i + 1) % 2 === 0 ? "bg-accent-yellow text-navy-900" : "bg-primary text-white"}`}>
              {i + 1}
            </span>
            <h3 className="mt-4 text-base font-bold text-fg">{s.title}</h3>
            <p className="mt-2 text-sm text-gray-500">{s.text}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default ProcessSection;