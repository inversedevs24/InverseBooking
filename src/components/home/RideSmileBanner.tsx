import { useNavigate } from 'react-router-dom'
import { brandName } from '../../env'

const STATS = [
  { num: '4.9★', lbl: 'Rating'  },
  { num: '12k+', lbl: 'Rides'   },
  { num: '24/7', lbl: 'Support' },
]

export default function RideSmileBanner() {
  const navigate = useNavigate()

  return (
    <section className="py-10 md:py-[60px]">
      <div className="max-w-container mx-auto px-6">
        <div className="relative rounded-2xl overflow-hidden px-8 md:px-14 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-10"
          style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E2D3D 100%)' }}
        >
          {/* Decorative rings */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-30" style={{ backgroundColor: '#FFC857' }} />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full opacity-20" style={{ backgroundColor: '#FFC857' }} />

          {/* Left — headline */}
          <div className="relative z-10">
            <p className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: '#FFC857' }}>
              Premium Ride Service · UAE
            </p>
            <div className="font-head font-extrabold leading-none mb-4">
              <div className="text-[44px] md:text-[60px] text-white">RIDE.</div>
              <div className="text-[44px] md:text-[60px] text-white">SMILE.</div>
              <div className="text-[44px] md:text-[60px]" style={{ color: '#FFC857' }}>REPEAT.</div>
            </div>
            <p className="text-[14px] text-white/80 font-body max-w-[300px] leading-relaxed">
              Premium transfers, professional drivers, unforgettable rides across UAE with {brandName}.
            </p>
          </div>

          {/* Right — CTA + stats */}
          <div className="relative z-10 flex flex-col gap-7 md:items-end">
            <button
              onClick={() => navigate('/book')}
              className="border-none rounded-2xl py-[15px] px-10 font-semibold text-[15px] cursor-pointer font-body self-start md:self-auto transition-opacity hover:opacity-90"
              style={{ background: '#ffffff', color: '#0F172A' }}
            >
              Book Now
            </button>

            <div className="flex gap-6">
              {STATS.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="font-head text-[20px] font-bold text-white leading-none">{s.num}</div>
                  <div className="text-[11px] text-white/70 uppercase tracking-wide mt-1">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
