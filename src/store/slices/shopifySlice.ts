import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchTaxiProducts as fetchProducts } from '../../services/shopifyClient'
import type { TaxiOption } from '../../types'
import type { RootState } from '../index'

// ─── Async Thunk ──────────────────────────────────────────────────────────────

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

// ─── State ────────────────────────────────────────────────────────────────────

interface ShopifyState {
  products: TaxiOption[]
  loading: boolean
  error: string | null
  initialized: boolean
}

const initialState: ShopifyState = {
  products: [],
  loading: false,
  error: null,
  initialized: false,
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
  },
})

export default shopifySlice.reducer
