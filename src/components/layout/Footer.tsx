import { Link } from 'react-router-dom'
import { Mail, Phone, Instagram, Twitter, Facebook } from 'lucide-react'
import Logo from '../ui/Logo'
import { brandEmail, brandPhone } from '../../env'
import { SERVICES } from '../../data'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/partner', label: 'Become a Partner' },
]

// Map service labels to their /book?service= keys
const SERVICE_ROUTE_MAP: Record<string, string> = {
  'Private Transfer': '/book?service=transfer',
  'City to City': '/book?service=city-to-city',
  'Airport Rides': '/book?service=airport',
  'City Tour': '/book?service=city-tour',
  'Hourly Hire': '/book?service=hourly',
  'Desert Safari': '/book?service=desert-safari',
}

const LEGAL_LINKS = [
  { to: '/terms', label: 'Terms and Conditions' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/booking-conditions', label: 'Booking Conditions' },
  { to: '/refund', label: 'Cancellation & Refund' },
  { to: '/help', label: 'Help Center' },
]

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#010407' }} className="pt-14 pb-6">
      <div className="max-w-container mx-auto px-6">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-10">

          {/* Brand col — full width on mobile */}
          <div className="col-span-2 md:col-span-1">
            <Logo light />

            {/* Contact */}
            <div className="mt-5 flex flex-col gap-2.5">
              <a
                href={`mailto:${brandEmail}`}
                className="flex items-center gap-2.5 no-underline group"
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/10 group-hover:bg-white/20 transition-colors">
                  <Mail size={13} className="text-white/70" />
                </div>
                <span className="text-[13px] text-white/60 group-hover:text-white/90 transition-colors">{brandEmail}</span>
              </a>
              <a
                href={`tel:${brandPhone}`}
                className="flex items-center gap-2.5 no-underline group"
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/10 group-hover:bg-white/20 transition-colors">
                  <Phone size={13} className="text-white/70" />
                </div>
                <span className="text-[13px] text-white/60 group-hover:text-white/90 transition-colors">{brandPhone}</span>
              </a>
            </div>

            {/* Social */}
            <div className="flex gap-2 mt-5">
              {[
                { Icon: Facebook, label: 'Facebook' },
                { Icon: Instagram, label: 'Instagram' },
                { Icon: Twitter, label: 'Twitter' },
              ].map(({ Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Icon size={14} className="text-white/70" />
                </button>
              ))}
            </div>
          </div>

          {/* Useful links */}
          <div>
            <h4 className="text-white text-[12px] font-bold uppercase tracking-widest mb-4">
              Useful Links
            </h4>
            <div className="flex flex-col gap-2.5">
              {NAV_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-[13px] text-white/50 no-underline hover:text-white transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white text-[12px] font-bold uppercase tracking-widest mb-4">
              Our Services
            </h4>
            <div className="flex flex-col gap-2.5">
              {SERVICES.map(s => (
                <Link
                  key={s.label}
                  to={SERVICE_ROUTE_MAP[s.label] ?? '/book'}
                  className="text-[13px] text-white/50 no-underline hover:text-white transition-colors"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white text-[12px] font-bold uppercase tracking-widest mb-4">
              Legal
            </h4>
            <div className="flex flex-col gap-2.5">
              {LEGAL_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-[13px] text-white/50 no-underline hover:text-white transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-white/10 pt-5 flex flex-col items-center gap-5">

          {/* Copyright */}
          <p className="text-[12px] text-white/30 self-start sm:self-center">
            © {new Date().getFullYear()} InverseRide — All Rights Reserved
          </p>

          {/* Payment methods */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-white/30 uppercase tracking-widest whitespace-nowrap flex-shrink-0">We Accept</span>
            <div className="w-px h-5 bg-white/10 flex-shrink-0" />
            <div className="flex flex-wrap items-center gap-2">
              {[
                { src: '/payments/visa-svgrepo-com.svg', alt: 'Visa' },
                { src: '/payments/mastercard-svgrepo-com.svg', alt: 'Mastercard' },
                { src: '/payments/amex-svgrepo-com.svg', alt: 'American Express' },
                { src: '/payments/paypal-3-svgrepo-com.svg', alt: 'PayPal' },
                { src: '/payments/apple-pay-svgrepo-com.svg', alt: 'Apple Pay' },
                { src: '/payments/google-pay-svgrepo-com.svg', alt: 'Google Pay' },
                { src: '/payments/stripe-svgrepo-com.svg', alt: 'Stripe' },
                { src: '/payments/cash-svgrepo-com.svg', alt: 'Cash' },
              ].map(({ src, alt }) => (
                <img
                  key={alt}
                  src={src}
                  alt={alt}
                  className="h-7 w-auto rounded object-contain"
                />
              ))}
            </div>
          </div>

        </div>

      </div>
    </footer>
  )
}