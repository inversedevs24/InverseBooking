import { Link } from 'react-router-dom'
import { Phone, Mail } from 'lucide-react'
import { brandPhone, brandEmail } from '../../env'

export default function TopBar() {
  return (
    <div className="bg-primary text-label py-[6px]">
      <div className="max-w-container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/partner" className="text-white/50 no-underline transition-colors hover:text-white cursor-pointer">
            Become a Partner
          </Link>
          <span className="text-white/20">|</span>
          <Link to="/help" className="text-white/50 no-underline transition-colors hover:text-white cursor-pointer">
            Help Center
          </Link>
        </div>
        <div className="flex items-center gap-[10px]">
          <span className="flex items-center gap-[6px] text-white/50 text-label">
            <Phone size={12} /> {brandPhone}
          </span>
          <span className="flex items-center gap-[6px] text-white/50 text-label">
            <Mail size={12} /> {brandEmail}
          </span>
        </div>
      </div>
    </div>
  )
}
