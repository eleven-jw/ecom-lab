import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type {
  Banner,
  Category,
  Product,
  ProductDetail,
  ProductListRequest,
  ProductListResponse,
} from './types'

const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('access_token') : null

export const api = createApi({
  reducerPath: 'api',
  tagTypes: ['Banner', 'Category', 'Product'],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
    prepareHeaders: (headers) => {
      const token = getToken()
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
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
  useGetBannersQuery,
  useGetCategoriesQuery,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useUpdateProductRatingMutation,
} = api
