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
      <HeroBanner hero={hero} />
      <StorySection story={story} />
      <ServicesSection services={services} />
      <AudienceSection audiences={audiences} />
      <ProcessSection data={process} />
      <FeatureGrid data={whyStandOut} numbered bg="bg-white" />
      <TestimonialsSection data={testimonials} tone="cream" />
      <FeatureGrid data={commitment} bg="bg-white" />
      <CtaBanner data={cta} tone="navy" />
    </main>
  );
};

export default About;
