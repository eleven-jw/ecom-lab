import { createSlice, nanoid } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { AfterSaleRequest, AfterSaleStatus, AfterSaleType } from '../../services/types'

export interface AfterSaleState {
  requests: AfterSaleRequest[]
}

const initialState: AfterSaleState = {
  requests: [],
}

interface SubmitRequestPayload {
  orderId: string
  type: AfterSaleType
  reason: string
  description?: string
  contact?: string
  attachments?: string[]
}

export const afterSaleSlice = createSlice({
  name: 'afterSale',
  initialState,
  reducers: {
    submitRequest(state, action: PayloadAction<SubmitRequestPayload>) {
      const now = new Date().toISOString()
      const request: AfterSaleRequest = {
        id: nanoid(),
        status: 'pending',
        createdAt: now,
        updatedAt: now,
        ...action.payload,
      }
      state.requests.unshift(request)
    },
    updateRequestStatus(state, action: PayloadAction<{ id: string; status: AfterSaleStatus }>) {
      const request = state.requests.find((candidate) => candidate.id === action.payload.id)
      if (!request) return
      request.status = action.payload.status
      request.updatedAt = new Date().toISOString()
    },
  },
})

export const { submitRequest, updateRequestStatus } = afterSaleSlice.actions
export const afterSaleReducer = afterSaleSlice.reducer
