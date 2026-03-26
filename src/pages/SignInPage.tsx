import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react'
import Logo from '../components/ui/Logo'

const GRID_BG = 'linear-gradient(rgba(46,64,82,0.92), rgba(46,64,82,0.92)), repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255,255,255,0.015) 60px, rgba(255,255,255,0.015) 61px), repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.015) 60px, rgba(255,255,255,0.015) 61px)'

const cardCls  = 'bg-white rounded-2xl px-4 pt-3 pb-4 mb-2'
const labelCls = 'block text-[11px] font-bold text-primary uppercase tracking-wide mb-[6px]'
const inputCls = 'flex-1 text-[14px] text-primary font-body outline-none border-none bg-transparent placeholder:text-[#aaa]'

export default function SignInPage() {
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-16 relative"
      style={{ backgroundImage: GRID_BG, backgroundColor: '#2E4052' }}
    >
      <div className="absolute top-6 left-8">
        <Logo light onClick={() => navigate('/')} />
      </div>

      <div className="w-full max-w-[420px]">

        {/* Header */}
        <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#FFC857' }}>
          Welcome Back
        </p>
        <h1 className="font-head text-heading text-white leading-none mb-1">Sign In</h1>
        <p className="text-[14px] text-white/70 font-body mb-7">Enter your details to continue.</p>

        {/* Email */}
        <div className={cardCls}>
          <label className={labelCls}>Email Address</label>
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-[#aaa] flex-shrink-0" />
            <input className={inputCls} type="email" placeholder="you@example.com" />
          </div>
        </div>

        {/* Password */}
        <div className={cardCls}>
          <label className={labelCls}>Password</label>
          <div className="flex items-center gap-2">
            <Lock size={14} className="text-[#aaa] flex-shrink-0" />
            <input className={inputCls} type={showPw ? 'text' : 'password'} placeholder="••••••••" />
            <button
              type="button"
              onClick={() => setShowPw(v => !v)}
              className="text-[#aaa] hover:text-primary transition-colors flex-shrink-0 border-none bg-transparent cursor-pointer p-0"
            >
              {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between mb-5 px-1">
          <label className="flex items-center gap-[6px] text-[13px] text-white/70 cursor-pointer">
            <input type="checkbox" className="accent-secondary" /> Remember me
          </label>
          <a className="text-[13px] text-secondary font-semibold no-underline" href="#">Forgot password?</a>
        </div>

        {/* Submit */}
        <button
          className="w-full border-none rounded-2xl py-[15px] px-6 font-semibold text-[15px] cursor-pointer font-body text-white mb-2"
          style={{ background: '#FFC857', color: '#2E4052' }}
          onClick={() => navigate('/')}
        >
          Sign In
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 text-white/50 text-[12px] my-4">
          <div className="flex-1 h-px bg-white/10" />
          OR
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Guest */}
        <button
          className="w-full bg-white/10 border border-white/20 text-white rounded-2xl py-[13px] font-semibold text-[14px] cursor-pointer font-body flex items-center justify-center gap-2 mb-6"
          onClick={() => navigate('/')}
        >
          <User size={15} /> Book as a Guest
        </button>

        {/* Sign up link */}
        <p className="text-center text-[13px] text-white mb-3">
          New here?{' '}
          <Link to="/signup" className="text-white font-semibold underline">Create an account</Link>
        </p>

        {/* Terms */}
        <p className="text-center text-[11px] text-white">
          By proceeding you agree to InverseRide{' '}
          <Link to="/terms" className="text-white underline">Terms</Link> &amp;{' '}
          <Link to="/privacy" className="text-white underline">Privacy</Link>
        </p>

      </div>
    </div>
  )
}
