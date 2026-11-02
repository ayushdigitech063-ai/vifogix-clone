
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
      {reduceMotion ? (
        <img src="/backgound-video/hero-poster.jpg" alt="" className="h-full w-full object-cover" />
      ) : (
        <video
          ref={videoRef}
          src="\backgound-video\background-video.mp4"
          poster="heroposter"
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      )}

      {/* dark overlay so the white text stays readable on this bright clip */}
      <div className="absolute inset-0 bg-fg/65" />
    </div>
  );
};

export default VideoBackground;