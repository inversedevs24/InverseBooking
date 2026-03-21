import { useNavigate } from 'react-router-dom'
import { Award, Clock, MapPin, Zap } from 'lucide-react'

const FEATURES = [
  { icon: <Award size={18} />, text: 'Luxury & Comfort Fleet' },
  { icon: <Clock size={18} />, text: '24/7 Service & Support' },
  { icon: <MapPin size={18} />, text: 'Go Anywhere, Stop Anywhere' },
  { icon: <Zap size={18} />, text: 'Simple & Fast Booking' },
]

export default function ChauffeurSection() {
  const navigate = useNavigate()

  return (
    <section className="py-10 md:py-[60px]">
      <div className="max-w-container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

          {/* Left — single image */}
          <div className="rounded-2xl overflow-hidden min-h-[300px] md:h-[460px]">
            <img
              src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80"
              alt="Professional chauffeur"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right — text content */}
          <div>
            <p className="text-[11px] font-bold text-secondary uppercase tracking-widest mb-2">Hourly Hire</p>
            <h2 className="font-head text-heading text-primary leading-none mb-3">
              Hourly Chauffeur
            </h2>
            <p className="text-[14px] text-muted font-body leading-relaxed mb-6">
              Hire a vehicle with a professional driver based on time. Suitable for errands, business meetings, or events.
            </p>

            <div className="flex flex-col gap-2 mb-7">
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-[0_2px_8px_rgba(15,23,42,0.06)]"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-secondary flex-shrink-0"
                    style={{ backgroundColor: '#d5e0de' }}
                  >
                    {f.icon}
                  </div>
                  <span className="text-[14px] font-medium text-primary font-body">{f.text}</span>
                </div>
              ))}
            </div>

            <button
              className="group relative overflow-hidden text-white border-none rounded-2xl py-[15px] px-8 font-semibold text-[15px] cursor-pointer font-body transition-colors duration-300 hover:text-white"
              style={{ background: '#0F172A' }}
              onClick={() => navigate('/book?service=hourly')}
            >
              <span className="absolute inset-0 bg-secondary -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
              <span className="relative z-10">Check Fare</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}