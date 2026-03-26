import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Briefcase, Heart } from 'lucide-react'
import type { FleetItem } from '../../types'

const GRADIENTS = [
  'linear-gradient(135deg, #EAF0EA, #BDD9BF)',
  'linear-gradient(135deg, #F0F5F0, #D4E8D6)',
  'linear-gradient(135deg, #BDD9BF, #A8C9AA)',
  'linear-gradient(135deg, #D4E8D6, #EAF0EA)',
]

function deriveType(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('suv')) return 'SUV'
  if (n.includes('van')) return 'Van'
  if (n.includes('bus')) return 'Bus'
  if (n.includes('family')) return 'MPV'
  return 'Sedan'
}

export default function FleetCard({ car, index = 0 }: { car: FleetItem; index?: number }) {
  const navigate = useNavigate()
  const [liked, setLiked] = useState(false)

  return (
    <div
      className="bg-white overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[0_12px_36px_rgba(0,0,0,0.13)]"
      style={{ borderRadius: '20px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
    >
      {/* Image area */}
      <div className="relative overflow-hidden" style={{ height: '150px', background: GRADIENTS[index % GRADIENTS.length] }}>
        <button
          onClick={e => { e.stopPropagation(); setLiked(l => !l) }}
          className="absolute top-3 right-3 z-10 bg-white border-none rounded-full flex items-center justify-center cursor-pointer"
          style={{ width: '32px', height: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        >
          <Heart size={16} fill={liked ? '#ef4444' : 'none'} stroke={liked ? '#ef4444' : '#9ca3af'} />
        </button>
        <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-1 font-body">
          {deriveType(car.name)}
        </p>
        <h3 className="font-head text-[17px] font-extrabold text-primary mb-3">{car.name}</h3>

        {/* Specs */}
        <div className="flex gap-3 mb-4">
          <span className="flex items-center gap-1 text-[11px] font-semibold text-muted font-body">
            <Users size={14} /> {car.pax} People
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-muted font-body">
            <Briefcase size={14} /> {car.lug} Bags
          </span>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate('/vehicles')}
          className="w-full text-white border-none text-[13px] font-bold cursor-pointer hover:opacity-85 transition-opacity duration-200 font-body"
          style={{ background: 'linear-gradient(135deg, #2E4052, #3A5268)', borderRadius: '12px', padding: '9px 18px' }}
        >
          Rent Now
        </button>
      </div>
    </div>
  )
}
