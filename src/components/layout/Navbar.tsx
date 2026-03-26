import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, User, ChevronDown, LogOut, CalendarDays } from 'lucide-react'
import Logo from '../ui/Logo'

// ─── Mock auth state — swap with your real auth context / Shopify customer hook ─
const MOCK_USER = {
  isLoggedIn: true,           // set false to preview logged-out state
  name: 'James Harrington',
  email: 'james.h@email.com',
  avatar: 'JH',               // initials fallback
}

export default function Navbar() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)   // mobile menu
  const [dropOpen, setDropOpen] = useState(false)   // desktop user dropdown
  const dropRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close mobile menu on route change
  const closeMobile = () => setIsOpen(false)

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `no-underline font-medium text-label transition-colors cursor-pointer py-1 border-b-2 ${isActive
      ? 'text-primary border-secondary'
      : 'text-primary/70 border-transparent hover:text-primary'
    }`

  const mobileLinkCls = ({ isActive }: { isActive: boolean }) =>
    `no-underline font-medium text-[14px] transition-colors cursor-pointer py-2 border-b border-transparent ${isActive ? 'text-primary font-semibold' : 'text-primary/70 hover:text-primary'
    }`

  //  Logged-in user section (desktop) 
  const UserDropdown = () => (
    <div className="relative" ref={dropRef}>
      <button
        onClick={() => setDropOpen(v => !v)}
        className="hidden md:flex items-center gap-2 cursor-pointer px-2 py-[6px] rounded-lg transition-colors hover:bg-secondaryBg"
      >
        {/* Avatar */}
        <div
          className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
          style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}
        >
          {MOCK_USER.avatar}
        </div>
        {/* Name — hidden on narrower desktop to avoid crowding */}
        <span className="text-[12px] font-semibold text-primary whitespace-nowrap hidden lg:block">
          {MOCK_USER.name.split(' ')[0]}
        </span>
        <ChevronDown
          size={13}
          className={`text-primary/50 transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown panel */}
      {dropOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white rounded-2xl shadow-[0_8px_30px_rgba(15,23,42,0.12)] border border-slate-100 overflow-hidden z-50">
          {/* User info header */}
          <div className="px-4 py-3 border-b border-slate-100" style={{ backgroundColor: '#F0F5F0' }}>
            <div className="text-[13px] font-bold text-slate-800 truncate">{MOCK_USER.name}</div>
            <div className="text-[11px] text-slate-400 truncate mt-0.5">{MOCK_USER.email}</div>
          </div>

          {/* Menu items */}
          <div className="py-1.5">
            <button
              onClick={() => { setDropOpen(false); navigate('/account') }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors text-left"
            >
              <CalendarDays size={14} className="text-slate-400 flex-shrink-0" />
              My Bookings
            </button>
          </div>

          {/* Sign out */}
          <div className="border-t border-slate-100 py-1.5">
            <button
              onClick={() => { setDropOpen(false); /* call your signOut() here */ }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 transition-colors text-left"
            >
              <LogOut size={14} className="flex-shrink-0" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )

  //  Guest sign-in button (desktop) 
  const SignInButton = () => (
    <div
      className="hidden md:flex items-center gap-2 cursor-pointer px-3 py-[6px] rounded-lg transition-colors hover:bg-secondaryBg"
      onClick={() => navigate('/signin')}
    >
      <div className="w-[30px] h-[30px] bg-secondaryBg rounded-full flex items-center justify-center text-primary/70">
        <User size={16} />
      </div>
      <span className="text-[12px] font-semibold text-primary whitespace-nowrap">Sign in / Register</span>
    </div>
  )

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-[100] shadow-[0_2px_12px_rgba(0,0,0,0.06)] relative">
      <div className="max-w-container mx-auto px-4 sm:px-6 relative flex items-center justify-between h-16">

        <Logo />

        {/* Desktop nav links — absolutely centred */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
          <NavLink to="/" end className={linkCls}>Home</NavLink>
          <NavLink to="/about" className={linkCls}>About Us</NavLink>
          <NavLink to="/fleet" className={linkCls}>Fleets</NavLink>
          <NavLink to="/contact" className={linkCls}>Contact Us</NavLink>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Desktop: show user dropdown or sign-in depending on auth */}
          {MOCK_USER.isLoggedIn ? <UserDropdown /> : <SignInButton />}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-primary/70 hover:text-primary transition-colors rounded-lg hover:bg-slate-100"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu — absolute overlay so it doesn't push page content down ── */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-border shadow-[0_8px_24px_rgba(0,0,0,0.10)] z-[99]">

          {/* Logged-in user info strip */}
          {MOCK_USER.isLoggedIn && (
            <div
              className="flex items-center gap-3 px-5 py-4 border-b border-border"
              style={{ backgroundColor: '#F0F5F0' }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}
              >
                {MOCK_USER.avatar}
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-bold text-slate-800 truncate">{MOCK_USER.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{MOCK_USER.email}</div>
              </div>
            </div>
          )}

          {/* Nav links */}
          <div className="px-5 py-3 flex flex-col">
            <NavLink to="/" end className={mobileLinkCls} onClick={closeMobile}>Home</NavLink>
            <NavLink to="/about" className={mobileLinkCls} onClick={closeMobile}>About Us</NavLink>
            <NavLink to="/fleet" className={mobileLinkCls} onClick={closeMobile}>Fleets</NavLink>
            <NavLink to="/contact" className={mobileLinkCls} onClick={closeMobile}>Contact Us</NavLink>
            <NavLink to="/partner" className={mobileLinkCls} onClick={closeMobile}>Become a Partner</NavLink>
            <NavLink to="/help" className={mobileLinkCls} onClick={closeMobile}>Help Center</NavLink>
          </div>

          {/* Auth actions */}
          <div className="px-5 py-3 border-t border-border flex flex-col gap-1">
            {MOCK_USER.isLoggedIn ? (
              <>
                <button
                  onClick={() => { closeMobile(); navigate('/account') }}
                  className="flex items-center gap-3 py-2.5 text-[14px] font-medium text-slate-700 hover:text-primary transition-colors text-left"
                >
                  <CalendarDays size={15} className="text-slate-400 flex-shrink-0" />
                  My Bookings
                </button>
                <button
                  onClick={() => { closeMobile(); /* call your signOut() here */ }}
                  className="flex items-center gap-3 py-2.5 text-[14px] font-medium text-red-500 hover:text-red-600 transition-colors text-left"
                >
                  <LogOut size={15} className="flex-shrink-0" />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                className="flex items-center gap-3 py-2.5 text-[14px] font-medium text-slate-700 hover:text-primary transition-colors text-left"
                onClick={() => { closeMobile(); navigate('/signin') }}
              >
                <User size={15} className="text-slate-400 flex-shrink-0" />
                Sign in / Register
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
