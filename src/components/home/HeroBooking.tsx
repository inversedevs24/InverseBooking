import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import DateTimePicker from '../ui/DateTimePicker'

const GRAIN_SVG = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")"

function toLocalISO(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default function HeroBooking() {
  const [tab, setTab]                   = useState<'transfer' | 'hourly'>('transfer')
  const [from, setFrom]                 = useState('')
  const [to, setTo]                     = useState('')
  const minNow                          = useMemo(() => toLocalISO(new Date()), [])
  const [datetime, setDatetime]         = useState(minNow)
  const [showReturn, setShowReturn]     = useState(false)
  const [returnDatetime, setReturnDatetime] = useState('')
  const navigate = useNavigate()

  function handlePickupChange(val: string) {
    setDatetime(val)
    if (returnDatetime && returnDatetime <= val) setReturnDatetime('')
  }

  const handleCheckFare = () => {
    navigate('/vehicles', {
      state: { from, to, datetime, returnDatetime: showReturn ? returnDatetime : undefined, type: tab },
    })
  }

  return (
    <div className="relative  flex items-center">
      {/* Background — overflow-hidden here only, to contain blur orbs without clipping dropdowns */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center filter brightness-[0.82] saturate-[0.9] animate-hero-zoom origin-center"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/1037995/pexels-photo-1037995.jpeg')" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(110deg, rgba(248,250,252,0.92) 0%, rgba(248,250,252,0.78) 35%, rgba(248,250,252,0.35) 65%, rgba(248,250,252,0.1) 100%)' }}
        />
        <div className="absolute inset-0 opacity-[0.018] pointer-events-none" style={{ backgroundImage: GRAIN_SVG }} />
      </div>

      {/* Main content */}
      <div className="relative w-full max-w-container mx-auto px-6 md:px-10 pt-8 pb-20 md:py-20 max-sm:pb-36 flex items-center">
        <div className="max-w-[420px] w-full relative">
          <h1 className="font-head text-heading md:text-display text-primary leading-none mb-1">Book Now</h1>
          <p className="font-head text-title font-medium text-muted leading-none mb-5">Transfer or Hourly</p>

          {/* Booking form — individual cards, no outer wrapper */}

          {/* Tabs */}
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              className={`flex-1 py-[13px] text-[14px] font-semibold rounded-2xl border-none cursor-pointer font-body transition-all ${tab === 'transfer' ? 'text-white' : 'bg-white text-muted hover:text-primary'}`}
              style={tab === 'transfer' ? { background: '#0F172A' } : undefined}
              onClick={() => setTab('transfer')}
            >
              Private Transfer
            </button>
            <button
              type="button"
              className={`flex-1 py-[13px] text-[14px] font-semibold rounded-2xl border-none cursor-pointer font-body transition-all ${tab === 'hourly' ? 'text-white' : 'bg-white text-muted hover:text-primary'}`}
              style={tab === 'hourly' ? { background: '#0F172A' } : undefined}
              onClick={() => { setTab('hourly'); setShowReturn(false) }}
            >
              Hourly Hire
            </button>
          </div>

          {/* From */}
          <div className="bg-white rounded-2xl px-4 pt-3 pb-4 mb-2">
            <div className="text-[11px] font-bold text-primary uppercase tracking-wide mb-[6px]">From</div>
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-[#aaa] flex-shrink-0" />
              <input
                className="flex-1 text-[14px] text-primary font-body outline-none border-none bg-transparent placeholder:text-[#aaa]"
                placeholder="Enter a pickup location"
                value={from}
                onChange={e => setFrom(e.target.value)}
              />
            </div>
          </div>

          {/* To */}
          {tab === 'transfer' && (
            <div className="bg-white rounded-2xl px-4 pt-3 pb-4 mb-2">
              <div className="text-[11px] font-bold text-primary uppercase tracking-wide mb-[6px]">To</div>
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-[#aaa] flex-shrink-0" />
                <input
                  className="flex-1 text-[14px] text-primary font-body outline-none border-none bg-transparent placeholder:text-[#aaa]"
                  placeholder="Enter a dropoff location"
                  value={to}
                  onChange={e => setTo(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Pickup date & time */}
          <div className="bg-white rounded-2xl px-4 pt-3 pb-4 mb-2">
            <div className="text-[11px] font-bold text-primary uppercase tracking-wide mb-[6px]">Pickup Date &amp; Time</div>
            <DateTimePicker
              value={datetime}
              onChange={handlePickupChange}
              min={minNow}
              placeholder="Select pickup date & time"
            />
          </div>

          {/* Return date & time */}
          {tab === 'transfer' && showReturn && (
            <div className="bg-white rounded-2xl px-4 pt-3 pb-4 mb-2">
              <div className="text-[11px] font-bold text-primary uppercase tracking-wide mb-[6px]">Return Date &amp; Time</div>
              <DateTimePicker
                value={returnDatetime}
                onChange={setReturnDatetime}
                min={datetime}
                placeholder="Select return date & time"
              />
            </div>
          )}

          {/* Add / Remove Return */}
          {tab === 'transfer' && (
            <div className="bg-white rounded-2xl px-4 py-4 mb-2 flex items-center justify-center">
              <button
                type="button"
                className="text-[15px] font-semibold text-primary cursor-pointer bg-transparent border-none font-body transition-colors hover:opacity-70"
                onClick={() => setShowReturn(v => !v)}
              >
                {showReturn ? '— Remove Return' : '+ Add Return'}
              </button>
            </div>
          )}

          {/* Check Fare */}
          <button
            type="button"
            className="w-full text-white border-none rounded-2xl py-[15px] px-6 font-semibold text-[15px] cursor-pointer font-body transition-all hover:brightness-105"
            style={{ background: '#0F172A' }}
            onClick={handleCheckFare}
          >
            Check Fare
          </button>
        </div>
      </div>

      {/* Floating stats */}
      <div className="absolute bottom-10 right-10 z-[3] flex bg-white/80 backdrop-blur-[12px] border border-[#E2E8F0] rounded-[14px] overflow-hidden max-sm:bottom-4 max-sm:right-4 max-sm:left-4 max-sm:justify-center">
        {[
          { num: '4.9★', lbl: 'Rating' },
          { num: '12k+', lbl: 'Rides'  },
          { num: '24/7', lbl: 'Support' },
        ].map((s, i) => (
          <div key={i} className={`px-[22px] py-[14px] text-center ${i < 2 ? 'border-r border-[#E2E8F0]' : ''}`}>
            <div className="font-head text-xl font-bold text-primary leading-none">{s.num}</div>
            <div className="text-[10px] text-muted mt-1 uppercase tracking-[0.8px]">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Scroll hint */}
      {/* <div className="absolute bottom-6 left-1/2 z-[3] flex flex-col items-center gap-[6px] animate-scroll-bob">
        <div className="w-[5px] h-[5px] rounded-full bg-primary/30" />
        <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, rgba(15,23,42,0.4), transparent)' }} />
      </div> */}
    </div>
  )
}
