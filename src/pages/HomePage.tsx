import HeroBooking from '../components/home/HeroBooking'
import FeaturesBar from '../components/home/FeaturesBar'
import PromoBanners from '../components/home/PromoBanners'
import ServiceCategories from '../components/home/ServiceCategories'
import FleetSection from '../components/home/FleetSection'
import ChauffeurSection from '../components/home/ChauffeurSection'
import WhyChooseUs from '../components/home/WhyChooseUs'
import HowItWorks from '../components/home/HowItWorks'
import RideSmileBanner from '../components/home/RideSmileBanner'
import FAQ from '../components/ui/FAQ'
import { HOME_FAQS } from '../data'

export default function HomePage() {
  return (
    <>
      <HeroBooking />
      <FeaturesBar />
      <PromoBanners />
      <ServiceCategories />
      <FleetSection />
      <ChauffeurSection />
      <WhyChooseUs />
      <HowItWorks />
      <RideSmileBanner />

      <section className="py-10 md:py-[60px]">
        <div className="max-w-container mx-auto px-6">
          <h2 className="font-head text-heading text-primary text-center leading-none mb-2">Frequently Asked Questions</h2>
          <div className="mb-10" />
          <FAQ items={HOME_FAQS} />
        </div>
      </section>
    </>
  )
}
