import HeroBanner from "../components/guestposting-sections/HeroBanner";
import WebsiteListing from "../components/guestposting-sections/WebsiteListing";
import ProcessSection from "../components/guestposting-sections/ProcessSection";
import FeatureGrid from "../components/guestposting-sections/FeatureGrid";
import IndustriesSection from "../components/guestposting-sections/IndustriesSection";
import TestimonialsSection from "../components/sheared/TestimonialsSection";
import FaqSection from "../components/sheared/FaqSection";
import CtaBanner from "../components/sheared/CtaBanner";
import {
  hero, listing, websites, process, whyChoose, benefits,
  audiences, buyOptions, industries, testimonials, faqs, cta,
} from "../data/guestposting";

const GuestPosting = () => (
  <main className="font-sans">
    <HeroBanner data={hero} />
    <WebsiteListing data={listing} websites={websites} onFiltersClick={() => {}} />
    <ProcessSection data={process} />
    <FeatureGrid data={whyChoose} numbered bg="bg-white" />
    <FeatureGrid data={benefits} bg="bg-cream" />
    <FeatureGrid data={audiences} numbered bg="bg-white" />
    <FeatureGrid data={buyOptions} bg="bg-cream" numbered />
    <IndustriesSection data={industries} />
    <TestimonialsSection data={testimonials} tone="cream" />
    <FaqSection items={faqs} tone="white" />
    <CtaBanner data={cta} tone="navy" />
  </main>
);

export default GuestPosting;
