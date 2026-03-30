import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Award, Clock, MapPin, Zap } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchChauffeurImages } from '../../store/slices/shopifySlice'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80'

const FEATURES = [
  { icon: <Award size={18} />, text: 'Luxury & Comfort Fleet' },
  { icon: <Clock size={18} />, text: '24/7 Service & Support' },
  { icon: <MapPin size={18} />, text: 'Go Anywhere, Stop Anywhere' },
  { icon: <Zap size={18} />, text: 'Simple & Fast Booking' },
]

export default function ChauffeurSection() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { chauffeurImages, chauffeurImagesInitialized } = useAppSelector(s => s.shopify)

  useEffect(() => { dispatch(fetchChauffeurImages()) }, [dispatch])

  // Use fallback until Shopify responds; only switch to fetched images once confirmed
  const images = chauffeurImagesInitialized && chauffeurImages.length > 0 ? chauffeurImages : [FALLBACK_IMAGE]
  const [activeIdx, setActiveIdx] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (images.length <= 1) return
    timerRef.current = setInterval(() => {
      setActiveIdx(i => (i + 1) % images.length)
    }, 2000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [images.length])

  return (
    <section className="py-10 md:py-[60px]">
      <div className="max-w-container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

          {/* Left — slideshow */}
          <div className="relative rounded-2xl overflow-hidden min-h-[300px] md:h-[460px]">
            {images.map((src, i) => (
              <img
                key={src}
                src={src}
                alt="Professional chauffeur"
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
                style={{ opacity: i === activeIdx ? 1 : 0 }}
              />
            ))}
          </div>

          {/* Right — text content */}
          <div>
            <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-2">Hourly Hire</p>
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
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-primary flex-shrink-0"
                    style={{ backgroundColor: '#BDD9BF' }}
                  >
                    {f.icon}
                  </div>
                  <span className="text-[14px] font-medium text-primary font-body">{f.text}</span>
                </div>
              ))}
            </div>

            <button
              className="group relative overflow-hidden text-white border-none rounded-2xl py-[15px] px-8 font-semibold text-[15px] cursor-pointer font-body transition-colors duration-300 hover:text-white"
              style={{ background: '#2E4052' }}
              onClick={() => navigate('/book?service=hourly')}
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out" style={{ backgroundColor: '#3A5268' }} />
              <span className="relative z-10">Check Fare</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}