import { useEffect, useRef } from 'react'

export interface PlaceResult {
  address: string
  coords: { lat: number; lng: number } | null
}

interface PlacesInputProps {
  placeholder: string
  className: string
  mapsReady: boolean
  onPlaceChange: (result: PlaceResult) => void
}

export function PlacesInput({ placeholder, className, mapsReady, onPlaceChange }: PlacesInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const acRef = useRef<google.maps.places.Autocomplete | null>(null)
  const justSelected = useRef(false)

  useEffect(() => {
    if (!mapsReady || !inputRef.current || acRef.current) return
    const maps = (window as any).google?.maps
    if (!maps?.places?.Autocomplete) return

    const ac = new maps.places.Autocomplete(inputRef.current, {
      types: ['geocode', 'establishment'],
      componentRestrictions: { country: 'ae' }
    }) as google.maps.places.Autocomplete

    acRef.current = ac

    const listener = ac.addListener('place_changed', () => {
      const place = ac.getPlace()
      justSelected.current = true
      const address = place.formatted_address ?? place.name ?? inputRef.current?.value ?? ''
      const loc = place.geometry?.location
      onPlaceChange({
        address,
        coords: loc ? { lat: loc.lat(), lng: loc.lng() } : null,
      })
    })

    return () => {
      maps.event?.removeListener(listener)
    }
  }, [mapsReady])

  return (
    <input
      ref={inputRef}
      className={className}
      placeholder={placeholder}
      onChange={e => {
        if (justSelected.current) {
          justSelected.current = false
          return
        }
        onPlaceChange({ address: e.target.value, coords: null })
      }}
    />
  )
}
