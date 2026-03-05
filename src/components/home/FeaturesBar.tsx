import { RotateCcw, Plane, ShieldCheck, Clock } from 'lucide-react'
import { FEATURES } from '../../data'

const ICONS = [
  <RotateCcw size={20} />,
  <Plane     size={20} />,
  <ShieldCheck size={20} />,
  <Clock     size={20} />,
]

export default function FeaturesBar() {
  return (
    <section className="py-10 md:py-[60px]">
      <div className="max-w-container mx-auto px-6">

        <p className="text-[11px] font-bold text-secondary uppercase tracking-widest mb-2 text-center">
          Why Ride With Us
        </p>
        <h2 className="font-head text-heading text-primary text-center leading-none mb-10">
          Built Around You
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(15,23,42,0.07)] flex items-start gap-4"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-secondary flex-shrink-0"
                style={{ backgroundColor: '#d5e0de' }}
              >
                {ICONS[i]}
              </div>
              <div>
                <h4 className="text-[15px] font-bold font-head text-primary leading-tight">{f.title}</h4>
                <p className="text-[13px] text-muted font-body mt-1 leading-snug">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
