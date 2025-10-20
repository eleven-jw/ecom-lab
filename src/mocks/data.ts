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
    linkUrl: '/products?categoryId=electronics',
  },
]

export const categories: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics & Appliances',
    imageUrl:
      'https://images.unsplash.com/photo-1580894897200-2c1cfb5d7cd0?w=400&q=80',
  },
  {
    id: 'digital',
    name: 'Digital Gadgets',
    imageUrl:
      'https://images.unsplash.com/photo-1512499318453-3ca57b27a87b?w=400&q=80',
  },
  {
    id: 'computers',
    name: 'Computers & Office',
    imageUrl:
      'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=400&q=80',
  },
  {
    id: 'home',
    name: 'Home Living',
    imageUrl:
      'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=400&q=80',
  },
  {
    id: 'fashion',
    name: 'Fashion & Apparel',
    imageUrl:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80',
  },
  {
    id: 'beauty',
    name: 'Beauty & Personal Care',
    imageUrl:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80',
  },
  {
    id: 'food',
    name: 'Food & Beverage',
    imageUrl:
      'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&q=80',
  },
  {
    id: 'sports',
    name: 'Sports & Outdoors',
    imageUrl:
      'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=400&q=80',
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    imageUrl:
      'https://images.unsplash.com/photo-1587502537745-84ab6b74007b?w=400&q=80',
  },
]

export const products: Product[] = [
  {
    id: 'prod-sony-oled',
    name: '索尼 65 寸 OLED 旗舰电视',
    description: '4K HDR OLED 面板搭载 XR 认知芯片，呈现沉浸式影院画质。',
    price: 9999,
    currency: 'CNY',
    imageUrl:
      'https://images.unsplash.com/photo-1580894897200-2c1cfb5d7cd0?w=600&q=80',
    rating: 4.9,
    reviewCount: 245,
    categoryId: 'electronics',
    tags: ['4K OLED', 'XR 芯片'],
  },
  {
    id: 'prod-dyson-v12',
    name: '戴森 V12 Detect 吸尘器',
    description: '智能激光除尘，轻量机身与多场景吸头满足全屋清洁。',
    price: 4299,
    currency: 'CNY',
    imageUrl:
      'https://images.unsplash.com/photo-1616628182507-0ff1fcecdf2a?w=600&q=80',
    rating: 4.7,
    reviewCount: 188,
    categoryId: 'home',
    tags: ['无线吸尘', '轻量'],
  },
  {
    id: 'prod-canon-eosr7',
    name: '佳能 EOS R7 微单套机',
    description: 'APS-C 画幅双核对焦，支持 4K60P 视频拍摄与高速连拍。',
    price: 7999,
    currency: 'CNY',
    imageUrl:
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80',
    rating: 4.8,
    reviewCount: 132,
    categoryId: 'digital',
    tags: ['4K60', '双核对焦'],
  },
  {
    id: 'prod-bose-qc-ultra',
    name: 'BOSE 智能降噪耳机 QC Ultra',
    description: '全新空间音频与自适应降噪带来沉浸式聆听体验。',
    price: 2399,
    currency: 'CNY',
    imageUrl:
      'https://images.unsplash.com/photo-1511963211024-6cefacb67f04?w=600&q=80',
    rating: 4.9,
    reviewCount: 412,
    categoryId: 'digital',
    tags: ['主动降噪', '空间音频'],
  },
  {
    id: 'prod-iphone-16-pro',
    name: '苹果 iPhone 16 Pro 256G',
    description: 'A18 Pro 芯片与 ProMotion 显示，支持全天候待机与专业影像。',
    price: 8999,
    currency: 'CNY',
    imageUrl:
      'https://images.unsplash.com/photo-1512499617640-c2f999018b72?w=600&q=80',
    rating: 4.9,
    reviewCount: 528,
    categoryId: 'digital',
    tags: ['A18 Pro', '120Hz'],
  },
  {
    id: 'prod-airfryer-5l',
    name: '空气炸锅 5L 家庭版',
    description: '5L 大容量搭配 12 种智能菜单，轻松烹饪低油美食。',
    price: 499,
    currency: 'CNY',
    imageUrl:
      'https://images.unsplash.com/photo-1586201375761-83865001e31b?w=600&q=80',
    rating: 4.6,
    reviewCount: 356,
    categoryId: 'home',
    tags: ['少油炸', '智能菜单'],
  },
  {
    id: 'prod-massage-gun',
    name: '筋膜枪 智能变速版',
    description: '四档变速与压力反馈，帮助运动后快速放松肌群。',
    price: 699,
    currency: 'CNY',
    imageUrl:
      'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80',
    rating: 4.5,
    reviewCount: 204,
    categoryId: 'health',
    tags: ['肌肉放松'],
  },
  {
    id: 'prod-roborock-mop',
    name: '石头自清洁扫拖机器人',
    description: '自动集尘与基站自清洁，支持 3D 避障与全屋地图。',
    price: 3299,
    currency: 'CNY',
    imageUrl:
      'https://images.unsplash.com/photo-1586201375754-578c6ee0aea3?w=600&q=80',
    rating: 4.7,
    reviewCount: 267,
    categoryId: 'home',
    tags: ['自清洁', '3D避障'],
  },
  {
    id: 'prod-joyoung-blender',
    name: '九阳 破壁料理机',
    description: '八叶合金刀头与 35,000 转高速电机，营养细腻不糊底。',
    price: 899,
    currency: 'CNY',
    imageUrl:
      'https://images.unsplash.com/photo-1536520002442-39764a41e04d?w=600&q=80',
    rating: 4.6,
    reviewCount: 98,
    categoryId: 'home',
    tags: ['破壁', '低噪'],
  },
  {
    id: 'prod-delonghi-espresso',
    name: 'Delonghi 家用咖啡机',
    description: '双锅炉结构与蒸汽打奶，可萃取手工意式与花式咖啡。',
    price: 2799,
    currency: 'CNY',
    imageUrl:
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80',
    rating: 4.7,
    reviewCount: 142,
    categoryId: 'home',
    tags: ['双锅炉', '蒸汽打奶'],
  },
  {
    id: 'prod-nespresso-capsule',
    name: 'Nespresso 咖啡胶囊礼盒',
    description: '精选 24 粒精品拼配，适配全系列 Nespresso 咖啡机。',
    price: 369,
    currency: 'CNY',
    imageUrl:
      'https://images.unsplash.com/photo-1527169402691-feff5539e52c?w=600&q=80',
    rating: 4.4,
    reviewCount: 76,
    categoryId: 'food',
    tags: ['精品拼配'],
  },
  {
    id: 'prod-adidas-runner',
    name: '阿迪达斯 透气跑鞋',
    description: '轻量鞋面搭配 Bounce 中底，提供长距离跑步所需缓震。',
    price: 699,
    currency: 'CNY',
    imageUrl:
      'https://images.unsplash.com/photo-1517677129300-07b130802f46?w=600&q=80',
    rating: 4.6,
    reviewCount: 188,
    categoryId: 'sports',
    tags: ['轻量', '缓震'],
  },
  {
    id: 'prod-uniqlo-airism-polo',
    name: '优衣库 Airism POLO',
    description: 'AIRism 速干面料加持，通勤与运动均能保持清爽。',
    price: 199,
    currency: 'CNY',
    imageUrl:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    rating: 4.5,
    reviewCount: 94,
    categoryId: 'fashion',
    tags: ['速干', '基础必备'],
  },
  {
    id: 'prod-ck-backpack',
    name: 'CK 极简双肩包',
    description: '极简外观搭配多分区内胆，兼顾商务与休闲需求。',
    price: 1380,
    currency: 'CNY',
    imageUrl:
      'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=600&q=80',
    rating: 4.3,
    reviewCount: 56,
    categoryId: 'fashion',
    tags: ['极简', '通勤'],
  },
  {
    id: 'prod-rayban-aviator',
    name: '雷朋 经典飞行员墨镜',
    description: '经典飞行员轮廓搭配 G15 镜片，驾车出行必备。',
    price: 1199,
    currency: 'CNY',
    imageUrl:
      'https://images.unsplash.com/photo-1502901930015-158e722ed37b?w=600&q=80',
    rating: 4.7,
    reviewCount: 73,
    categoryId: 'fashion',
    tags: ['经典', 'UV400'],
  },
  {
    id: 'prod-minimalist-backpack',
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
    id: 'prod-wireless-headphones',
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Immersive sound with 35 hours battery life.',
    price: 249,
    currency: 'USD',
    imageUrl:
      'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=600&q=80',
    rating: 4.8,
    reviewCount: 320,
    categoryId: 'digital',
    tags: ['Premium'],
  },
  {
    id: 'prod-glow-serum',
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

const createDetail = (
  product: Product,
  extra?: Partial<Pick<ProductDetail, 'skus' | 'reviews'>>,
): ProductDetail => ({
  ...product,
  skus:
    extra?.skus ?? [
      {
        id: `${product.id}-sku-default`,
        label: '标准款',
        price: product.price,
        stock: 20,
      },
    ],
  reviews: extra?.reviews ?? [],
})

const productDetailExtras: Record<string, Partial<Pick<ProductDetail, 'skus' | 'reviews'>>> = {
  'prod-sony-oled': {
    skus: [
      { id: 'prod-sony-oled-65', label: '65寸', price: 9999, stock: 12 },
      { id: 'prod-sony-oled-77', label: '77寸', price: 16999, stock: 6 },
    ],
    reviews: [
      {
        id: 'rev-sony-1',
        userId: 'user-201',
        userName: 'Daniel',
        rating: 5,
        content: '色彩和对比度惊艳，搭配 PS5 游戏体验满分。',
        createdAt: '2025-01-12T08:30:00.000Z',
      },
    ],
  },
  'prod-dyson-v12': {
    skus: [
      { id: 'prod-dyson-v12-standard', label: '标准版', price: 4299, stock: 20 },
      { id: 'prod-dyson-v12-abs', label: '豪华版', price: 4699, stock: 10 },
    ],
    reviews: [
      {
        id: 'rev-dyson-1',
        userId: 'user-118',
        userName: 'Kelly',
        rating: 5,
        content: '激光真的能照出灰尘，地板一目了然。',
        createdAt: '2025-01-18T11:05:00.000Z',
      },
    ],
  },
  'prod-canon-eosr7': {
    skus: [
      { id: 'prod-canon-eosr7-body', label: 'R7 机身', price: 7999, stock: 15 },
      { id: 'prod-canon-eosr7-kit', label: 'R7 18-150mm 套机', price: 9499, stock: 9 },
    ],
    reviews: [
      {
        id: 'rev-r7-1',
        userId: 'user-142',
        userName: '摄影师Leo',
        rating: 4,
        content: '对焦速度快，连拍也稳，就是握持略显小巧。',
        createdAt: '2025-01-15T14:22:00.000Z',
      },
    ],
  },
  'prod-bose-qc-ultra': {
    skus: [
      { id: 'prod-bose-qc-ultra-black', label: '曜石黑', price: 2399, stock: 18 },
      { id: 'prod-bose-qc-ultra-white', label: '珍珠白', price: 2399, stock: 12 },
    ],
    reviews: [
      {
        id: 'rev-bose-1',
        userId: 'user-203',
        userName: 'Iris',
        rating: 5,
        content: '降噪比上一代更贴耳，空间音频看电影很沉浸。',
        createdAt: '2025-01-20T09:00:00.000Z',
      },
    ],
  },
  'prod-iphone-16-pro': {
    skus: [
      { id: 'prod-iphone-16-pro-256', label: '256GB', price: 8999, stock: 30 },
      { id: 'prod-iphone-16-pro-512', label: '512GB', price: 9999, stock: 20 },
    ],
    reviews: [
      {
        id: 'rev-iphone-1',
        userId: 'user-312',
        userName: 'Zoe',
        rating: 5,
        content: 'A18 Pro 游戏性能强，待机时间也提升不少。',
        createdAt: '2025-01-16T18:45:00.000Z',
      },
    ],
  },
  'prod-airfryer-5l': {
    reviews: [
      {
        id: 'rev-airfryer-1',
        userId: 'user-281',
        userName: 'Maggie',
        rating: 4,
        content: '容量大够一家三口用，清洗也比较方便。',
        createdAt: '2025-01-08T07:55:00.000Z',
      },
    ],
  },
  'prod-massage-gun': {
    reviews: [
      {
        id: 'rev-massage-1',
        userId: 'user-190',
        userName: 'Alex',
        rating: 5,
        content: '运动后酸痛用十分钟就松了，噪音也不大。',
        createdAt: '2025-01-13T12:10:00.000Z',
      },
    ],
  },
  'prod-roborock-mop': {
    skus: [
      { id: 'prod-roborock-mop-standard', label: '标准版', price: 3299, stock: 22 },
      { id: 'prod-roborock-mop-plus', label: 'Plus 自清洁版', price: 3899, stock: 14 },
    ],
    reviews: [
      {
        id: 'rev-roborock-1',
        userId: 'user-272',
        userName: 'Hannah',
        rating: 4,
        content: '地毯识别准确，回洗底座也很省心。',
        createdAt: '2025-01-09T15:48:00.000Z',
      },
    ],
  },
  'prod-joyoung-blender': {
    reviews: [
      {
        id: 'rev-joyoung-1',
        userId: 'user-145',
        userName: 'Cindy',
        rating: 5,
        content: '豆浆细腻不卡嘴，预约功能早上直接喝热的。',
        createdAt: '2025-01-05T06:35:00.000Z',
      },
    ],
  },
  'prod-delonghi-espresso': {
    reviews: [
      {
        id: 'rev-delonghi-1',
        userId: 'user-166',
        userName: 'Marco',
        rating: 5,
        content: '蒸汽打奶很细腻，萃取油脂丰富。',
        createdAt: '2025-01-11T10:05:00.000Z',
      },
    ],
  },
  'prod-nespresso-capsule': {
    reviews: [
      {
        id: 'rev-nespresso-1',
        userId: 'user-188',
        userName: 'Eva',
        rating: 4,
        content: '口味多样，办公室下午茶必备。',
        createdAt: '2025-01-07T15:20:00.000Z',
      },
    ],
  },
  'prod-adidas-runner': {
    reviews: [
      {
        id: 'rev-adidas-1',
        userId: 'user-230',
        userName: 'RunnerJ',
        rating: 4,
        content: '透气性很好，尺码偏大半码建议注意。',
        createdAt: '2025-01-03T19:22:00.000Z',
      },
    ],
  },
  'prod-uniqlo-airism-polo': {
    reviews: [
      {
        id: 'rev-airism-1',
        userId: 'user-119',
        userName: 'Brian',
        rating: 5,
        content: '夏季通勤穿很舒服，洗后也不容易皱。',
        createdAt: '2025-01-02T08:15:00.000Z',
      },
    ],
  },
  'prod-ck-backpack': {
    reviews: [
      {
        id: 'rev-ck-1',
        userId: 'user-208',
        userName: 'Ivy',
        rating: 4,
        content: '容量够用也很轻，电脑层保护不错。',
        createdAt: '2025-01-04T13:18:00.000Z',
      },
    ],
  },
  'prod-rayban-aviator': {
    reviews: [
      {
        id: 'rev-rayban-1',
        userId: 'user-192',
        userName: 'Oliver',
        rating: 5,
        content: '框型经典百搭，镜片清晰不刺眼。',
        createdAt: '2025-01-06T17:42:00.000Z',
      },
    ],
  },
  'prod-minimalist-backpack': {
    skus: [
      { id: 'prod-mini-backpack-black', label: 'Black', price: 189, stock: 12 },
      { id: 'prod-mini-backpack-tan', label: 'Tan', price: 189, stock: 5 },
    ],
    reviews: [
      {
        id: 'rev-mini-1',
        userId: 'user-10',
        userName: 'Amelia',
        rating: 5,
        content: 'Great craftsmanship and fits my laptop perfectly.',
        createdAt: '2025-01-06T03:30:00.000Z',
      },
    ],
  },
  'prod-wireless-headphones': {
    skus: [
      { id: 'prod-wireless-headphones-gray', label: 'Graphite', price: 249, stock: 18 },
      { id: 'prod-wireless-headphones-silver', label: 'Silver', price: 249, stock: 9 },
    ],
    reviews: [
      {
        id: 'rev-wireless-1',
        userId: 'user-24',
        userName: 'Liam',
        rating: 4,
        content: 'Excellent sound quality, wish it charged faster.',
        createdAt: '2025-01-10T11:15:00.000Z',
      },
    ],
  },
  'prod-glow-serum': {
    skus: [
      { id: 'prod-glow-serum-30', label: '30ml', price: 59, stock: 40 },
      { id: 'prod-glow-serum-50', label: '50ml', price: 79, stock: 25 },
    ],
    reviews: [
      {
        id: 'rev-glow-1',
        userId: 'user-35',
        userName: 'Sophia',
        rating: 5,
        content: 'My skin feels brighter within a week. Love it!',
        createdAt: '2025-01-14T09:05:00.000Z',
      },
    ],
  },
}

export const productDetails: Record<string, ProductDetail> = Object.fromEntries(
  products.map((product) => [product.id, createDetail(product, productDetailExtras[product.id])]),
) as Record<string, ProductDetail>
