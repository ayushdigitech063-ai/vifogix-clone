
import { useEffect, useRef, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const VideoBackground = () => {
  const videoRef = useRef(null);
  const [reduceMotion] = useState(prefersReducedMotion);

  // slightly slower playback: calmer look, and the 6s loop repeats less often
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.75;
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {(
        <img src="/backgound-video/hero-poster.jpg" alt="hero-background" title="hero-background" className="h-full w-full object-cover" />
      )}

      {/* dark overlay so the white text stays readable on this bright clip */}
      <div className="absolute inset-0 bg-navy-900/75" />
    </div>
  );
};

export default VideoBackground;