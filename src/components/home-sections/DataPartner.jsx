import { partners } from "../../data/partners";

const DataPartner = ({ tone = "light", heading = "Data Integrated With:" }) => {
  const isDark = tone === "dark";

  return (
    <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-2">
      <p className={`text-sm font-semibold ${isDark ? "text-fg" : "text-white"}`}>
        {heading}
      </p>

      <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 md:gap-x-5">
        {partners.map(({ name, logo }) => (
          <li
            key={name}
            className={isDark ? "rounded-lg px-3 py-1.5" : ""}
          >
            <img
              src={logo}
              alt={name}
              title={name}
              className="h-6 w-auto object-contain md:h-7"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DataPartner;