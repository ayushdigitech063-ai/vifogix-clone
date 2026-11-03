import React, { useState, useEffect, useRef } from "react";
import { ExternalLink, Gauge, ShieldCheck, Sparkles, CheckCircle2, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { lighthouseWebsites } from "../../data/lighthousewebsite";

const LightHouseWebsites = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [visibleItems, setVisibleItems] = useState(3);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Responsive items count per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleItems(1);
      } else if (window.innerWidth < 1024) {
        setVisibleItems(2);
      } else {
        setVisibleItems(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, lighthouseWebsites.length - visibleItems);

  // Auto sliding timer
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3500);

    return () => clearInterval(interval);
  }, [isPlaying, maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 60) {
      handleNext();
    }
    if (touchStartX.current - touchEndX.current < -60) {
      handlePrev();
    }
  };

  return (
    <section className="py-16 md:py-24 bg-cream/50 relative overflow-hidden border-b border-border">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent-yellow/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Portfolio Performance
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-fg tracking-tight mb-3">
              High-Performance Websites Engineered by Us
            </h2>
            <p className="text-muted text-base">
              Every platform we build is optimized to achieve near-perfect Google Lighthouse scores across performance, accessibility, best practices, and SEO.
            </p>
          </div>

          {/* Slider Controls */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-full border border-border bg-white text-muted hover:text-fg hover:border-primary/40 transition-colors shadow-xs"
              title={isPlaying ? "Pause auto-scroll" : "Play auto-scroll"}
              aria-label={isPlaying ? "Pause auto-scroll" : "Play auto-scroll"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-full border border-border bg-white text-muted hover:text-fg hover:border-primary/40 hover:bg-cream transition-colors shadow-xs"
                title="Previous website"
                aria-label="Previous website"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-full border border-border bg-white text-muted hover:text-fg hover:border-primary/40 hover:bg-cream transition-colors shadow-xs"
                title="Next website"
                aria-label="Next website"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Viewport */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out gap-6"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleItems + (visibleItems > 1 ? 24 / visibleItems : 0))}%)`,
            }}
          >
            {lighthouseWebsites.map((site) => (
              <div
                key={site.id}
                className="flex-shrink-0 group bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                style={{
                  width:
                    visibleItems === 1
                      ? "100%"
                      : visibleItems === 2
                      ? "calc(50% - 12px)"
                      : "calc(33.333% - 16px)",
                }}
              >
                <div>
                  {/* Thumbnail Preview with Score Badge */}
                  <div className="relative h-48 w-full overflow-hidden bg-muted/10">
                    <img
                      src={site.image}
                      alt={site.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                    {/* Overall Score Badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-emerald-600/95 backdrop-blur-md text-white font-bold px-3 py-1.5 rounded-full shadow-lg border border-emerald-400/30 text-xs">
                      <Gauge className="w-3.5 h-3.5" />
                      <span>Lighthouse {site.score}/100</span>
                    </div>

                    {/* Category Pill */}
                    <div className="absolute bottom-3 left-3">
                      <span className="text-xs font-medium text-white/90 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20">
                        {site.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-bold text-fg group-hover:text-primary transition-colors">
                        {site.title}
                      </h3>
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted hover:text-primary p-1 transition-colors"
                        title={`Visit ${site.domain}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    <p className="text-xs font-mono text-primary font-medium mb-3">
                      {site.domain}
                    </p>

                    <p className="text-xs sm:text-sm text-muted line-clamp-2 mb-4 leading-relaxed">
                      {site.description}
                    </p>

                    {/* Lighthouse Metric Breakdown Pills */}
                    <div className="grid grid-cols-4 gap-2 mb-4 pt-3 border-t border-border/60">
                      <div className="flex flex-col items-center p-1.5 rounded-lg bg-emerald-50/70 border border-emerald-100">
                        <span className="text-[10px] text-emerald-800 font-medium">Perf</span>
                        <span className="text-xs font-bold text-emerald-700">{site.metrics.performance}</span>
                      </div>
                      <div className="flex flex-col items-center p-1.5 rounded-lg bg-emerald-50/70 border border-emerald-100">
                        <span className="text-[10px] text-emerald-800 font-medium">A11y</span>
                        <span className="text-xs font-bold text-emerald-700">{site.metrics.accessibility}</span>
                      </div>
                      <div className="flex flex-col items-center p-1.5 rounded-lg bg-emerald-50/70 border border-emerald-100">
                        <span className="text-[10px] text-emerald-800 font-medium">Best P.</span>
                        <span className="text-xs font-bold text-emerald-700">{site.metrics.bestPractices}</span>
                      </div>
                      <div className="flex flex-col items-center p-1.5 rounded-lg bg-emerald-50/70 border border-emerald-100">
                        <span className="text-[10px] text-emerald-800 font-medium">SEO</span>
                        <span className="text-xs font-bold text-emerald-700">{site.metrics.seo}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {site.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-medium text-fg/70 bg-gray-100 px-2 py-0.5 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-5 sm:px-6 py-3 bg-gray-50/80 border-t border-border flex items-center justify-between text-xs text-muted">
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Core Web Vitals Passed
                  </span>
                  <span className="inline-flex items-center gap-1 font-medium text-fg">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicator Dots */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx
                  ? "w-8 bg-primary"
                  : "w-2 bg-border hover:bg-primary/40"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LightHouseWebsites;
