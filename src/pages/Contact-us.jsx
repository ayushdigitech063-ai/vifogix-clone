import HeroBanner from "../components/contact-sections/HeroBanner";
import AboutReach from "../components/contact-sections/AboutReach";
import ContactForm from "../components/sheared/ContactForm";
import { hero, about, reach } from "../data/contact";

const ContactUs = () => {
  return (
    <main className="font-sans">
      <HeroBanner hero={hero} />
      <AboutReach about={about} reach={reach} />
      <ContactForm />
    </main>
  );
};

export default ContactUs;

