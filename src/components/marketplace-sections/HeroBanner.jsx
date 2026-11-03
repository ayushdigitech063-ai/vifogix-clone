import { Link } from "react-router-dom";
import BannerHeading from "../sheared/BannerHeading";

const HeroBanner = () => {
  return (
    <section className="relative flex min-h-[560px] items-center overflow-hidden border-b border-border bg-navy-900 text-white">
      {/* Background Image */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://static0.makeuseofimages.com/wordpress/wp-content/uploads/2022/08/Photo-of-Woman-Writing-on-Tablet-Computer-While-Using-Laptop.jpg')",
        }}
      />

      {/* Dark overlay matching HeroSearch */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-navy-900/75" />

      {/* Animated drifting color blobs matching HeroSearch */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary-light/25 blur-3xl animate-blob motion-reduce:animate-none"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-accent-yellow/25 blur-3xl animate-blob [animation-delay:3s] motion-reduce:animate-none"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-primary/15 blur-3xl animate-blob [animation-delay:6s] motion-reduce:animate-none"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-4 py-14 text-center md:py-24">
    
        <BannerHeading
          as="h1"
          align="center"
          maxWidth="2xl"
          tone="dark"
          title={
            <>
              Explore all
              <span className="mt-2 block text-accent-yellow">
                freelance gigs in one place
              </span>
            </>
          }
          titleClassName="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
        />
      </div>
    </section>
  );
};

export default HeroBanner;
