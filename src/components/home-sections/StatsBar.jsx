// src/components/home-sections/StatsBar.jsx
import React from "react";
import { Globe, Users, CheckCircle2, Clock } from "lucide-react";

const stats = [
  {
    icon: Globe,
    value: "127,494+",
    label: "Registered Websites",
    position: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
    accent: "text-accent-yellow",
  },
  {
    icon: Users,
    value: "10,000+",
    label: "Publishers & Writers",
    position: "top-1/2 right-0 translate-x-1/2 -translate-y-1/2",
    accent: "text-primary-light",
  },
  {
    icon: CheckCircle2,
    value: "50,000+",
    label: "Tasks Completed",
    position: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
    accent: "text-accent-yellow",
  },
  {
    icon: Clock,
    value: "24 x 7",
    label: "Dedicated Support",
    position: "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2",
    accent: "text-emerald-400",
  },
];

const StatsBar = () => {
  return (
    <div className="relative mx-auto flex w-full max-w-[340px] items-center justify-center py-10 sm:max-w-[420px] lg:max-w-[460px]">
      {/* Outer pulsing glow aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-64 w-64 rounded-full bg-primary/20 blur-3xl animate-blob motion-reduce:animate-none"
      />

      {/* Main Orbit Circle Ring */}
      <div className="relative flex h-72 w-72 items-center justify-center sm:h-84 sm:w-84 lg:h-96 lg:w-96">
        {/* Animated outer dashed ring (slow spin) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 animate-[spin_40s_linear_infinite] rounded-full border-2 border-dashed border-white/20"
        />

        {/* Animated counter-spinning gradient border ring */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-4 animate-[spin_30s_linear_infinite_reverse] rounded-full border border-primary/40"
        />

        {/* Inner pulsing circle track */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-10 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xs"
        />

        {/* Center core pulse badge */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-accent-yellow/40 bg-navy-950 shadow-lg shadow-primary/20 sm:h-20 sm:w-20">
            <span className="font-display text-lg font-black tracking-tight text-white sm:text-xl">
              100%
            </span>
          </div>
          <span className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-accent-yellow">
            Verified Network
          </span>
        </div>

        {/* 4 Stat Nodes stationed around the circle perimeter */}
        {stats.map(({ icon: Icon, value, label, position, accent }, index) => (
          <div
            key={label}
            className={`group absolute z-20 ${position} transition-all duration-300 hover:scale-105`}
          >
            <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-navy-950/90 px-3.5 py-2.5 shadow-xl backdrop-blur-md transition-all hover:border-primary/60 hover:bg-navy-900 sm:px-4 sm:py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-accent-yellow shadow-inner sm:h-10 sm:w-10">
                <Icon className="h-5 w-5" />
              </span>
              <div className="text-left">
                <p className="font-display text-sm font-extrabold tracking-tight text-white sm:text-base">
                  {value}
                </p>
                <p className="text-[10px] font-medium text-white/70 sm:text-xs">
                  {label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsBar;
