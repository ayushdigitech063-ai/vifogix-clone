import { useEffect, useState } from "react";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "metrics", label: "Metrics" },
  { id: "publishing", label: "Publishing" },
  { id: "guidelines", label: "Guidelines" },
  { id: "faq", label: "FAQ" },
];

const SectionTabs = () => {
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 160;

      for (let i = TABS.length - 1; i >= 0; i--) {
        const section = document.getElementById(TABS[i].id);
        if (section && section.offsetTop <= scrollPos) {
          setActiveTab(TABS[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      aria-label="Section navigation"
      className="sticky top-20 z-30 mb-6 overflow-hidden rounded-xl border border-border bg-white/95 p-1.5 shadow-sm backdrop-blur"
    >
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <a
              key={tab.id}
              href={`#${tab.id}`}
              onClick={scrollTo(tab.id)}
              aria-current={isActive ? "page" : undefined}
              className={`shrink-0 rounded-lg px-4 py-2 text-xs font-semibold transition ${
                isActive
                  ? "bg-primary text-white shadow-xs"
                  : "text-gray-600 hover:bg-cream hover:text-fg"
              }`}
            >
              {tab.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
};

export default SectionTabs;

