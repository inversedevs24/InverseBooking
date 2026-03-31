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
  const inputRef    = useRef<HTMLInputElement>(null)
  const acRef       = useRef<google.maps.places.Autocomplete | null>(null)
  const justSelected = useRef(false)

  // Always keep a current ref to the callback so the listener never calls a stale closure
  const callbackRef = useRef(onPlaceChange)
  useEffect(() => { callbackRef.current = onPlaceChange }, [onPlaceChange])

  useEffect(() => {
    if (!mapsReady || !inputRef.current || acRef.current) return
    const maps = (window as any).google?.maps
    if (!maps?.places?.Autocomplete) return

    const ac = new maps.places.Autocomplete(inputRef.current, {
      types: ['geocode', 'establishment'],
      componentRestrictions: { country: 'ae' },
    }) as google.maps.places.Autocomplete

    acRef.current = ac

    const listener = ac.addListener('place_changed', () => {
      const place = ac.getPlace()
      const loc   = place.geometry?.location

      // Prefer formatted_address → name → current input value (guaranteed non-empty)
      const address =
        place.formatted_address ??
        place.name ??
        inputRef.current?.value ??
        ''

      // Explicitly write the full address into the DOM input so the display
      // matches the value we're about to pass upstream — this is the fix for
      // the "shows Du instead of Dubai" bug where the autocomplete widget may
      // update the DOM asynchronously after place_changed fires.
      if (inputRef.current) inputRef.current.value = address

      // Mark as selected so the next synthetic onChange (triggered by the DOM
      // update above) is swallowed and doesn't overwrite state with stale text.
      justSelected.current = true

      callbackRef.current({
        address,
        coords: loc ? { lat: loc.lat(), lng: loc.lng() } : null,
      })
    })

    return () => { maps.event?.removeListener(listener) }
  }, [mapsReady])

  return (
    <input
      ref={inputRef}
      className={className}
      placeholder={placeholder}
      onChange={e => {
        if (justSelected.current) {
          // Swallow the synthetic onChange that fires after the autocomplete
          // fills the input — then re-enable for future keystrokes.
          justSelected.current = false
          return
        }
        callbackRef.current({ address: e.target.value, coords: null })
      }}
    />
  )
}
