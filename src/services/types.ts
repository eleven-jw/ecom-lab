export interface Banner {
  id: string
  title: string
  description?: string
  imageUrl: string
  linkUrl: string
}

export interface Category {
  id: string
  name: string
  parentId?: string | null
  imageUrl?: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  currency: string
  imageUrl: string
  rating?: number
  reviewCount?: number
  categoryId: string
  tags?: string[]
}

export interface ProductListRequest {
  page?: number
  pageSize?: number
  categoryId?: string
  keyword?: string
  sort?: 'price-asc' | 'price-desc' | 'sales' | 'newest'
  minPrice?: number
  maxPrice?: number
}

export interface ProductListResponse {
  items: Product[]
  page: number
  pageSize: number
  total: number
}

export interface ProductReview {
  id: string
  userId: string
  userName: string
  rating: number
  content: string
  createdAt: string
}

export interface ProductDetail extends Product {
  skus: Array<{
    id: string
    label: string
    price: number
    stock: number
  }>
  reviews: ProductReview[]
}

export type UserTier = 'basic' | 'vip' | 'super_vip'

export interface UserProfile {
  id: string
  email: string
  fullName: string
  tier: UserTier
  createdAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface AuthResponse {
  user: UserProfile
  tokens: AuthTokens
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  fullName: string
  inviteCode?: string
}

export interface HomeCategory {
  id: string
  name: string
  iconUrl?: string
  children?: Array<{
    id: string
    name: string
  }>
}

export interface HomeQuickLink {
  id: string
  title: string
  description: string
  iconUrl: string
  href: string
}

export interface FlashSaleItem {
  id: string
  productId: string
  name: string
  imageUrl: string
  salePrice: number
  originalPrice: number
  currency: string
  soldPercent: number
  tag?: string
}

export interface HomeFlashSale {
  endsAt: string
  items: FlashSaleItem[]
}

export interface BrandSpotlight {
  id: string
  name: string
  imageUrl: string
  href: string
  tagline?: string
}

export interface HomeFloorProduct {
  id: string
  productId: string
  name: string
  imageUrl: string
  price: number
  currency: string
  tags?: string[]
}

export interface HomeFloor {
  id: string
  title: string
  subtitle: string
  themeColor: string
  products: HomeFloorProduct[]
}

export interface HomeContent {
  categories: HomeCategory[]
  quickLinks: HomeQuickLink[]
  flashSale: HomeFlashSale
  brands: BrandSpotlight[]
  floors: HomeFloor[]
}
