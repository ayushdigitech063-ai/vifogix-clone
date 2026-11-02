import HeroBanner from "../components/press-release-sections/HeroBanner";
import PackageListing from "../components/press-release-sections/PackageListing";
import IntroSection from "../components/press-release-sections/IntroSection";
import FeatureGrid from "../components/guestposting-sections/FeatureGrid";
import ProcessSection from "../components/guestposting-sections/ProcessSection";
import TestimonialsSection from "../components/sheared/TestimonialsSection";
import FaqSection from "../components/sheared/FaqSection";
import {
  hero, packages, intro, benefits, process,
  features, testimonials, faqs, contact,
} from "../data/pressRelease";
import ContactForm from "../components/sheared/ContactForm";

const PressRelease = () => (
  <main className="font-sans">
    <HeroBanner data={hero} />
    <PackageListing packages={packages} />
    <IntroSection data={intro} />
    <FeatureGrid data={benefits} />
    <ProcessSection data={process} />
    <FeatureGrid data={features} />
    <TestimonialsSection data={testimonials} />
    <FaqSection items={faqs} />
    <ContactForm data={contact} />
  </main>
);

export default PressRelease;