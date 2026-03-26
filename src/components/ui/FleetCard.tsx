import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Briefcase, Heart, ArrowRight, Car } from 'lucide-react'
import type { FleetItem } from '../../types'

function deriveCategory(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('executive') || n.includes('luxury')) return 'Executive'
  if (n.includes('suv') || n.includes('4x4')) return 'SUV'
  if (n.includes('van') || n.includes('minivan')) return 'Van'
  if (n.includes('bus') || n.includes('coach')) return 'Coach'
  if (n.includes('mpv') || n.includes('family')) return 'MPV'
  return 'Sedan'
}

export default function FleetCard({ car, index = 0 }: { car: FleetItem; index?: number }) {
  const navigate = useNavigate()
  const [liked, setLiked] = useState(false)
  const category = deriveCategory(car.name)

  return (
    <div
      onClick={() => navigate('/vehicles')}
      className="group relative bg-white rounded-[20px] overflow-hidden cursor-pointer flex flex-col"
      style={{ boxShadow: '0 2px 16px rgba(46,64,82,0.08)', transition: 'transform 0.25s ease, box-shadow 0.25s ease' }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.boxShadow = '0 20px 52px rgba(46,64,82,0.18)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 16px rgba(46,64,82,0.08)'
      }}
    >
      {/* ── Image ── */}
      <div className="relative overflow-hidden flex-shrink-0" style={{ height: 220, backgroundColor: '#EAF0EA' }}>
        {car.image ? (
          <img
            src={car.image}
            alt={car.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.07]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Car size={40} style={{ color: '#BDD9BF' }} />
          </div>
        )}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(46,64,82,0.82) 0%, rgba(46,64,82,0.18) 48%, transparent 100%)' }}
        />

        {/* Category badge */}
        <div
          className="absolute top-3 left-3 text-[10px] font-extrabold uppercase tracking-widest px-3 py-[5px] rounded-full"
          style={{ backgroundColor: '#BDD9BF', color: '#2E4052' }}
        >
          {category}
        </div>

        {/* Heart wishlist button */}
        <button
          onClick={e => { e.stopPropagation(); setLiked(l => !l) }}
          aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer"
          style={{
            backgroundColor: liked ? '#2E4052' : 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            transition: 'background-color 0.2s ease, transform 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.12)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
        >
          <Heart size={15} fill={liked ? '#FFC857' : 'none'} stroke={liked ? '#FFC857' : '#2E4052'} />
        </button>

        {/* Name + model overlaid at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-10">
          <h3 className="font-head text-[17px] font-bold text-white leading-tight drop-shadow">
            {car.name}
          </h3>
          {car.models && (
            <p className="text-[11px] mt-0.5 font-body" style={{ color: 'rgba(255,255,255,0.72)' }}>
              {car.models}
            </p>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-4 flex flex-col flex-1 gap-3">

        {/* Specs row */}
        <div className="flex items-center gap-2">
          <span
            className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full"
            style={{ backgroundColor: '#F0F5F0', color: '#2E4052' }}
          >
            <Users size={11} /> {car.pax} Passengers
          </span>
          <span
            className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full"
            style={{ backgroundColor: '#F0F5F0', color: '#2E4052' }}
          >
            <Briefcase size={11} /> {car.lug} Bags
          </span>
        </div>

        {/* Divider */}
        <div className="border-t" style={{ borderColor: 'rgba(46,64,82,0.08)' }} />

        {/* CTA */}
        <button
          onClick={e => { e.stopPropagation(); navigate('/vehicles') }}
          className="w-full flex items-center justify-center gap-2 text-[13px] font-bold py-3 rounded-xl border-none cursor-pointer text-white mt-auto"
          style={{ backgroundColor: '#2E4052', transition: 'background-color 0.2s ease' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#3A5268' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#2E4052' }}
        >
          Book Now
          <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  )
}
