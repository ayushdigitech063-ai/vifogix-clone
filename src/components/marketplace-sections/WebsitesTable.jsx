
import { useState } from "react";
import { websites } from "../../data/websites";
import WebsiteRow from "./WebsiteRow";
import Pagination from "./Pagination";
import SectionHeading from "../sheared/SectionHeading";

const PAGE_SIZE = 3; // small on purpose so you can see pagination; raise it later

const headers = [
  "Price",
  "Website",
  "Category",
  "Traffic",
  "DR | DA | AS",
  "Backlinks",
  "Domain Info",
  "No. of Deal",
];

const WebsitesTable = () =>{
     const [page, setPage] = useState(1);

  const totalPages = Math.ceil(websites.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const visible = websites.slice(start, start + PAGE_SIZE);

  return (
    <section className="bg-background pb-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 text-center">
           <SectionHeading
        eyebrow="Websites"
        title="Boost Your SEO with Trusted Guest Posts"
        description="High-quality guest posts and backlinks, no matter the package you choose"
      />
        </div>

        <h3 className="mb-4 text-xl">
          {websites.length.toLocaleString()}+ Websites &amp; Blogs That Accept Guest Posts
        </h3>

        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-primary text-white">
              <tr>
                {headers.map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visible.map((site) => (
                <WebsiteRow key={site.id} site={site} />
              ))}
            </tbody>
          </table>
        </div>

        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </section>
  );
}

export default WebsitesTable;