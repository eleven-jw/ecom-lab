import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { logout, setCredentials } from '../store/slices/authSlice'
import type { AuthState } from '../store/slices/authSlice'
import type {
  AuthResponse,
  Banner,
  Category,
  LoginRequest,
  Product,
  ProductDetail,
  ProductListRequest,
  ProductListResponse,
  RegisterRequest,
  UserProfile,
} from './types'

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api'

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as { auth?: AuthState }
    const token =
      state.auth?.tokens?.accessToken ??
      (typeof window !== 'undefined' ? window.localStorage.getItem('access_token') : null)
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithReauth: typeof rawBaseQuery = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    const state = api.getState() as { auth?: AuthState }
    const refreshToken =
      state.auth?.tokens?.refreshToken ??
      (typeof window !== 'undefined' ? window.localStorage.getItem('refresh_token') : null)

    if (refreshToken) {
      const refreshResult = await rawBaseQuery(
        {
          url: 'auth/refresh',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions,
      )

      if (refreshResult.data) {
        api.dispatch(setCredentials(refreshResult.data as AuthResponse))
        result = await rawBaseQuery(args, api, extraOptions)
      } else {
        api.dispatch(logout())
      }
    } else {
      api.dispatch(logout())
    }
  }

  return result
}

export const api = createApi({
  reducerPath: 'api',
  tagTypes: ['Banner', 'Category', 'Product', 'Auth'],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setCredentials(data))
          dispatch(api.util.upsertQueryData('getProfile', undefined, data.user))
        } catch (error) {
          // ignore
        }
      },
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (payload) => ({
        url: 'auth/register',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setCredentials(data))
          dispatch(api.util.upsertQueryData('getProfile', undefined, data.user))
        } catch (error) {
          // ignore
        }
      },
    }),
    getProfile: builder.query<UserProfile, void>({
      query: () => 'auth/profile',
      providesTags: ['Auth'],
    }),
    getBanners: builder.query<Banner[], void>({
      query: () => 'banners',
      providesTags: ['Banner'],
    }),
    getCategories: builder.query<Category[], void>({
      query: () => 'categories',
      providesTags: ['Category'],
    }),
    getProducts: builder.query<ProductListResponse, ProductListRequest | void>({
      query: (params) => ({
        url: 'products',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'Product', id: 'PARTIAL-LIST' }],
    }),
    getProductById: builder.query<ProductDetail, string>({
      query: (productId) => `products/${productId}`,
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),
    updateProductRating: builder.mutation<Product, { id: string; rating: number }>({
      query: ({ id, rating }) => ({
        url: `products/${id}/rating`,
        method: 'PATCH',
        body: { rating },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useGetBannersQuery,
  useGetCategoriesQuery,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useUpdateProductRatingMutation,
} = api
