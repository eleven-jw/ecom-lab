import { http, HttpResponse } from 'msw'

import type {
  ProductListRequest,
  ProductListResponse,
} from '../services/types'
import { login, refresh, register, getUserById, decodeAccessToken } from './auth'
import { banners, categories, productDetails, products } from './data'
import { createHomeContent } from './home'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

const sleep = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

export const handlers = [
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as unknown
    const result = login(body as any)
    if (!result) {
      return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }
    return HttpResponse.json(result)
  }),

  http.post(`${API_BASE_URL}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as unknown
    try {
      const result = register(body as any)
      return HttpResponse.json(result, { status: 201 })
    } catch (error) {
      return HttpResponse.json({ message: 'Email already exists' }, { status: 409 })
    }
  }),

  http.post(`${API_BASE_URL}/auth/refresh`, async ({ request }) => {
    const body = (await request.json()) as { refreshToken?: string }
    if (!body?.refreshToken) {
      return HttpResponse.json({ message: 'Missing refresh token' }, { status: 400 })
    }
    const result = refresh(body.refreshToken)
    if (!result) {
      return HttpResponse.json({ message: 'Invalid refresh token' }, { status: 401 })
    }
    return HttpResponse.json(result)
  }),

  http.get(`${API_BASE_URL}/auth/profile`, async ({ request }) => {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.replace('Bearer ', '')
    const payload = decodeAccessToken(token)
    if (!payload) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const user = getUserById(payload.sub)
    if (!user) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    return HttpResponse.json(user)
  }),

  http.get(`${API_BASE_URL}/banners`, async () => {
    await sleep()
    return HttpResponse.json(banners)
  }),

  http.get(`${API_BASE_URL}/home`, async () => {
    await sleep(250)
    return HttpResponse.json(createHomeContent())
  }),

  http.get(`${API_BASE_URL}/categories`, async () => {
    await sleep()
    return HttpResponse.json(categories)
  }),

  http.get(`${API_BASE_URL}/products`, async ({ request }) => {
    await sleep()

    const url = new URL(request.url)
    const query = Object.fromEntries(url.searchParams.entries()) as Record<
      keyof ProductListRequest,
      string
    >

    const page = Number(query.page ?? '1')
    const pageSize = Number(query.pageSize ?? '12')
    const categoryId = query.categoryId
    const keyword = query.keyword?.toLowerCase()
    const sort = query.sort

    let filtered = [...products]

    if (categoryId) {
      filtered = filtered.filter((product) => product.categoryId === categoryId)
    }

    if (keyword) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(keyword),
      )
    }

    const minPrice = query.minPrice ? Number(query.minPrice) : undefined
    const maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined
    if (typeof minPrice === 'number' && !Number.isNaN(minPrice)) {
      filtered = filtered.filter((product) => product.price >= minPrice)
    }
    if (typeof maxPrice === 'number' && !Number.isNaN(maxPrice)) {
      filtered = filtered.filter((product) => product.price <= maxPrice)
    }

    if (sort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sort === 'sales') {
      filtered.sort((a, b) => (b.sales ?? 0) - (a.sales ?? 0))
    } else if (sort === 'newest') {
      filtered.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return bTime - aTime
      })
    }

    const total = filtered.length
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const items = filtered.slice(start, end)

    const payload: ProductListResponse = {
      items,
      page,
      pageSize,
      total,
    }

    return HttpResponse.json(payload)
  }),

  http.get(`${API_BASE_URL}/products/:productId`, async ({ params }) => {
    await sleep()
    const { productId } = params
    const detail = productDetails[String(productId)]

    if (!detail) {
      return HttpResponse.json({ message: 'Product not found' }, { status: 404 })
    }

    return HttpResponse.json(detail)
  }),

  http.patch(`${API_BASE_URL}/products/:productId/rating`, async ({ params, request }) => {
    await sleep()
    const { productId } = params
    const detail = productDetails[String(productId)]

    if (!detail) {
      return HttpResponse.json({ message: 'Product not found' }, { status: 404 })
    }

    const body = (await request.json()) as { rating?: number }
    const rating = Number(body?.rating)

    if (Number.isNaN(rating) || rating < 0 || rating > 5) {
      return HttpResponse.json({ message: 'Invalid rating value' }, { status: 400 })
    }

    detail.rating = rating

    return HttpResponse.json(detail)
  }),
]
