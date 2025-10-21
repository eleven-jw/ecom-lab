import { createSlice, nanoid } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { CartItem } from '../../services/types'

export interface CartState {
  items: CartItem[]
}

const initialState: CartState = {
  items: [],
}

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
      const existing = state.items.find((item) => item.productId === productId && item.skuId === skuId)

      if (existing) {
        existing.quantity += quantity
      } else {
        state.items.push({
          id: nanoid(),
          ...action.payload,
        })
      }
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.items.find((candidate) => candidate.id === action.payload.id)
      if (item) {
        item.quantity = action.payload.quantity
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
