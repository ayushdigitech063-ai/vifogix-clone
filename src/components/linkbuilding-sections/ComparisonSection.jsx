
import { comparisonRows } from "../../data/linkbuilding";
import SectionHeading from "../sheared/SectionHeading";

const ComparisonSection = () => (
  <section className="bg-background py-16 md:py-20">
    <div className="mx-auto max-w-5xl px-4">
      <SectionHeading
        eyebrow="Comparison"
        title="Vefogix vs Traditional Link Building Agencies"
        description="Choose a managed campaign, or use the marketplace when you want control over individual placements."
      />
      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="bg-background">
              <th scope="col" className="px-5 py-4 font-semibold text-muted">Feature</th>
              <th scope="col" className="bg-primary px-5 py-4 font-semibold text-white">Vefogix</th>
              <th scope="col" className="px-5 py-4 font-semibold text-muted">Traditional Agency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {comparisonRows.map(({ feature, us, them }) => (
              <tr key={feature}>
                <th scope="row" className="px-5 py-4 font-medium text-fg">{feature}</th>
                <td className="bg-primary/5 px-5 py-4 font-semibold text-primary">{us}</td>
                <td className="px-5 py-4 text-muted">{them}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default ComparisonSection;