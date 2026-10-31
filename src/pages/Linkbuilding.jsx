// src/pages/Linkbuilding.jsx

import BuildOptionsSection from "../components/linkbuilding-sections/BuildOptionsSection";
import ComparisonSection from "../components/linkbuilding-sections/ComparisonSection";
import ContactForm from "../components/sheared/ContactForm";
import CountriesSection from "../components/sheared/CountriesSection";
import CtaBanner from "../components/sheared/CtaBanner";
import FaqSection from "../components/sheared/FaqSection";
import HeroSection from "../components/linkbuilding-sections/HeroSection";
import HowItWorksSection from "../components/linkbuilding-sections/HowItWorksSections";
import OutsourceSection from "../components/linkbuilding-sections/OutsourceSection";
import PricingSection from "../components/linkbuilding-sections/PricingSection";
import ServicesSection from "../components/linkbuilding-sections/ServicesSection";
import StatsStrip from "../components/linkbuilding-sections/StatsStripe";
import TestimonialsSection from "../components/sheared/TestimonialsSection";
import WhyChooseSection from "../components/linkbuilding-sections/WhyChooseSection";


const Linkbuilding = () => (
  <>
    <HeroSection />
    <StatsStrip />
    <ServicesSection />
    <PricingSection />
    <WhyChooseSection />
    <ComparisonSection />
    <HowItWorksSection />
    <OutsourceSection />
    <BuildOptionsSection />
    <TestimonialsSection />
    <CountriesSection />
    <FaqSection />
    <CtaBanner/>
    <ContactForm />
  </>
);

export default Linkbuilding;