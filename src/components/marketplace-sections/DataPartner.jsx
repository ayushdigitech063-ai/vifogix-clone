
const partners = ["WRanker", "Semrush", "Majestic", "Google Analytics", "Ahrefs", "Moz"];
const DataPartner = () =>{
     return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-6 md:flex-row md:justify-between">
        <p className="text-sm font-medium text-muted">Data Integrated With :</p>
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {partners.map((name) => (
            <li
              key={name}
              className="text-base font-semibold text-muted/80 transition-colors hover:text-primary"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
export default DataPartner;