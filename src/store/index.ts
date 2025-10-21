import { configureStore } from '@reduxjs/toolkit'

import { api } from '../services/api'
import { authReducer } from './slices/authSlice'
import { addressReducer } from './slices/addressSlice'
import { cartReducer } from './slices/cartSlice'
import { ordersReducer } from './slices/ordersSlice'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    address: addressReducer,
    cart: cartReducer,
    orders: ordersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware),
  devTools: import.meta.env.DEV,
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
