import { Link } from 'react-router-dom'
import { Mail, Phone, Instagram } from 'lucide-react'
import Logo from '../ui/Logo'
import { brandEmail, brandPhone } from '../../env'

const PAYMENTS = ['GPay', 'VISA', 'AMEX', 'MC', 'Stripe', 'APay', 'JCB']

export default function Footer() {
  return (
    <footer className="bg-primary pt-[60px] pb-5">
      <div className="max-w-container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-10">

          {/* Brand */}
          <div>
            <Logo light />
            <div className="mt-4">
              <div className="flex items-center gap-[10px] text-white/70 text-label mb-[10px]">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-white/10">
                  <Mail size={13} className="text-white" />
                </div>
                <span>{brandEmail}</span>
              </div>
              <div className="flex items-center gap-[10px] text-white/70 text-label mb-[10px]">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-white/10">
                  <Phone size={13} className="text-white" />
                </div>
                <span>{brandPhone}</span>
              </div>
            </div>
            <div className="flex gap-[10px] mt-4">
              <div className="w-[34px] h-[34px] rounded-full bg-white/10 flex items-center justify-center text-label cursor-pointer font-bold text-white transition-all duration-200 hover:scale-110 hover:bg-white/20">f</div>
              <div className="w-[34px] h-[34px] rounded-full bg-white/10 flex items-center justify-center cursor-pointer text-white transition-all duration-200 hover:scale-110 hover:bg-white/20">
                <Instagram size={15} />
              </div>
              <div className="w-[34px] h-[34px] rounded-full bg-white/10 flex items-center justify-center text-label cursor-pointer font-bold text-white transition-all duration-200 hover:scale-110 hover:bg-white/20">𝕏</div>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-white font-semibold text-label mb-4">Useful Links</h4>
            <div className="flex flex-col gap-[10px]">
              <Link to="/" className="text-white/60 text-label no-underline transition-colors hover:text-white cursor-pointer">Home</Link>
              <Link to="/about" className="text-white/60 text-label no-underline transition-colors hover:text-white cursor-pointer">About Us</Link>
              <Link to="/contact" className="text-white/60 text-label no-underline transition-colors hover:text-white cursor-pointer">Contact Us</Link>
              <Link to="/partner" className="text-white/60 text-label no-underline transition-colors hover:text-white cursor-pointer">Become a Partner</Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-label mb-4">Our Services</h4>
            <div className="flex flex-col gap-[10px]">
              <span className="text-white/60 text-label cursor-pointer hover:text-white transition-colors">Airport Transfer</span>
              <span className="text-white/60 text-label cursor-pointer hover:text-white transition-colors">City Transfer</span>
              <span className="text-white/60 text-label cursor-pointer hover:text-white transition-colors">Car Hire</span>
            </div>
          </div>

          {/* Terms */}
          <div>
            <h4 className="text-white font-semibold text-label mb-4">InverseRide Terms</h4>
            <div className="flex flex-col gap-[10px]">
              <Link to="/terms" className="text-white/60 text-label no-underline transition-colors hover:text-white cursor-pointer">Terms and Conditions</Link>
              <Link to="/privacy" className="text-white/60 text-label no-underline transition-colors hover:text-white cursor-pointer">Privacy Policy</Link>
              <Link to="/booking-conditions" className="text-white/60 text-label no-underline transition-colors hover:text-white cursor-pointer">Booking Conditions</Link>
              <Link to="/refund" className="text-white/60 text-label no-underline transition-colors hover:text-white cursor-pointer">Cancellation &amp; Refund Policy</Link>
              <Link to="/help" className="text-white/60 text-label no-underline transition-colors hover:text-white cursor-pointer">Help Center</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-label">CopyRight - InverseRide © All Right Reserved..</p>
          <div className="flex gap-[6px] items-center flex-wrap justify-center">
            {PAYMENTS.map((p, i) => (
              <div key={i} className="bg-white rounded px-[7px] py-[3px] text-[10px] font-bold text-primary">{p}</div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
