import { testimonials } from "../data/linkbuilding";
import { homeFaqs } from "../data/home";
import HeroSearch from "../components/marketplace-sections/HeroSearch";
import DataPartner from "../components/marketplace-sections/DataPartner";
import StatsBar from "../components/marketplace-sections/StatsBar";
import WebsitesTable from "../components/marketplace-sections/WebsitesTable";
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
    <HeroSearch />
    <DataPartner />
    <StatsBar />
    <WebsitesTable />
    <PopularServices />
    <FeaturedOn />
    <FeaturedPackages />
    <ProcessSteps />
    <IntroSection />
    <WhyChooseUs />
    <FlexibleServices />
    <CountriesSection />
    <TestimonialsSection items={testimonials} />
    <FaqSection title="Most Frequently Asked Questions" items={homeFaqs} />
    <FeaturedBlogs />
    <CtaBanner
      title="Link Building Services at Your Fingertips!"
      description="Join thousands of businesses growing their authority with Vefogix."
      primary={{ label: "Join Vefogix", to: "/signin" }}
    />
    <ContactForm />
  </>
);

export default Home;