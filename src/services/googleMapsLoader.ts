const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY as string

let loadPromise: Promise<void> | null = null

export function loadGoogleMaps(): Promise<void> {
  if (loadPromise) return loadPromise

  if (typeof window !== 'undefined' && (window as any).google?.maps?.places) {
    return Promise.resolve()
  }

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => {
      loadPromise = null
      reject(new Error('Failed to load Google Maps API'))
    }
    document.head.appendChild(script)
  })

  return loadPromise
}
