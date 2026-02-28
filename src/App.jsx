import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import TopBar from './components/layout/TopBar'
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

const AUTH_ROUTES = ['/signin', '/signup']

export default function App() {
  const { pathname } = useLocation()
  const isAuth = AUTH_ROUTES.includes(pathname)

  return (
    <>
      {!isAuth && <TopBar />}
      {!isAuth && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
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
        </Routes>
      </main>
      {!isAuth && <Footer />}
    </>
  )
}
