import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchTaxiProducts as fetchProducts, fetchHomepageImages as fetchHeroImages, fetchChauffeurImages as fetchChauffeurImgs, fetchServiceImages as fetchServiceImgs } from '../../services/shopifyClient'
import type { TaxiOption } from '../../types'
import type { RootState } from '../index'

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchTaxiProducts = createAsyncThunk(
  'shopify/fetchTaxiProducts',
  async () => {
    return fetchProducts()
  },
  {
    condition: (_arg, { getState }) => {
      const state = getState() as RootState
      // Guard: only fetch if not already fetching or initialized
      if (state.shopify.initialized || state.shopify.loading) return false
    },
  },
)

export const fetchServiceImages = createAsyncThunk(
  'shopify/fetchServiceImages',
  async () => fetchServiceImgs(),
  {
    condition: (_arg, { getState }) => {
      const state = getState() as RootState
      if (state.shopify.serviceImagesInitialized) return false
    },
  },
)

export const fetchChauffeurImages = createAsyncThunk(
  'shopify/fetchChauffeurImages',
  async () => fetchChauffeurImgs(),
  {
    condition: (_arg, { getState }) => {
      const state = getState() as RootState
      if (state.shopify.chauffeurImagesInitialized) return false
    },
  },
)

export const fetchHomepageImages = createAsyncThunk(
  'shopify/fetchHomepageImages',
  async () => {
    return fetchHeroImages()
  },
  {
    condition: (_arg, { getState }) => {
      const state = getState() as RootState
      if (state.shopify.heroImagesInitialized) return false
    },
  },
)

// ─── State ────────────────────────────────────────────────────────────────────

interface ShopifyState {
  products: TaxiOption[]
  loading: boolean
  error: string | null
  initialized: boolean
  heroImages: string[]
  heroImagesInitialized: boolean
  chauffeurImages: string[]
  chauffeurImagesInitialized: boolean
  serviceImages: Record<string, string>
  serviceImagesInitialized: boolean
}

const initialState: ShopifyState = {
  products: [],
  loading: false,
  error: null,
  initialized: false,
  heroImages: [],
  heroImagesInitialized: false,
  chauffeurImages: [],
  chauffeurImagesInitialized: false,
  serviceImages: {},
  serviceImagesInitialized: false,
}

// ─── Slice ────────────────────────────────────────────────────────────────────

const shopifySlice = createSlice({
  name: 'shopify',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTaxiProducts.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTaxiProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
        state.initialized = true
      })
      .addCase(fetchTaxiProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Failed to fetch vehicles'
        state.initialized = true
      })
      .addCase(fetchServiceImages.fulfilled, (state, action) => {
        state.serviceImages = action.payload
        state.serviceImagesInitialized = true
      })
      .addCase(fetchServiceImages.rejected, state => {
        state.serviceImagesInitialized = true
      })
      .addCase(fetchChauffeurImages.fulfilled, (state, action) => {
        state.chauffeurImages = action.payload
        state.chauffeurImagesInitialized = true
      })
      .addCase(fetchChauffeurImages.rejected, state => {
        state.chauffeurImagesInitialized = true
      })
      .addCase(fetchHomepageImages.fulfilled, (state, action) => {
        state.heroImages = action.payload
        state.heroImagesInitialized = true
      })
      .addCase(fetchHomepageImages.rejected, state => {
        state.heroImagesInitialized = true
      })
  },
})

export default shopifySlice.reducer
