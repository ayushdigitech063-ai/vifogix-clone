import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import BannerHeading from "../sheared/BannerHeading";

const DashboardHeader = ({ user }) => {
  const initial = user?.initial || "P";

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex-1">
        <BannerHeading
          as="h1"
          align="left"
          maxWidth="full"
          eyebrow="Publisher workspace"
          title="Publisher dashboard"
          titleClassName="md:text-3xl"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          to="/publisher-dashboard/websites/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Website</span>
        </Link>

        <Link
          to="/publisher-dashboard/gigs/new"
          className="inline-flex items-center gap-2 rounded-lg bg-accent-yellow px-4 py-2.5 text-sm font-semibold text-fg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-yellow"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Gig</span>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;

