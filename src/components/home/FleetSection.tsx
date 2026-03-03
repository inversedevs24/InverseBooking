import { CheckCircle } from 'lucide-react'
import FleetCard from '../ui/FleetCard'
import { FLEET_HOME, TRUST_BADGES } from '../../data'

export default function FleetSection() {
  return (
    <div className="bg-primary py-10 md:py-[60px]">
      <div className="max-w-container mx-auto px-6">
        <h2 className="font-head text-heading text-white text-center mb-2">Our Fleet</h2>
        <p className="text-center text-white/60 text-span mb-10">
          From Economy to Luxury — clean, comfortable cars for every ride.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FLEET_HOME.map((car, i) => (
            <FleetCard car={car} key={i} />
          ))}
        </div>

        <div className="flex gap-[10px] justify-center mt-6 flex-wrap">
          {TRUST_BADGES.map((b, i) => (
            <div key={i} className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-label font-medium">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: b.color }} />
              {b.label}
            </div>
          ))}
        </div>

        <div className="text-center mt-4 text-secondary text-label flex items-center justify-center gap-1">
          <CheckCircle size={14} /> Licensed Vehicles
        </div>
      </div>
    </div>
  )
}
