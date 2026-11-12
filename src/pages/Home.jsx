import { testimonials } from "../data/linkbuilding";
import { homeFaqs } from "../data/home";
import HeroSearch from "../components/home-sections/HeroSearch";
import LightHouseWebsites from "../components/home-sections/LightHouseWebsites";
import WebsitesTable from "../components/home-sections/WebsitesTable";
import PopularServices from "../components/home-sections/PopularServices";
import FeaturedOn from "../components/home-sections/FeaturedOn";
import FeaturedPackages from "../components/home-sections/FeaturedPackages";
import ProcessSteps from "../components/home-sections/ProcessSteps";
import IntroSection from "../components/home-sections/IntroSection";
import WhyChooseUs from "../components/home-sections/WhyChoose";
import FlexibleServices from "../components/home-sections/FlexibleServices";
import FeaturedBlogs from "../components/home-sections/FeaturedBlogs";
import CountriesSection from "../components/sheared/CountriesSection";
import TestimonialsSection from "../components/sheared/TestimonialsSection";
import FaqSection from "../components/sheared/FaqSection";
import CtaBanner from "../components/sheared/CtaBanner";
import ContactForm from "../components/sheared/ContactForm";

const Home = () => (
  <>
    <HeroSearch variant="video" />
    <LightHouseWebsites />
    <WebsitesTable />
    <PopularServices />
    <FeaturedOn />
    <FeaturedPackages />
    <ProcessSteps />
    <IntroSection />
    <WhyChooseUs />
    <FlexibleServices />
    <CountriesSection tone="cream" />
    <TestimonialsSection items={testimonials} tone="white" />
    <FaqSection title="Most Frequently Asked Questions" tone="cream" />
    <FeaturedBlogs />
    <CtaBanner
      tone="navy"
      title="Link Building Services at Your Fingertips!"
      description="Join thousands of businesses growing their authority with Vefogix."
      primary={{ label: "Join Vefogix", to: "/signin" }}
    />
    <ContactForm tone="navy-950" />
  </>
);

export default Home;
