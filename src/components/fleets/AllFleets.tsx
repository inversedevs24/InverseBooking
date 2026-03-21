import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Luggage } from 'lucide-react'
import type { AllFleetItem } from '../../types'

//  Data 
const fleetData: AllFleetItem[] = [
  { id: 1, name: 'Cadillac Escalade', type: 'SUV', image: 'https://images.unsplash.com/photo-1616455579100-2ceaa4eb2d37?w=600&q=80', passengers: 6, luggage: 6, tag: 'Most Popular', tagColor: '#f59e0b', features: ['WiFi', 'Leather Seats', 'Climate Control'], pricePerHour: 85, pricePerDay: 550 },
  { id: 2, name: 'GMC Yukon', type: 'SUV', image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80', passengers: 7, luggage: 7, tag: 'Spacious', tagColor: '#f59e0b', features: ['Sunroof', 'Heated Seats', 'Tow Package'], pricePerHour: 75, pricePerDay: 490 },
  { id: 3, name: 'Range Rover Vogue', type: 'SUV', image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&q=80', passengers: 5, luggage: 5, tag: 'Luxury', tagColor: '#8b5cf6', features: ['Meridian Sound', 'Air Suspension', 'Panoramic Roof'], pricePerHour: 110, pricePerDay: 720 },
  { id: 4, name: 'Toyota Prado', type: 'SUV', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80', passengers: 7, luggage: 6, tag: 'Best Value', tagColor: '#10b981', features: ['4WD', 'USB Charging', 'Child Seats'], pricePerHour: 65, pricePerDay: 420 },
  { id: 5, name: 'Mercedes-Benz V-Class', type: 'Van', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', passengers: 7, luggage: 9, tag: 'Premium', tagColor: '#8b5cf6', features: ['Executive Seats', 'Tinted Windows', 'Minibar'], pricePerHour: 95, pricePerDay: 620 },
  { id: 6, name: 'Chrysler Grand C4', type: 'Van', image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80', passengers: 6, luggage: 6, tag: 'Family Pick', tagColor: '#10b981', features: ['Sliding Doors', 'Extra Legroom', 'Entertainment'], pricePerHour: 60, pricePerDay: 390 },
  { id: 7, name: 'Mercedes-Benz Sprinter', type: 'Bus', image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&q=80', passengers: 14, luggage: 14, tag: 'Group Travel', tagColor: '#3b82f6', features: ['PA System', 'Luggage Bay', 'Reclining Seats'], pricePerHour: 120, pricePerDay: 780 },
  { id: 8, name: 'Ford Transit Bus', type: 'Bus', image: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=600&q=80', passengers: 12, luggage: 10, tag: 'Affordable', tagColor: '#10b981', features: ['Air Conditioning', 'USB Ports', 'Large Windows'], pricePerHour: 95, pricePerDay: 620 },
]

const FILTERS = [
  { label: 'All' },
  { label: 'SUV' },
  { label: 'Van' },
  { label: 'Bus' },
]

//  Fleet card 
function FleetCard({ fleet }: { fleet: AllFleetItem }) {
  const navigate = useNavigate()
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(15,23,42,0.07)] group hover:shadow-[0_6px_24px_rgba(15,23,42,0.12)] hover:-translate-y-1 transition-all duration-200 flex flex-col">
      {/* Image */}
      <div className="relative h-[160px] overflow-hidden bg-slate-100 flex-shrink-0">
        <img
          src={fleet.image}
          alt={fleet.name}
          className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-[1.06]"
        />
        {/* Type badge */}
        <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wide backdrop-blur-sm">
          {fleet.type}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-head text-[14px] font-bold text-slate-800 mb-2.5 leading-tight">{fleet.name}</h3>

        {/* Pax + luggage */}
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            <Users size={10} />{fleet.passengers} pax
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            <Luggage size={10} />{fleet.luggage} bags
          </span>
        </div>

        {/* Feature chips */}
        <div className="flex flex-wrap gap-1 mb-3">
          {fleet.features.map(f => (
            <span
              key={f}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
              style={{ color: '#0f766e', backgroundColor: '#e8eeec', borderColor: '#c8dbd8' }}
            >
              {f}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 mt-auto pt-3 flex items-center justify-between">
          <div>
            <div className="text-[9px] text-slate-400 uppercase tracking-widest">From</div>
            <div className="font-head text-[18px] font-bold text-slate-800 leading-tight">
              ${fleet.pricePerHour}
              <span className="text-[11px] font-medium text-slate-400">/hr</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/book?service=transfer')}
            className="flex items-center gap-1.5 text-[12px] font-bold px-4 py-2 rounded-xl transition-all group-hover:text-white border-2 border-transparent"
            style={{
              backgroundColor: '#e8eeec',
              color: '#0f4c3e',
            }}
            onMouseEnter={e => {
              const btn = e.currentTarget
              btn.style.backgroundColor = '#0f4c3e'
              btn.style.color = '#ffffff'
            }}
            onMouseLeave={e => {
              const btn = e.currentTarget
              btn.style.backgroundColor = '#e8eeec'
              btn.style.color = '#0f4c3e'
            }}
          >
            Book →
          </button>
        </div>
      </div>
    </div>
  )
}

//  Main 
export default function AllFleets() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = activeFilter === 'All'
    ? fleetData
    : fleetData.filter(f => f.type === activeFilter)

  return (
    <section className="py-12 md:py-[30px]" style={{ backgroundColor: '#f0f5f4' }}>
      <div className="max-w-container mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-[11px] font-bold text-secondary uppercase tracking-widest mb-2">
            Ride in Comfort
          </p>
          <h2 className="font-head text-heading text-primary leading-none mb-3">
            Our Fleet
          </h2>
          <p className="text-[14px] text-muted font-body max-w-md mx-auto leading-relaxed">
            From compact sedans to spacious minibuses — clean, premium vehicles for every journey.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f.label}
              onClick={() => setActiveFilter(f.label)}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-[13px] font-semibold transition-all border ${activeFilter === f.label
                ? 'text-white border-transparent shadow-sm'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
                }`}
              style={activeFilter === f.label ? { backgroundColor: '#0f4c3e' } : {}}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Fleet grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
          {filtered.map(fleet => (
            <FleetCard key={fleet.id} fleet={fleet} />
          ))}
        </div>

      </div>
    </section>
  )
}