import { createSlice, nanoid } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { CartItem } from '../../services/types'

export interface CartState {
  items: CartItem[]
}

const initialState: CartState = {
  items: [],
}

const MAX_ITEMS = 100
export const CART_MAX_ITEMS = MAX_ITEMS

interface AddItemPayload {
  productId: string
  skuId: string
  skuLabel: string
  name: string
  imageUrl: string
  unitPrice: number
  currency: string
  quantity: number
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<AddItemPayload>) {
      const { productId, skuId, quantity } = action.payload
      if (quantity <= 0) return

      const existing = state.items.find((item) => item.productId === productId && item.skuId === skuId)
      const currentTotal = state.items.reduce((acc, item) => acc + item.quantity, 0)
      const existingQuantity = existing?.quantity ?? 0
      const available = MAX_ITEMS - (currentTotal - existingQuantity)
      if (available <= 0) {
        return
      }

      const finalQuantity = Math.min(existingQuantity + quantity, available)

      if (existing) {
        existing.quantity = Math.max(1, finalQuantity)
      } else {
        state.items.push({
          id: nanoid(),
          ...action.payload,
          quantity: Math.max(1, finalQuantity),
        })
      }
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.items.find((candidate) => candidate.id === action.payload.id)
      if (item) {
        const desired = Math.max(1, action.payload.quantity)
        const currentTotal = state.items.reduce((acc, cartItem) => acc + cartItem.quantity, 0)
        const available = MAX_ITEMS - (currentTotal - item.quantity)
        item.quantity = Math.max(1, Math.min(desired, available))
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    clearCart(state) {
      state.items = []
    },
  },
})

export const { addItem, updateQuantity, removeItem, clearCart } = cartSlice.actions
export const cartReducer = cartSlice.reducer
