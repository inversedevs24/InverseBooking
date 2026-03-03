import { useNavigate } from 'react-router-dom'
import { Award, Clock, MapPin, Zap } from 'lucide-react'

const FEATURES = [
  { icon: <Award size={18} />, text: 'Luxury & Comfort Fleet' },
  { icon: <Clock size={18} />, text: '24/7 Service & Support' },
  { icon: <MapPin size={18} />, text: 'Go Anywhere, Stop Anywhere' },
  { icon: <Zap size={18} />, text: 'Simple & Fast Booking' },
]

const GALLERY = [
  { label: 'Professional Chauffeurs', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80' },
  { label: 'Premium Vehicles',        image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&q=80' },
  { label: 'Free Waiting',            image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80' },
  { label: 'Timely Pickup',           image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80' },
]

export default function ChauffeurSection() {
  const navigate = useNavigate()

  return (
    <section className="py-10 md:py-[60px]">
      <div className="max-w-container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Image grid */}
          <div className="grid grid-cols-2 gap-3">
            <img
              src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80"
              alt="Chauffeur"
              className="w-full h-[160px] object-cover rounded-xl"
            />
            <div className="bg-primary rounded-xl p-4 flex flex-col justify-center">
              <div className="font-head text-label font-bold text-white mb-[6px]">Chauffeur Transfer</div>
              <div className="text-[11px] text-white/70 mb-[10px]">
                Effortlessly book your City-to-City, Airport, or Local Transfer with us.
              </div>
              <button
                className="bg-secondary text-white border-none rounded-lg px-[14px] py-[7px] text-[11px] font-semibold cursor-pointer font-body transition-colors hover:bg-secondary/80 self-start"
                onClick={() => navigate('/signin')}
              >
                Check Fare
              </button>
            </div>

            {GALLERY.map((item, i) => (
              <div key={i} className="rounded-[10px] overflow-hidden relative h-[100px] bg-secondaryBg flex items-end p-2">
                <div
                  className="absolute inset-0 bg-cover bg-center brightness-[0.6]"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <span className="relative text-white text-[11px] font-semibold">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Text */}
          <div>
            <h2 className="font-head text-title mb-3">Hourly Chauffeur</h2>
            <p className="text-muted mb-5">
              Hire a vehicle with a professional driver based on time. Suitable for errands, business meetings, or events.
            </p>
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-secondaryBg flex items-center justify-center text-secondary flex-shrink-0">
                  {f.icon}
                </div>
                <span className="text-label">{f.text}</span>
              </div>
            ))}
            <button
              className="mt-2 bg-primary text-white border-none rounded-lg px-7 py-3 font-semibold text-label cursor-pointer font-body transition-colors hover:bg-secondary"
              onClick={() => navigate('/signin')}
            >
              Check Fare
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
