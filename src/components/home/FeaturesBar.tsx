import { RotateCcw, Plane, ShieldCheck, Clock } from 'lucide-react'
import { FEATURES } from '../../data'

const FEATURE_ICONS = [
  <RotateCcw size={18} />,
  <Plane size={18} />,
  <ShieldCheck size={18} />,
  <Clock size={18} />,
]

export default function FeaturesBar() {
  return (
    <div className="max-w-container mx-auto px-6 mb-12">
      <div className="bg-secondaryBg rounded-card px-8 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURES.map((f, i) => (
          <div className="flex items-start gap-[14px]" key={i}>
            <div className="w-11 h-11 bg-white rounded-[10px] flex items-center justify-center text-secondary flex-shrink-0">
              {FEATURE_ICONS[i]}
            </div>
            <div>
              <h4 className="text-label font-semibold text-primary">{f.title}</h4>
              <p className="text-[11px] text-muted mt-[2px]">{f.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
