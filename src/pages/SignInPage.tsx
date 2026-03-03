import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, User } from 'lucide-react'
import Logo from '../components/ui/Logo'

export default function SignInPage() {
  const navigate = useNavigate()

  return (
    <div
      className="min-h-screen bg-primary flex items-center justify-center px-6 py-10 relative"
      style={{
        backgroundImage: 'linear-gradient(rgba(15,23,42,0.85), rgba(15,23,42,0.85)), repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255,255,255,0.015) 60px, rgba(255,255,255,0.015) 61px), repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.015) 60px, rgba(255,255,255,0.015) 61px)',
      }}
    >
      <div className="absolute top-6 left-8">
        <Logo light onClick={() => navigate('/')} />
      </div>

      <div className="bg-white rounded-card-lg p-10 w-full max-w-[440px]">
        <h2 className="font-head text-title mb-6 text-primary">Sign In</h2>

        <div className="relative mb-[14px]">
          <span className="absolute left-[14px] top-1/2 -translate-y-1/2 text-muted flex items-center">
            <Mail size={15} />
          </span>
          <input className="w-full pl-10 pr-[14px] py-[13px] border-none rounded-lg bg-secondaryBg text-label font-body outline-none text-primary placeholder:text-[#999]" type="email" placeholder="Email Address" />
        </div>

        <div className="relative mb-[14px]">
          <span className="absolute left-[14px] top-1/2 -translate-y-1/2 text-muted flex items-center">
            <Lock size={15} />
          </span>
          <input className="w-full pl-10 pr-10 py-[13px] border-none rounded-lg bg-secondaryBg text-label font-body outline-none text-primary placeholder:text-[#999]" type="password" placeholder="Password" />
          <span className="absolute right-[14px] top-1/2 -translate-y-1/2 cursor-pointer text-muted flex items-center">
            <Eye size={15} />
          </span>
        </div>

        <div className="flex items-center justify-between mb-4 text-label">
          <label className="flex items-center gap-[6px] cursor-pointer text-primary/70">
            <input type="checkbox" className="accent-secondary" /> Remember Me
          </label>
          <a className="text-secondary no-underline font-semibold" href="#">Forgot Password?</a>
        </div>

        <button className="w-full bg-primary text-white border-none rounded-lg py-[14px] font-bold text-span cursor-pointer font-body transition-colors hover:bg-secondary mb-[14px]" onClick={() => navigate('/')}>
          Sign In
        </button>

        <p className="text-center text-label text-muted my-2">
          New to InverseRide? <Link to="/signup" className="text-secondary font-semibold no-underline">Signup now</Link>
        </p>

        <div className="flex items-center gap-3 text-muted text-label my-[6px]">
          <div className="flex-1 h-px bg-border" />
          OR
          <div className="flex-1 h-px bg-border" />
        </div>

        <button className="w-full bg-secondaryBg text-primary border-none rounded-lg py-3 font-semibold text-label cursor-pointer font-body flex items-center justify-center gap-2 mb-3 transition-colors hover:bg-border" onClick={() => navigate('/')}>
          <User size={14} /> Book as a Guest
        </button>

        <p className="text-center text-[11px] text-muted">
          By proceeding you agree to InverseRide{' '}
          <Link to="/terms" className="text-secondary no-underline">Terms</Link> &amp; <Link to="/privacy" className="text-secondary no-underline">Privacy</Link>
        </p>
      </div>
    </div>
  )
}
