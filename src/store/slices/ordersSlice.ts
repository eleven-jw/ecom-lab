import { createSlice, nanoid } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { Address, Order, OrderItem, OrderStatus } from '../../services/types'

export interface OrdersState {
  orders: Order[]
}

const initialState: OrdersState = {
  orders: [
    {
      id: 'order-1001',
      createdAt: '2025-01-12T09:30:00.000Z',
      status: 'delivered',
      totalAmount: 8999,
      currency: 'CNY',
      paymentMethod: 'wechat',
      address: {
        id: 'addr-1',
        label: '家',
        recipient: '张敏',
        phone: '13800000000',
        line1: '上海市浦东新区张江路 888 号',
        city: '上海',
        region: '上海',
        postalCode: '200120',
        isDefault: true,
      },
      items: [
        {
          productId: 'prod-iphone-16-pro',
          name: '苹果 iPhone 16 Pro 256G',
          imageUrl: 'https://images.unsplash.com/photo-1512499617640-c2f999018b72?w=600&q=80',
          skuLabel: '256GB',
          quantity: 1,
          price: 8999,
          currency: 'CNY',
        },
      ],
    },
  ],
}

interface CreateOrderPayload {
  items: OrderItem[]
  totalAmount: number
  currency: string
  address: Address
  paymentMethod: Order['paymentMethod']
}

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<CreateOrderPayload>) {
      const order: Order = {
        id: nanoid(),
        createdAt: new Date().toISOString(),
        status: 'processing',
        ...action.payload,
      }
      state.orders.unshift(order)
    },
    updateOrderStatus(state, action: PayloadAction<{ id: string; status: OrderStatus }>) {
      const order = state.orders.find((candidate) => candidate.id === action.payload.id)
      if (order) {
        order.status = action.payload.status
      }
    },
  },
})

export const { addOrder, updateOrderStatus } = ordersSlice.actions
export const ordersReducer = ordersSlice.reducer
