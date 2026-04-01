export const SHOPIFY_CONFIG = {
  storeDomain: import.meta.env.VITE_SHOPIFY_DOMAIN as string,
  storefrontAccessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as string,
}

export const SHOPIFY_GRAPHQL_URL = `https://${SHOPIFY_CONFIG.storeDomain}/api/2025-01/graphql.json`

export const METAFIELD_NAMESPACES = {
  TAXI_DETAILS: 'taxi_details',
  FEATURES: 'features',
  CUSTOM: 'custom',
} as const

export const METAFIELD_KEYS = {
  VEHICLE_TYPE: 'vehicle_type',
  PASSENGERS: 'passengers',
  LUGGAGE: 'luggage',
  RATING: 'rating',
  REVIEWS: 'reviews',
  BASE_FARE: 'base_fare',
  PER_KM_RATE: 'per_km_rate',
  ESTIMATED_ARRIVAL: 'estimated_arrival',
  POPULAR: 'popular',
  FEATURES_LIST: 'features_list',
  SERVICE_TYPE: 'service_type',
  BANNER_IMAGE: 'banner_image',
  SERVICE_DESCRIPTION: 'service_description',
  BANNER_HEADLINE: 'banner_headline',
  BANNER_SUB: 'banner_sub',
} as const
