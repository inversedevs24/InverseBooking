import { useNavigate } from 'react-router-dom'
import type { FleetItem } from '../../types'

interface FleetCardProps {
  car: FleetItem
}

export default function FleetCard({ car }: FleetCardProps) {
  const navigate = useNavigate()

  return (
    <div
      className="group bg-white rounded-card overflow-hidden cursor-pointer transition-transform hover:-translate-y-1"
      onClick={() => navigate('/fleet')}
    >
      <img
        src={car.image}
        alt={car.name}
        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="p-5">
        <div className="font-bold text-label text-primary mb-[6px]">{car.name}</div>
        <div className="flex gap-[6px] mb-[6px]">
          <span className="bg-secondaryBg text-primary/70 text-[11px] px-2 py-[2px] rounded flex items-center gap-1">
            👥 {car.pax}
          </span>
          <span className="bg-secondaryBg text-primary/70 text-[11px] px-2 py-[2px] rounded flex items-center gap-1">
            🧳 {car.lug}
          </span>
        </div>
        <div className="text-[11px] text-muted">{car.models}</div>
      </div>
    </div>
  )
}
