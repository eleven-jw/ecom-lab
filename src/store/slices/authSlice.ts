import { createSlice } from '@reduxjs/toolkit'

import type { AuthResponse, AuthTokens, UserProfile } from '../../services/types'

export type AuthStatus = 'idle' | 'authenticated' | 'unauthenticated'

export interface AuthState {
  user: UserProfile | null
  tokens: AuthTokens | null
  status: AuthStatus
}

const STORAGE_KEY = 'ecom-lab-auth'

const loadPersistedAuth = (): Pick<AuthState, 'user' | 'tokens'> | null => {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Pick<AuthState, 'user' | 'tokens'>
  } catch (error) {
    return null
  }
}

const persistAuth = (data: Pick<AuthState, 'user' | 'tokens'> | null) => {
  if (typeof window === 'undefined') return
  if (!data) {
    window.localStorage.removeItem(STORAGE_KEY)
    window.localStorage.removeItem('access_token')
    window.localStorage.removeItem('refresh_token')
    return
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  if (data.tokens?.accessToken) {
    window.localStorage.setItem('access_token', data.tokens.accessToken)
  }
  if (data.tokens?.refreshToken) {
    window.localStorage.setItem('refresh_token', data.tokens.refreshToken)
  }
}

const persisted = loadPersistedAuth()

const initialState: AuthState = {
  user: persisted?.user ?? null,
  tokens: persisted?.tokens ?? null,
  status: persisted?.user ? 'authenticated' : 'unauthenticated',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: { payload: AuthResponse }) {
      state.user = action.payload.user
      state.tokens = action.payload.tokens
      state.status = 'authenticated'
      persistAuth({ user: state.user, tokens: state.tokens })
    },
    updateProfile(state, action: { payload: Partial<UserProfile> }) {
      if (!state.user) return
      state.user = { ...state.user, ...action.payload }
      persistAuth({ user: state.user, tokens: state.tokens })
    },
    updateTokens(state, action: { payload: AuthTokens }) {
      if (state.tokens) {
        state.tokens = action.payload
        persistAuth({ user: state.user, tokens: state.tokens })
      }
    },
    logout(state) {
      state.user = null
      state.tokens = null
      state.status = 'unauthenticated'
      persistAuth(null)
    },
  },
})

export const { setCredentials, updateProfile, updateTokens, logout } = authSlice.actions
export const authReducer = authSlice.reducer
