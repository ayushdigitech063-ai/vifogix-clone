import DataPartner  from "../components/marketplace-sections/DataPartner"
import HeroSearch  from "../components/marketplace-sections/HeroSearch"
import  StatsBar  from "../components/marketplace-sections/statsBar"
import  WebsitesTable  from "../components/marketplace-sections/WebsitesTable"

const Marketplace =()=>{
    return(
        <>
        <HeroSearch />
        <DataPartner />
        <StatsBar />
        <WebsitesTable />
        </>
    )
}

export default Marketplace;