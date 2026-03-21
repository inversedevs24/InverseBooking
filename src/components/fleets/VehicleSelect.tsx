import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ChevronLeft, Users, Luggage, MapPin, CalendarDays,
  Clock, Ruler, CheckCircle2, ArrowRight, Zap,
} from 'lucide-react'
import type { Vehicle, BookingState } from '../../types'

//  Data 
const vehicles: Vehicle[] = [
  {
    id: 1, name: 'Luxury SUV', model: 'Escalade / Range Rover',
    type: 'SUV', passengers: 6, luggage: 6,
    image: 'https://images.unsplash.com/photo-1616455579100-2ceaa4eb2d37?w=600&q=80',
    pricePerKm: 4.5, basePrice: 45,
    features: ['WiFi', 'Leather', 'Climate'],
    tag: 'Popular', tagColor: '#f59e0b',
  },
  {
    id: 2, name: 'Family Ride', model: 'Prado / Chrysler C4',
    type: 'Van', passengers: 7, luggage: 7,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80',
    pricePerKm: 3.2, basePrice: 35,
    features: ['Child Seats', 'USB', 'Spacious'],
    tag: 'Value', tagColor: '#10b981',
  },
  {
    id: 3, name: 'Elite Van', model: 'Mercedes V-Class',
    type: 'Van', passengers: 8, luggage: 9,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    pricePerKm: 5.2, basePrice: 55,
    features: ['Executive', 'Minibar', 'Tinted'],
    tag: 'Premium', tagColor: '#8b5cf6',
  },
  {
    id: 4, name: 'Mini Bus', model: 'Mercedes Sprinter',
    type: 'Bus', passengers: 14, luggage: 14,
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&q=80',
    pricePerKm: 6.0, basePrice: 80,
    features: ['PA System', 'Luggage Bay', 'Reclining'],
    tag: 'Group', tagColor: '#3b82f6',
  },
  {
    id: 5, name: 'Economy Sedan', model: 'Toyota Camry / Skoda',
    type: 'Sedan', passengers: 3, luggage: 3,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80',
    pricePerKm: 2.1, basePrice: 20,
    features: ['A/C', 'Clean', 'Punctual'],
    tag: 'Budget', tagColor: '#6b7280',
  },
  {
    id: 6, name: 'Business Class', model: 'BMW 7 / Mercedes S',
    type: 'Sedan', passengers: 3, luggage: 3,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80',
    pricePerKm: 7.0, basePrice: 90,
    features: ['Champagne', 'Chauffeur', 'Privacy'],
    tag: 'Ultra', tagColor: '#ec4899',
  },
]

const TEST_DISTANCE_KM = 24
const TEST_DURATION_MIN = 38

//  Helpers 
function formatDt(dt?: string) {
  if (!dt) return '—'
  return new Date(dt).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

//  Trip Summary sidebar 
function TripSummary({ booking }: { booking: BookingState }) {
  return (
    <div className="flex flex-col gap-4">

      {/* Route card */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.07)] overflow-hidden">
        {/* Header */}
        <div
          className="px-5 py-4"
          style={{ background: 'linear-gradient(135deg, #0f4c3e 0%, #1a6b5a 60%, #2d9c84 100%)' }}
        >
          <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#a7c8c2' }}>
            Trip Summary
          </div>
          {/* Route timeline */}
          <div className="flex gap-3">
            <div className="flex flex-col items-center flex-shrink-0 mt-1">
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
              <div className="w-px flex-1 my-1.5 bg-white/30" style={{ minHeight: 28 }} />
              <div className="w-2.5 h-2.5 rounded-full border-2 border-white/60" />
            </div>
            <div className="flex flex-col gap-4 flex-1 min-w-0">
              <div>
                <div className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#a7c8c2' }}>Pickup</div>
                <div className="text-[13px] font-bold text-white leading-tight">{booking.from || 'Dubai Mall'}</div>
              </div>
              <div>
                <div className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#a7c8c2' }}>Drop-off</div>
                <div className="text-[13px] font-bold text-white leading-tight">{booking.to || 'Dubai Airport (DXB)'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 divide-x divide-slate-100">
          {[
            { Icon: CalendarDays, val: formatDt(booking.datetime).split(',')[0], sub: 'Date' },
            { Icon: Ruler, val: `${TEST_DISTANCE_KM} km`, sub: 'Distance' },
            { Icon: Clock, val: `${TEST_DURATION_MIN} min`, sub: 'Est. time' },
          ].map(({ Icon, val, sub }, i) => (
            <div key={i} className="px-3 py-3 text-center">
              <Icon size={13} className="mx-auto mb-1 text-slate-400" />
              <div className="text-[12px] font-bold text-slate-700 leading-tight">{val}</div>
              <div className="text-[9px] text-slate-400 uppercase tracking-wide mt-0.5">{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Map card */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.07)] overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Route Preview</span>
        </div>
        <div className="relative h-[220px]">
          <iframe
            title="map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=55.1304931640625%2C25.0657305%2C55.4162597%2C25.2769055&layer=mapnik"
            className="w-full h-full border-none"
            style={{ filter: 'saturate(0.7) brightness(1.02)' }}
            allowFullScreen
          />
          <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.9))' }} />
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
            <MapPin size={10} style={{ color: '#0f766e' }} />
            <span className="text-[10px] font-semibold text-slate-700">Dubai, UAE</span>
          </div>
        </div>
      </div>

      {/* Info note */}
      <div
        className="rounded-2xl px-4 py-3 flex items-start gap-2.5"
        style={{ backgroundColor: '#e8eeec' }}
      >
        <Zap size={13} style={{ color: '#0f766e' }} className="flex-shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed" style={{ color: '#0f4c3e' }}>
          Prices include base fare + {TEST_DISTANCE_KM} km distance.
          Free cancellation up to 1 hour before pickup.
        </p>
      </div>
    </div>
  )
}

//  Vehicle card
function VehicleCard({
  vehicle, selected, price, onSelect,
}: {
  vehicle: Vehicle
  selected: boolean
  price: string
  onSelect: () => void
}) {
  return (
    <div
      onClick={onSelect}
      className={`group relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 ${selected
        ? 'shadow-[0_0_0_2px_#0f766e,0_8px_24px_rgba(15,118,110,0.15)]'
        : 'shadow-[0_2px_12px_rgba(15,23,42,0.07)] hover:shadow-[0_4px_20px_rgba(15,23,42,0.12)] hover:-translate-y-0.5'
        }`}
    >
      {/* Selected ring accent */}
      {selected && (
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundColor: '#0f766e' }} />
      )}

      <div className="flex items-stretch">
        {/* Image */}
        <div className="w-[110px] sm:w-[130px] flex-shrink-0 relative overflow-hidden">
          <img
            src={vehicle.image} alt={vehicle.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.06]"
            style={{ minHeight: 90 }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to right, transparent 60%, rgba(255,255,255,0.1))' }} />
        </div>

        {/* Info */}
        <div className="flex-1 px-4 py-3 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <div className="text-[14px] font-bold text-slate-800 font-head leading-tight truncate">{vehicle.name}</div>
              <div className="text-[11px] text-slate-400 mt-0.5 truncate">{vehicle.model}</div>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="text-[18px] font-bold font-head leading-tight" style={{ color: '#0f4c3e' }}>
                ${price}
              </div>
              <div className="text-[9px] text-slate-400 mt-0.5">est. total</div>
            </div>
          </div>

          {/* Pax + luggage + features */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              <Users size={9} />{vehicle.passengers}
            </span>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              <Luggage size={9} />{vehicle.luggage}
            </span>
            {vehicle.features.slice(0, 2).map(f => (
              <span
                key={f}
                className="text-[9px] font-semibold px-2 py-0.5 rounded-full border"
                style={{ color: '#0f766e', backgroundColor: '#e8eeec', borderColor: '#c8dbd8' }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Right arrow / check */}
        <div className={`flex items-center px-3 flex-shrink-0 transition-colors ${selected ? '' : 'text-slate-300 group-hover:text-slate-400'
          }`}>
          {selected
            ? <CheckCircle2 size={20} style={{ color: '#0f766e' }} />
            : <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          }
        </div>
      </div>
    </div>
  )
}

//  Main page 
export default function VehicleSelect() {
  const navigate = useNavigate()
  const location = useLocation()
  const booking: BookingState = location.state || {
    from: 'Dubai Mall', to: 'Dubai Airport (DXB)',
    datetime: '2026-02-27T15:12', type: 'transfer',
  }

  const [selected, setSelected] = useState<number | null>(null)
  const [showSummary, setShowSummary] = useState(false) // mobile summary toggle

  const getPrice = (v: Vehicle) =>
    (v.basePrice + TEST_DISTANCE_KM * v.pricePerKm).toFixed(0)

  const handleSelect = (v: Vehicle) => {
    setSelected(v.id)
    setTimeout(() => {
      navigate('/booking-details', {
        state: {
          ...booking, vehicle: v,
          price: getPrice(v),
          distance: TEST_DISTANCE_KM,
          duration: TEST_DURATION_MIN,
        },
      })
    }, 300)
  }

  return (
    <div className="min-h-screen font-body" style={{ backgroundColor: '#f0f5f4' }}>

      {/*  Top bar  */}
      <div className="bg-white border-b border-slate-100 shadow-[0_1px_4px_rgba(15,23,42,0.06)] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-2 sm:gap-3">
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 sm:gap-1.5 text-[12px] font-semibold text-slate-500 hover:text-slate-800 transition-colors px-2 sm:px-3 py-1.5 rounded-xl hover:bg-slate-100 flex-shrink-0"
          >
            <ChevronLeft size={15} />
            <span className="hidden xs:inline">Back</span>
          </button>

          <div className="w-px h-5 bg-slate-200 flex-shrink-0" />

          {/* Title — truncate so it never pushes the button off screen */}
          <h1 className="font-head font-bold text-slate-800 text-[14px] sm:text-[16px] truncate min-w-0">
            Choose Your Vehicle
          </h1>

          {/* Spacer pushes right-side items to the end */}
          <div className="flex-1" />

          <span className="text-[11px] text-slate-400 hidden sm:block flex-shrink-0 whitespace-nowrap">
            {vehicles.length} options
          </span>

          {/* Trip summary toggle — mobile & tablet */}
          <button
            className="lg:hidden flex items-center gap-1.5 text-[12px] font-semibold rounded-xl px-2.5 sm:px-3 py-1.5 transition-colors flex-shrink-0 whitespace-nowrap"
            style={showSummary
              ? { backgroundColor: '#0f4c3e', color: 'white' }
              : { backgroundColor: '#e8eeec', color: '#0f4c3e' }
            }
            onClick={() => setShowSummary(v => !v)}
          >
            <MapPin size={13} />
            <span className="hidden sm:inline">{showSummary ? 'Hide' : 'Trip'} Summary</span>
          </button>
        </div>
      </div>

      {/*  Mobile trip summary (collapsible)  */}
      {showSummary && (
        <div className="lg:hidden px-4 pt-4 pb-2">
          <TripSummary booking={booking} />
        </div>
      )}

      {/*  Body  */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6 items-start">

          {/* Vehicle list — takes full width on mobile, left col on lg */}
          <div className="flex-1 min-w-0">
            {/* Section label */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Available Vehicles
              </p>
              <span className="text-[11px] text-slate-400">{vehicles.length} results</span>
            </div>

            <div className="flex flex-col gap-3">
              {vehicles.map(v => (
                <VehicleCard
                  key={v.id}
                  vehicle={v}
                  selected={selected === v.id}
                  price={getPrice(v)}
                  onSelect={() => handleSelect(v)}
                />
              ))}
            </div>
          </div>

          {/* Trip summary — desktop sticky sidebar */}
          <div className="hidden lg:block w-[320px] xl:w-[340px] flex-shrink-0 sticky top-[72px]">
            <TripSummary booking={booking} />
          </div>

        </div>
      </div>
    </div>
  )
}
