import { Link } from "react-router-dom";

const WebsiteNotFound = () => {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-cream px-4 py-16 font-sans">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cream text-primary">
          <svg
            className="h-7 w-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-fg">
          Website not found
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          The publication details you are looking for may have been removed or the link is incorrect.
        </p>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Link
            to="/marketplace"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            Browse Marketplace
          </Link>
          <Link
            to="/guest-posting-services"
            className="rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-fg transition hover:bg-gray-50"
          >
            Guest Posting
          </Link>
        </div>
      </div>
    </main>
  );
};

export default WebsiteNotFound;

