import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Briefcase, Heart, ArrowRight } from 'lucide-react'
import type { FleetItem } from '../../types'

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
  const type = deriveType(car.name)

  // Subtle fallback bg for missing images
  const fallbackBgs = ['#EAF0EA', '#F0F5F0', '#D4E8D6', '#BDD9BF']
  const fallbackBg = fallbackBgs[index % fallbackBgs.length]

  return (
    <div
      onClick={() => navigate('/vehicles')}
      className="group bg-white rounded-[20px] overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 flex flex-col"
      style={{ boxShadow: '0 4px 20px rgba(46,64,82,0.09)' }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 48px rgba(46,64,82,0.17)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(46,64,82,0.09)' }}
    >
      {/* ── Image area ── */}
      <div className="relative overflow-hidden flex-shrink-0" style={{ height: '200px', backgroundColor: fallbackBg }}>
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
        />

        {/* Bottom fade so name is always readable */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(46,64,82,0.72) 0%, rgba(46,64,82,0.12) 50%, transparent 100%)' }}
        />

        {/* Vehicle type badge — top-left */}
        <div
          className="absolute top-3 left-3 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-[5px] rounded-full"
          style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}
        >
          {type}
        </div>

        {/* Heart button — top-right */}
        <button
          onClick={e => { e.stopPropagation(); setLiked(l => !l) }}
          aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer transition-all duration-200 hover:scale-110"
          style={{
            backgroundColor: liked ? '#2E4052' : 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <Heart size={14} fill={liked ? '#FFC857' : 'none'} stroke={liked ? '#FFC857' : '#2E4052'} />
        </button>

        {/* Car name overlaid on image */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-8">
          <h3 className="font-head text-[16px] font-bold text-white leading-tight drop-shadow-sm">
            {car.name}
          </h3>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-4 flex flex-col flex-1">

        {/* Specs row */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: '#F0F5F0', color: '#2E4052' }}
          >
            <Users size={11} /> {car.pax} Passengers
          </span>
          <span
            className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: '#F0F5F0', color: '#2E4052' }}
          >
            <Briefcase size={11} /> {car.lug} Bags
          </span>
        </div>

        {/* CTA button */}
        <button
          onClick={e => { e.stopPropagation(); navigate('/vehicles') }}
          className="group/btn w-full flex items-center justify-center gap-2 text-[13px] font-bold py-3 rounded-xl text-white border-none cursor-pointer transition-all duration-300 mt-auto"
          style={{ backgroundColor: '#2E4052' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#3A5268' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#2E4052' }}
        >
          Book Now
          <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  )
}
