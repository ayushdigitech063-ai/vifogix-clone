// src/components/home-sections/PopularServices.jsx
import { Link } from "react-router-dom";
import BannerHeading from "../sheared/BannerHeading";
import { popularServices } from "../../data/home";

const PopularServices = () => (
  <section className="bg-surface py-16 md:py-20">
    <div className="mx-auto max-w-7xl px-4">
      <BannerHeading
        eyebrow="Popular Service"
        title="Services People Buy"
        highlight="Most"
        description="Pick a service and start building authority today."
        className="mb-12"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {popularServices.map(({ icon: Icon, title, description, to }) => (
          <article key={title} className="flex flex-col rounded-xl border border-border bg-background p-6 transition-shadow hover:shadow-md">
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-6 w-6" />
            </span>
            <h3>{title}</h3>
            <p className="mt-2 flex-1 text-sm text-muted">{description}</p>
            <Link to={to} className="mt-4 text-sm font-semibold text-primary hover:underline">Explore →</Link>
          </article>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-primary/5 p-8 md:flex-row md:items-center">
        <div>
          <h3 className="text-xl">Manage every order from one dashboard</h3>
          <p className="mt-1 text-sm text-muted">Track placements, reports and payments in one place.</p>
        </div>
        <Link to="/signin" className="rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-light">
          Dashboard
        </Link>
      </div>
    </div>
  </section>
);

export default PopularServices;