import { useState } from 'react'
import type { AllFleetItem } from '../../types'

const fleetData: AllFleetItem[] = [
  { id: 1, name: 'Cadillac Escalade',     type: 'SUV', image: 'https://images.unsplash.com/photo-1616455579100-2ceaa4eb2d37?w=400&q=80', passengers: 6,  luggage: 6,  tag: 'Most Popular', tagColor: '#f59e0b', features: ['WiFi', 'Leather Seats', 'Climate Control'],      pricePerHour: 85,  pricePerDay: 550 },
  { id: 2, name: 'GMC Yukon',             type: 'SUV', image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&q=80', passengers: 7,  luggage: 7,  tag: 'Spacious',     tagColor: '#f59e0b', features: ['Sunroof', 'Heated Seats', 'Tow Package'],           pricePerHour: 75,  pricePerDay: 490 },
  { id: 3, name: 'Range Rover Vogue',     type: 'SUV', image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&q=80', passengers: 5,  luggage: 5,  tag: 'Luxury',       tagColor: '#8b5cf6', features: ['Meridian Sound', 'Air Suspension', 'Panoramic Roof'], pricePerHour: 110, pricePerDay: 720 },
  { id: 4, name: 'Toyota Prado',          type: 'SUV', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80', passengers: 7,  luggage: 6,  tag: 'Best Value',   tagColor: '#10b981', features: ['4WD', 'USB Charging', 'Child Seats'],                pricePerHour: 65,  pricePerDay: 420 },
  { id: 5, name: 'Mercedes-Benz V-Class', type: 'Van', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', passengers: 7,  luggage: 9,  tag: 'Premium',      tagColor: '#8b5cf6', features: ['Executive Seats', 'Tinted Windows', 'Minibar'],      pricePerHour: 95,  pricePerDay: 620 },
  { id: 6, name: 'Chrysler Grand C4',     type: 'Van', image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&q=80', passengers: 6,  luggage: 6,  tag: 'Family Pick',  tagColor: '#10b981', features: ['Sliding Doors', 'Extra Legroom', 'Entertainment'],    pricePerHour: 60,  pricePerDay: 390 },
  { id: 7, name: 'Mercedes-Benz Sprinter',type: 'Bus', image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&q=80', passengers: 14, luggage: 14, tag: 'Group Travel', tagColor: '#3b82f6', features: ['PA System', 'Luggage Bay', 'Reclining Seats'],        pricePerHour: 120, pricePerDay: 780 },
  { id: 8, name: 'Ford Transit Bus',      type: 'Bus', image: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=400&q=80', passengers: 12, luggage: 10, tag: 'Affordable',   tagColor: '#10b981', features: ['Air Conditioning', 'USB Ports', 'Large Windows'],     pricePerHour: 95,  pricePerDay: 620 },
]

const BADGE_LIST = [
  { label: 'Secure Travel',           color: '#CBA135' },
  { label: 'Door to Door',            color: '#CBA135' },
  { label: 'Extra Free Waiting Time', color: '#3b82f6' },
  { label: 'Free Cancellation',       color: '#CBA135' },
]

const FILTERS = [
  { label: 'All', emoji: '🚗' },
  { label: 'SUV', emoji: '🚙' },
  { label: 'Van', emoji: '🚐' },
  { label: 'Bus', emoji: '🚌' },
]

export default function AllFleets() {
  const [hovered, setHovered] = useState<number | null>(null)
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = activeFilter === 'All' ? fleetData : fleetData.filter(f => f.type === activeFilter)

  return (
    <section className="relative bg-[#1a3028] min-h-screen py-16 px-5 overflow-hidden font-body">
      {/* Subtle bg radial overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(203,161,53,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(203,161,53,0.05) 0%, transparent 50%)' }}
      />

      <div className="relative max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="text-center mb-7">
          <h2 className="font-head font-extrabold text-white tracking-[-1px] mb-[10px] text-[clamp(28px,4vw,46px)]">
            Our Fleet
          </h2>
          <p className="text-label text-white/50 max-w-[460px] mx-auto leading-[1.6]">
            From Economy to Luxury — clean, comfortable vehicles for every ride.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex justify-center gap-[10px] mb-8 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f.label}
              onClick={() => setActiveFilter(f.label)}
              className={`px-[22px] py-2 rounded-full border text-label font-semibold cursor-pointer font-body transition-all ${
                activeFilter === f.label
                  ? 'bg-secondary border-secondary text-white shadow-[0_0_16px_rgba(203,161,53,0.4)]'
                  : 'bg-white/[0.06] border-white/15 text-white/65 hover:bg-white/10'
              }`}
            >
              {f.emoji} {f.label}
            </button>
          ))}
        </div>

        {/* Fleet grid */}
        <div className="grid gap-[18px] mb-11" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))' }}>
          {filtered.map(fleet => {
            const isHovered = hovered === fleet.id
            return (
              <div
                key={fleet.id}
                className={`bg-white rounded-[14px] cursor-pointer transition-all border-2 overflow-hidden ${
                  isHovered
                    ? '-translate-y-[5px] shadow-[0_20px_50px_rgba(0,0,0,0.35)] border-secondary'
                    : 'border-transparent'
                }`}
                onMouseEnter={() => setHovered(fleet.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Image */}
                <div className="relative h-[150px] overflow-hidden bg-gray-100">
                  <img
                    src={fleet.image}
                    alt={fleet.name}
                    className={`w-full h-full object-cover transition-transform duration-[400ms] ${isHovered ? 'scale-[1.07]' : 'scale-100'}`}
                  />
                  <div
                    className="absolute top-[10px] left-[10px] text-[10px] font-bold px-[9px] py-[3px] rounded-full tracking-wide uppercase text-white"
                    style={{ backgroundColor: fleet.tagColor + 'ee' }}
                  >
                    {fleet.tag}
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/55 text-white text-[10px] font-bold px-2 py-[3px] rounded-lg uppercase tracking-wide backdrop-blur-sm">
                    {fleet.type}
                  </span>
                </div>

                {/* Info */}
                <div className="p-[14px]">
                  <h3 className="font-head text-label font-bold text-[#0f1f19] mb-[7px]">{fleet.name}</h3>

                  <div className="flex items-center gap-[6px] mb-[9px]">
                    <span className="text-[11px] font-semibold text-gray-700 bg-gray-100 px-2 py-[2px] rounded-full">
                      👥 {fleet.passengers} pax
                    </span>
                    <span className="text-[10px] text-gray-300">•</span>
                    <span className="text-[11px] font-semibold text-gray-700 bg-gray-100 px-2 py-[2px] rounded-full">
                      🧳 {fleet.luggage} bags
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-[10px]">
                    {fleet.features.map(f => (
                      <span key={f} className="text-[10px] text-[#1a3028] bg-secondary/[0.12] border border-secondary/25 px-[7px] py-[2px] rounded-[10px] font-medium">
                        {f}
                      </span>
                    ))}
                  </div>

                  <div className="h-px bg-gray-200 mb-[10px]" />

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wide">From</div>
                      <div className="font-head text-[19px] font-bold text-[#0f1f19]">
                        ${fleet.pricePerHour}<span className="text-[11px] font-medium text-gray-500">/hr</span>
                      </div>
                    </div>
                    <button
                      className={`px-4 py-[7px] rounded-[10px] border-2 border-secondary text-[11px] font-semibold cursor-pointer transition-all ${
                        isHovered ? 'bg-secondary text-white' : 'bg-transparent text-secondary'
                      }`}
                    >
                      Book →
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom badges */}
        <div className="flex justify-center flex-wrap gap-[10px] mb-4">
          {BADGE_LIST.map(b => (
            <div
              key={b.label}
              className="flex items-center gap-2 bg-white/[0.08] border border-white/[0.12] rounded-full px-4 py-[7px]"
            >
              <span
                className="w-[7px] h-[7px] rounded-full flex-shrink-0"
                style={{ backgroundColor: b.color, boxShadow: `0 0 6px ${b.color}` }}
              />
              <span className="text-[11px] text-white/75 font-medium">{b.label}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center gap-2">
          <span>✅</span>
          <span className="text-label text-secondary font-semibold">Licensed Vehicles</span>
        </div>
      </div>
    </section>
  )
}
