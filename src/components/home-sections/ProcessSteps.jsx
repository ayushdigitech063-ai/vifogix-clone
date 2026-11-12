import BannerHeading from "../sheared/BannerHeading";
import { processSteps } from "../../data/home";

const ProcessSteps = () => (
  <section className="bg-white py-16 md:py-20">
    <div className="mx-auto max-w-7xl px-4">
      <BannerHeading
        eyebrow="How it works"
        title="Four Simple Steps From Search to"
        highlight="Published Link"
        className="mb-14"
      />
      <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* dashed connector, desktop only */}
        <span aria-hidden="true" className="absolute left-[12%] right-[12%] top-6 hidden border-t-2 border-dashed border-primary/30 lg:block" />
        {processSteps.map(({ title, description }, i) => {
          const isEven = (i + 1) % 2 === 0;
          return (
          <li key={title} className="relative text-center">
            <span className={`relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
              isEven ? "bg-accent-yellow text-navy-900" : "bg-primary text-white"
            } text-lg font-bold ring-8 ring-white`}>
              {i + 1}
            </span>
            <h3 className="mt-5">{title}</h3>
            <p className="mt-2 text-sm text-muted">{description}</p>
          </li>
        );})}
      </ol>
    </div>
  </section>
);

export default ProcessSteps;