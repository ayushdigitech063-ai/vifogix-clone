import { Construction } from "lucide-react";

const DashboardPlaceholder = ({ title = "Dashboard Section", description = "This section is coming soon." }) => {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center shadow-xs">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cream text-primary mb-4">
          <Construction className="h-7 w-7" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-bold text-fg tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted">{description}</p>
      </div>
    </div>
  );
};

export default DashboardPlaceholder;

