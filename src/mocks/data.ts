import type {
  Banner,
  Category,
  Product,
  ProductDetail,
} from '../services/types'

export const banners: Banner[] = [
  {
    id: 'banner-1',
    title: 'Mega Fashion Week',
    description: 'Refresh your wardrobe with limited-time discounts.',
    imageUrl:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&q=80',
    linkUrl: '/products?categoryId=fashion',
  },
  {
    id: 'banner-2',
    title: 'Smart Living Essentials',
    description: 'Upgrade your home office setup with smart devices.',
    imageUrl:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
    linkUrl: '/products?categoryId=smart-home',
  },
]

export const categories: Category[] = [
  {
    id: 'fashion',
    name: 'Fashion',
    imageUrl:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80',
  },
  {
    id: 'smart-home',
    name: 'Smart Home',
    imageUrl:
      'https://images.unsplash.com/photo-1511381939415-c1a1120d41ca?w=400&q=80',
  },
  {
    id: 'beauty',
    name: 'Beauty',
    imageUrl:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80',
  },
]

export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'Minimalist Leather Backpack',
    description: 'Crafted from premium leather with ample storage.',
    price: 189,
    currency: 'USD',
    imageUrl:
      'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=600&q=80',
    rating: 4.6,
    reviewCount: 128,
    categoryId: 'fashion',
    tags: ['New', 'Bestseller'],
  },
  {
    id: 'prod-2',
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Immersive sound with 35 hours battery life.',
    price: 249,
    currency: 'USD',
    imageUrl:
      'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=600&q=80',
    rating: 4.8,
    reviewCount: 320,
    categoryId: 'smart-home',
    tags: ['Premium'],
  },
  {
    id: 'prod-3',
    name: 'Glow Serum with Vitamin C',
    description: 'Brightens skin tone and reduces fine lines.',
    price: 59,
    currency: 'USD',
    imageUrl:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80',
    rating: 4.4,
    reviewCount: 210,
    categoryId: 'beauty',
    tags: ['Vegan', 'Trending'],
  },
]

export const productDetails: Record<string, ProductDetail> = {
  'prod-1': {
    ...products[0],
    skus: [
      { id: 'sku-1-1', label: 'Black', price: 189, stock: 12 },
      { id: 'sku-1-2', label: 'Tan', price: 189, stock: 5 },
    ],
    reviews: [
      {
        id: 'rev-1',
        userId: 'user-10',
        userName: 'Amelia',
        rating: 5,
        content: 'Great craftsmanship and fits my laptop perfectly.',
        createdAt: '2025-01-06T03:30:00.000Z',
      },
    ],
  },
  'prod-2': {
    ...products[1],
    skus: [
      { id: 'sku-2-1', label: 'Graphite', price: 249, stock: 18 },
      { id: 'sku-2-2', label: 'Silver', price: 249, stock: 9 },
    ],
    reviews: [
      {
        id: 'rev-2',
        userId: 'user-24',
        userName: 'Liam',
        rating: 4,
        content: 'Excellent sound quality, wish it charged faster.',
        createdAt: '2025-01-10T11:15:00.000Z',
      },
    ],
  },
  'prod-3': {
    ...products[2],
    skus: [
      { id: 'sku-3-1', label: '30ml', price: 59, stock: 40 },
      { id: 'sku-3-2', label: '50ml', price: 79, stock: 25 },
    ],
    reviews: [
      {
        id: 'rev-3',
        userId: 'user-35',
        userName: 'Sophia',
        rating: 5,
        content: 'My skin feels brighter within a week. Love it!',
        createdAt: '2025-01-14T09:05:00.000Z',
      },
    ],
  },
}
