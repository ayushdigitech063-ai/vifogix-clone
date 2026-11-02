import HeroBanner from "../components/marketplace-sections/HeroBanner"
import WebsiteListing from "../components/marketplace-sections/WebsiteListing"
import CtaBanner from "../components/sheared/CtaBanner";
import FaqSection from "../components/sheared/FaqSection";
import TestimonialsSection from "../components/sheared/TestimonialsSection";

const Marketplace =()=>{
    return(
        <>
        <HeroBanner  total={128120}
  onCategoryChange={(cat) => console.log(cat)}
  onFiltersClick={() => setShowFilters(true)}/>
       <WebsiteListing />
       <TestimonialsSection />
       <CtaBanner />
       <FaqSection />
        </>
    )
}

export default Marketplace;