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
  const inputRef          = useRef<HTMLInputElement>(null)
  const acRef             = useRef<google.maps.places.Autocomplete | null>(null)
  const callbackRef       = useRef(onPlaceChange)
  // After place_changed fires, Google asynchronously fills the input with the
  // suggestion label (e.g. "Dubai Airport") which is different from the
  // formatted_address returned by getPlace() (e.g. "Dubai International Airport
  // - Terminal 1, Dubai - UAE"). That async fill triggers a native input event
  // which React picks up as onChange and resets coords to null.
  // We suppress all onChange events for 300 ms after a selection — enough to
  // absorb any Google echo while still capturing genuine user edits after that.
  const suppressRef       = useRef(false)
  const suppressTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { callbackRef.current = onPlaceChange }, [onPlaceChange])

  useEffect(() => {
    if (!mapsReady || !inputRef.current) return
    const maps = (window as any).google?.maps
    if (!maps?.places?.Autocomplete) return

    // Clear any previous instance — critical for React StrictMode which runs
    // mount→cleanup→remount in development. Without this, cleanup removes the
    // place_changed listener but leaves acRef.current set, causing the re-run
    // to bail out early via the old `if (acRef.current) return` guard, leaving
    // the Autocomplete with no listener (dropdown shows but selection does nothing).
    if (acRef.current) {
      maps.event?.clearInstanceListeners(acRef.current)
      acRef.current = null
    }

    const ac = new maps.places.Autocomplete(inputRef.current, {
      types: ['geocode', 'establishment'],
      componentRestrictions: { country: 'ae' },
      fields: ['formatted_address', 'geometry', 'name'],
    }) as google.maps.places.Autocomplete

    acRef.current = ac

    const listener = ac.addListener('place_changed', () => {
      const place = ac.getPlace()
      const loc   = place.geometry?.location

      const address =
        place.formatted_address ??
        place.name ??
        inputRef.current?.value ??
        ''

      // Write the resolved address into the DOM so the displayed value
      // matches what we pass upstream.
      if (inputRef.current) inputRef.current.value = address

      // Suppress onChange for 300 ms to absorb Google's async echo events
      // (Google fills the input after place_changed, firing extra input events
      // that would otherwise reset coords to null via the onChange handler).
      suppressRef.current = true
      if (suppressTimerRef.current) clearTimeout(suppressTimerRef.current)
      suppressTimerRef.current = setTimeout(() => { suppressRef.current = false }, 300)

      callbackRef.current({
        address,
        coords: loc ? { lat: loc.lat(), lng: loc.lng() } : null,
      })
    })

    return () => {
      maps.event?.removeListener(listener)
      acRef.current = null   // reset so StrictMode re-run re-creates with a live listener
      if (suppressTimerRef.current) clearTimeout(suppressTimerRef.current)
    }
  }, [mapsReady])

  return (
    <input
      ref={inputRef}
      className={className}
      placeholder={placeholder}
      onChange={e => {
        if (suppressRef.current) return
        callbackRef.current({ address: e.target.value, coords: null })
      }}
    />
  )
}
