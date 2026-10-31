import BannerHeading from "../sheared/BannerHeading";
import { processSteps } from "../../data/home";

const ProcessSteps = () => (
  <section className="bg-background py-16 md:py-20">
    <div className="mx-auto max-w-7xl px-4">
      <BannerHeading
        eyebrow="How it works"
        title="Four Simple Steps From Search to"
        highlight="Published Link"
        className="mb-14"
      />
      <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* dashed connector, desktop only */}
        <span aria-hidden="true" className="absolute left-[12%] right-[12%] top-6 hidden border-t-2 border-dashed border-border lg:block" />
        {processSteps.map(({ title, description }, i) => (
          <li key={title} className="relative text-center">
            <span className="relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white ring-8 ring-background">
              {i + 1}
            </span>
            <h3 className="mt-5">{title}</h3>
            <p className="mt-2 text-sm text-muted">{description}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default ProcessSteps;