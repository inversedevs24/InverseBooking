import React from 'react'
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

      <section className="section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <FAQ items={HOME_FAQS} />
        </div>
      </section>
    </>
  )
}
