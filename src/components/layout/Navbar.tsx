import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, Phone, Mail, User } from 'lucide-react'
import Logo from '../ui/Logo'
import { brandPhone, brandEmail } from '../../env'

export default function Navbar() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `no-underline font-medium text-label transition-colors cursor-pointer py-1 border-b-2 ${
      isActive ? 'text-primary border-secondary' : 'text-primary/70 border-transparent hover:text-primary'
    }`

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-[100] shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      <div className="max-w-container mx-auto px-6 relative flex items-center justify-between h-16">
        <Logo />

        {/* Desktop nav — absolutely centered regardless of logo/signin widths */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
          <NavLink to="/" end className={linkCls}>Home</NavLink>
          <NavLink to="/about" className={linkCls}>About Us</NavLink>
          <NavLink to="/contact" className={linkCls}>Contact Us</NavLink>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-primary/70 hover:text-primary transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Desktop sign-in */}
        <div
          className="hidden md:flex items-center gap-2 cursor-pointer px-3 py-[6px] rounded-lg transition-colors hover:bg-secondaryBg"
          onClick={() => navigate('/signin')}
        >
          <div className="w-[30px] h-[30px] bg-secondaryBg rounded-full flex items-center justify-center text-primary/70">
            <User size={16} />
          </div>
          <span className="text-[12px] font-semibold text-primary whitespace-nowrap">Sign in / Register</span>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-border px-6 py-4 flex flex-col gap-4">
          <NavLink to="/" end className={linkCls} onClick={() => setIsOpen(false)}>Home</NavLink>
          <NavLink to="/about" className={linkCls} onClick={() => setIsOpen(false)}>About Us</NavLink>
          <NavLink to="/contact" className={linkCls} onClick={() => setIsOpen(false)}>Contact Us</NavLink>
          <NavLink to="/partner" className={linkCls} onClick={() => setIsOpen(false)}>Become a Partner</NavLink>
          <NavLink to="/help" className={linkCls} onClick={() => setIsOpen(false)}>Help Center</NavLink>
          <button
            className="text-left text-label font-medium text-primary/70 hover:text-primary transition-colors"
            onClick={() => { setIsOpen(false); navigate('/signin') }}
          >
            Sign in / Register
          </button>
          <div className="pt-2 mt-1 border-t border-border flex flex-col gap-2">
            <a href={`tel:${brandPhone}`} className="flex items-center gap-2 text-label text-muted no-underline hover:text-primary transition-colors">
              <Phone size={13} />
              {brandPhone}
            </a>
            <a href={`mailto:${brandEmail}`} className="flex items-center gap-2 text-label text-muted no-underline hover:text-primary transition-colors">
              <Mail size={13} />
              {brandEmail}
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
