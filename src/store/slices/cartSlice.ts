import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createCart } from '../../services/shopifyCartService'
import type { CartItem } from '../../types'

// ─── Async Thunk ──────────────────────────────────────────────────────────────

export const createCheckout = createAsyncThunk(
  'cart/createCheckout',
  async ({ item, email }: { item: CartItem; email?: string }) => {
    const checkoutUrl = await createCart(item, email)
    return checkoutUrl
  },
)

// ─── State ────────────────────────────────────────────────────────────────────

interface CartState {
  item: CartItem | null
  checkoutUrl: string | null
  loading: boolean
  error: string | null
  checkoutComplete: boolean
}

const initialState: CartState = {
  item: null,
  checkoutUrl: null,
  loading: false,
  error: null,
  checkoutComplete: false,
}

// ─── Slice ────────────────────────────────────────────────────────────────────

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: state => {
      state.item = null
      state.checkoutUrl = null
      state.error = null
      state.checkoutComplete = false
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createCheckout.pending, (state, action) => {
        state.loading = true
        state.error = null
        state.item = action.meta.arg.item
      })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false
        state.checkoutUrl = action.payload
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Failed to create checkout'
      })
  },
})

export const { clearCart } = cartSlice.actions
export default cartSlice.reducer
