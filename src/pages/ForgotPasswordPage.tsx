import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import Logo from '../components/ui/Logo'
import { recoverCustomer } from '../services/shopifyAuthService'

const GRID_BG = 'linear-gradient(rgba(46,64,82,0.92), rgba(46,64,82,0.92)), repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255,255,255,0.015) 60px, rgba(255,255,255,0.015) 61px), repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.015) 60px, rgba(255,255,255,0.015) 61px)'

const cardCls  = 'bg-white rounded-2xl px-4 pt-3 pb-4 mb-2'
const labelCls = 'block text-[11px] font-bold text-primary uppercase tracking-wide mb-[6px]'
const inputCls = 'flex-1 text-[14px] text-primary font-body outline-none border-none bg-transparent placeholder:text-[#aaa]'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit() {
    if (!email) { setError('Please enter your email address.'); return }
    setError('')
    setLoading(true)
    try {
      const { errors } = await recoverCustomer(email)
      if (errors.length > 0) {
        setError(errors[0].message)
      } else {
        setSent(true)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-16 relative"
      style={{ backgroundImage: GRID_BG, backgroundColor: '#2E4052' }}
    >
      <div className="absolute top-6 left-8">
        <Logo light onClick={() => navigate('/')} />
      </div>

      <div className="w-full max-w-[420px]">

        {sent ? (
          /* ── Success state ── */
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle size={48} style={{ color: '#FFC857' }} />
            </div>
            <h1 className="font-head text-heading text-white leading-none mb-3">Check your inbox</h1>
            <p className="text-[14px] text-white/70 font-body mb-8">
              If an account exists for <span className="text-white font-semibold">{email}</span>,
              you'll receive a password reset link shortly.
            </p>
            <button
              className="w-full border-none rounded-2xl py-[15px] px-6 font-semibold text-[15px] cursor-pointer font-body"
              style={{ background: '#FFC857', color: '#2E4052' }}
              onClick={() => navigate('/signin')}
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          /* ── Form state ── */
          <>
            <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#FFC857' }}>
              Account Recovery
            </p>
            <h1 className="font-head text-heading text-white leading-none mb-1">Forgot Password?</h1>
            <p className="text-[14px] text-white/70 font-body mb-7">
              Enter your email and we'll send you a reset link.
            </p>

            {error && (
              <div className="bg-red-500/20 border border-red-400/40 text-red-200 text-[13px] rounded-xl px-4 py-3 mb-4">
                {error}
              </div>
            )}

            <div className={cardCls}>
              <label className={labelCls}>Email Address</label>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#aaa] flex-shrink-0" />
                <input
                  className={inputCls}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
              </div>
            </div>

            <button
              className="w-full border-none rounded-2xl py-[15px] px-6 font-semibold text-[15px] cursor-pointer font-body mb-4 mt-3 disabled:opacity-60"
              style={{ background: '#FFC857', color: '#2E4052' }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Sending…' : 'Send Reset Link'}
            </button>

            <p className="text-center text-[13px] text-white/70">
              <Link
                to="/signin"
                className="text-white/70 no-underline flex items-center justify-center gap-1 hover:text-white transition-colors"
              >
                <ArrowLeft size={13} /> Back to Sign In
              </Link>
            </p>
          </>
        )}

      </div>
    </div>
  )
}
