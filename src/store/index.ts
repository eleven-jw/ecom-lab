import { configureStore } from '@reduxjs/toolkit'

import { api } from '../services/api'
import { authReducer } from './slices/authSlice'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware),
  devTools: import.meta.env.DEV,
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
