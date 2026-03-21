import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import PartnerPage from './pages/PartnerPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import BookingConditionsPage from './pages/BookingConditionsPage'
import RefundPage from './pages/RefundPage'
import HelpPage from './pages/HelpPage'
import AllFleets from './components/fleets/AllFleets'
import VehicleSelect from './components/fleets/VehicleSelect'
import BookingDetails from './components/fleets/BookingDetails'
import Checkout from './components/fleets/Checkout'
import UserDashboard from './components/user/UserDashboard'
import ServiceBookingForm from './components/fleets/ServiceBookingForm'

const AUTH_ROUTES = ['/signin', '/signup']

export default function App() {
  const { pathname } = useLocation()
  const isAuth = AUTH_ROUTES.includes(pathname)

  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

  return (
    <>
      {/* {!isAuth && <div className="hidden md:block"><TopBar /></div>} */}
      {!isAuth && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/book" element={<ServiceBookingForm />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/partner" element={<PartnerPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/booking-conditions" element={<BookingConditionsPage />} />
          <Route path="/refund" element={<RefundPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/fleet" element={<AllFleets />} />
          <Route path="/vehicles" element={<VehicleSelect />} />
          <Route path="/booking-details" element={<BookingDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/account" element={<UserDashboard />} />
        </Routes>
      </main>
      {!isAuth && <Footer />}
    </>
  )
}
