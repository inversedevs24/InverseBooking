declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string

let scriptLoaded = false

export function loadRecaptcha(): void {
  if (scriptLoaded || !SITE_KEY || document.querySelector('#grecaptcha-script')) return
  scriptLoaded = true
  const script = document.createElement('script')
  script.id = 'grecaptcha-script'
  script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`
  script.async = true
  document.head.appendChild(script)
}

export function getRecaptchaToken(action: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!SITE_KEY) {
      reject(new Error('VITE_RECAPTCHA_SITE_KEY is not set'))
      return
    }
    if (!window.grecaptcha) {
      reject(new Error('reCAPTCHA script not loaded'))
      return
    }
    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(SITE_KEY, { action }).then(resolve).catch(reject)
    })
  })
}
