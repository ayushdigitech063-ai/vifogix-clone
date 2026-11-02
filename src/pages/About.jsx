import HeroBanner from "../components/about-sections/HeroBanner";
import StorySection from "../components/about-sections/StorySection";
import ServicesSection from "../components/about-sections/ServicesSection";
import AudienceSection from "../components/about-sections/AudienceSection";
import ProcessSection from "../components/guestposting-sections/ProcessSection";
import FeatureGrid from "../components/guestposting-sections/FeatureGrid";
import TestimonialsSection from "../components/sheared/TestimonialsSection";
import CtaBanner from "../components/sheared/CtaBanner";

import {
  hero,
  story,
  services,
  audiences,
  process,
  whyStandOut,
  commitment,
  testimonials,
  cta,
} from "../data/about";

const About = () => {
  return (
    <main className="font-sans">
      {/* 1. HeroBanner (Navy gradient) */}
      <HeroBanner hero={hero} />

      {/* 2. StorySection (bg-white) */}
      <StorySection story={story} />

      {/* 3. ServicesSection (bg-cream) */}
      <ServicesSection services={services} />

      {/* 4. AudienceSection (bg-white) */}
      <AudienceSection audiences={audiences} />

      {/* 5. ProcessSection (bg-background / cream) */}
      <ProcessSection data={process} />

      {/* 6. FeatureGrid: whyStandOut (bg-white, numbered) */}
      <FeatureGrid data={whyStandOut} numbered bg="bg-white" />

      {/* 7. TestimonialsSection (bg-background / cream) */}
      <TestimonialsSection data={testimonials} />

      {/* 8. FeatureGrid: commitment (bg-white) */}
      <FeatureGrid data={commitment} bg="bg-white" />

      {/* 9. CtaBanner (dark/primary banner) */}
      <CtaBanner data={cta} />
    </main>
  );
};

export default About;

