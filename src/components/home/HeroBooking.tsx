import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const GRAIN_SVG = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")"

export default function HeroBooking() {
  const [tab, setTab] = useState<'transfer' | 'hourly'>('transfer')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [datetime, setDatetime] = useState('2026-02-27T15:12')
  const navigate = useNavigate()

  const handleCheckFare = () => {
    navigate('/vehicles', { state: { from, to, datetime, type: tab } })
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center">
      {/* Background image with zoom animation */}
      <div
        className="absolute inset-0 bg-cover bg-center filter brightness-[0.45] saturate-[1.15] animate-hero-zoom origin-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1800&q=85')" }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(110deg, rgba(15,23,42,0.97) 0%, rgba(15,23,42,0.82) 35%, rgba(15,23,42,0.3) 65%, rgba(15,23,42,0.15) 100%), linear-gradient(to bottom, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.75) 100%)',
        }}
      />

      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.028] pointer-events-none"
        style={{ backgroundImage: GRAIN_SVG }}
      />

      {/* Floating orbs */}
      <div
        className="absolute rounded-full pointer-events-none blur-[80px] w-[500px] h-[500px] right-[5%] -top-[10%]"
        style={{ background: 'radial-gradient(circle, rgba(203,161,53,0.07) 0%, transparent 70%)' }}
      />
      <div
        className="absolute rounded-full pointer-events-none blur-[80px] w-[300px] h-[300px] right-[25%] bottom-[10%]"
        style={{ background: 'radial-gradient(circle, rgba(203,161,53,0.05) 0%, transparent 70%)' }}
      />

      {/* Main content */}
      <div className="relative z-[2] w-full max-w-container mx-auto px-6 md:px-10 py-20 flex items-center">
        <div className="max-w-[420px] relative">
          {/* Promo badges */}
          <div className="absolute -top-12 left-0 flex gap-2">
            <span className="bg-secondary text-primary font-extrabold text-[11px] px-[10px] py-[3px] rounded">
              Exclusive 50% OFF
            </span>
            <span className="bg-secondary text-white font-extrabold text-[11px] px-[10px] py-[3px] rounded">
              BOOK IT NOW
            </span>
          </div>

          <h1 className="font-head text-heading md:text-display text-white mb-1">Book Now —</h1>
          <p className="font-head text-title font-medium text-white/70 mb-5">Transfer or Hourly</p>

          {/* Booking form */}
          <div className="bg-white/10 backdrop-blur-[12px] border border-white/20 rounded-xl p-5">
            {/* Tabs */}
            <div className="flex bg-black/30 rounded-lg overflow-hidden mb-[14px]">
              <button
                className={`px-[18px] py-[9px] text-label font-semibold cursor-pointer border-none font-body transition-all ${
                  tab === 'transfer' ? 'bg-primary text-white' : 'bg-transparent text-white/60'
                }`}
                onClick={() => setTab('transfer')}
              >
                Private Transfer
              </button>
              <button
                className={`px-[18px] py-[9px] text-label font-semibold cursor-pointer border-none font-body transition-all ${
                  tab === 'hourly' ? 'bg-primary text-white' : 'bg-transparent text-white/60'
                }`}
                onClick={() => setTab('hourly')}
              >
                Hourly Hire
              </button>
            </div>

            <div className="mb-[10px]">
              <div className="text-[10px] text-white/60 uppercase tracking-wide mb-1">FROM</div>
              <input
                className="bg-white/97 border-none rounded-lg px-[14px] py-[10px] text-label text-primary w-full font-body outline-none"
                placeholder="Enter a pickup location"
                value={from}
                onChange={e => setFrom(e.target.value)}
              />
            </div>

            {tab === 'transfer' && (
              <div className="mb-[10px]">
                <div className="text-[10px] text-white/60 uppercase tracking-wide mb-1">TO</div>
                <input
                  className="bg-white/97 border-none rounded-lg px-[14px] py-[10px] text-label text-primary w-full font-body outline-none"
                  placeholder="Enter a dropoff location"
                  value={to}
                  onChange={e => setTo(e.target.value)}
                />
              </div>
            )}

            <div className="mb-[10px]">
              <div className="text-[10px] text-white/60 uppercase tracking-wide mb-1">PICKUP DATE &amp; TIME</div>
              <input
                type="datetime-local"
                className="bg-white/97 border-none rounded-lg px-[14px] py-[10px] text-label text-primary w-full font-body outline-none"
                value={datetime}
                onChange={e => setDatetime(e.target.value)}
              />
            </div>

            {tab === 'transfer' && (
              <button className="text-white/70 text-label cursor-pointer bg-transparent border-none font-body flex items-center gap-[6px] p-0 mb-[14px]">
                + Add Return
              </button>
            )}

            <button
              className="w-full bg-secondary text-white border-none rounded-lg py-[13px] px-6 font-semibold text-label cursor-pointer font-body transition-all hover:bg-secondary/80 hover:-translate-y-px"
              onClick={handleCheckFare}
            >
              Check Fare
            </button>
          </div>
        </div>
      </div>

      {/* Floating stats */}
      <div className="absolute bottom-10 right-10 z-[3] flex bg-white/[0.06] backdrop-blur-[16px] border border-white/10 rounded-[14px] overflow-hidden max-sm:bottom-4 max-sm:right-4 max-sm:left-4 max-sm:justify-center">
        {[
          { num: '4.9★', lbl: 'Rating' },
          { num: '12k+', lbl: 'Rides' },
          { num: '24/7', lbl: 'Support' },
        ].map((s, i) => (
          <div key={i} className={`px-[22px] py-[14px] text-center ${i < 2 ? 'border-r border-white/[0.08]' : ''}`}>
            <div className="font-head text-xl font-bold text-white leading-none">{s.num}</div>
            <div className="text-[10px] text-white/40 mt-1 uppercase tracking-[0.8px]">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 z-[3] flex flex-col items-center gap-[6px] animate-scroll-bob">
        <div className="w-[5px] h-[5px] rounded-full bg-white/40" />
        <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)' }} />
      </div>
    </div>
  )
}
