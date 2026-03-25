/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BRAND_NAME: string
  readonly VITE_BRAND_EMAIL: string
  readonly VITE_BRAND_PHONE: string
  readonly VITE_BRAND_ADDRESS: string
  readonly VITE_SHOPIFY_DOMAIN: string
  readonly VITE_SHOPIFY_STOREFRONT_TOKEN: string
  readonly VITE_PARKING_FEE_SMALL: string
  readonly VITE_PARKING_FEE_MEDIUM: string
  readonly VITE_PARKING_FEE_LARGE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
