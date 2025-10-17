import { http, HttpResponse } from 'msw'

import type {
  ProductListRequest,
  ProductListResponse,
} from '../services/types'
import { banners, categories, productDetails, products } from './data'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

const sleep = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

export const handlers = [
  http.get(`${API_BASE_URL}/banners`, async () => {
    await sleep()
    return HttpResponse.json(banners)
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

    if (sort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sort === 'sales') {
      filtered.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
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
