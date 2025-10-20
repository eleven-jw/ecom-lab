import type { HomeContent } from '../services/types'

const categories: HomeContent['categories'] = [
  {
    id: 'electronics',
    name: '家用电器',
    iconUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&q=60',
    children: [
      { id: 'tv', name: '电视影音' },
      { id: 'ac', name: '空调冰箱' },
      { id: 'washer', name: '洗衣机' },
    ],
  },
  {
    id: 'digital',
    name: '数码潮电',
    iconUrl: 'https://images.unsplash.com/photo-1512499318453-3ca57b27a87b?w=80&q=60',
    children: [
      { id: 'phone', name: '手机通讯' },
      { id: 'camera', name: '摄影摄像' },
      { id: 'tablet', name: '平板电脑' },
    ],
  },
  {
    id: 'computers',
    name: '电脑办公',
    iconUrl: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=80&q=60',
    children: [
      { id: 'laptop', name: '轻薄本' },
      { id: 'gaming', name: '游戏本' },
      { id: 'printer', name: '外设办公' },
    ],
  },
  {
    id: 'home',
    name: '居家生活',
    iconUrl: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=80&q=60',
    children: [
      { id: 'furniture', name: '品质家具' },
      { id: 'kitchen', name: '厨房生活' },
      { id: 'decoration', name: '家居装饰' },
    ],
  },
  {
    id: 'fashion',
    name: '时尚穿搭',
    iconUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=80&q=60',
    children: [
      { id: 'men', name: '男装精选' },
      { id: 'women', name: '女装潮流' },
      { id: 'shoes', name: '鞋靴箱包' },
    ],
  },
  {
    id: 'beauty',
    name: '美妆护肤',
    iconUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=80&q=60',
    children: [
      { id: 'skincare', name: '护肤爆品' },
      { id: 'makeup', name: '彩妆香水' },
      { id: 'care', name: '个护清洁' },
    ],
  },
  {
    id: 'food',
    name: '品质食品',
    iconUrl: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=80&q=60',
    children: [
      { id: 'snack', name: '休闲零食' },
      { id: 'drink', name: '酒水饮料' },
      { id: 'fresh', name: '生鲜果蔬' },
    ],
  },
  {
    id: 'sports',
    name: '运动户外',
    iconUrl: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=80&q=60',
    children: [
      { id: 'fitness', name: '健身装备' },
      { id: 'cycling', name: '骑行滑板' },
      { id: 'camping', name: '户外露营' },
    ],
  },
]

const quickLinks: HomeContent['quickLinks'] = [
  {
    id: 'supermarket',
    title: 'ecom-lab超市',
    description: '自营爆款直达',
    iconUrl: 'https://img.icons8.com/color/96/shopping-cart.png',
    href: '/products?categoryId=food',
  },
  {
    id: 'fresh',
    title: 'ecom-lab生鲜',
    description: '冷链极速达',
    iconUrl: 'https://img.icons8.com/color/96/salmon.png',
    href: '/products?categoryId=fresh',
  },
  {
    id: 'global',
    title: 'ecom-lab国际',
    description: '全球好物精选',
    iconUrl: 'https://img.icons8.com/color/96/globe.png',
    href: '/products?categoryId=global',
  },
  {
    id: 'vip',
    title: 'PLUS会员',
    description: '运费券随心用',
    iconUrl: 'https://img.icons8.com/color/96/crown.png',
    href: '/account',
  },
  {
    id: 'fashion',
    title: 'ecom-lab时尚',
    description: '穿搭灵感热销',
    iconUrl: 'https://img.icons8.com/color/96/t-shirt.png',
    href: '/products?categoryId=fashion',
  },
  {
    id: 'health',
    title: 'ecom-lab健康',
    description: '关爱每一天',
    iconUrl: 'https://img.icons8.com/color/96/heart-with-pulse.png',
    href: '/products?categoryId=health',
  },
]

const flashSaleItems: HomeContent['flashSale']['items'] = [
  {
    id: 'flash-1',
    name: '65英寸4K量子点电视',
    imageUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&q=80',
    salePrice: 4299,
    originalPrice: 5999,
    currency: 'CNY',
    soldPercent: 82,
    tag: '限时抢购',
  },
  {
    id: 'flash-2',
    name: '苹果 iPhone 16 Pro 256G',
    imageUrl: 'https://images.unsplash.com/photo-1512499617640-c2f999018b72?w=600&q=80',
    salePrice: 8299,
    originalPrice: 8999,
    currency: 'CNY',
    soldPercent: 56,
  },
  {
    id: 'flash-3',
    name: '空气炸锅 5L 家庭版',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31b?w=600&q=80',
    salePrice: 299,
    originalPrice: 499,
    currency: 'CNY',
    soldPercent: 68,
    tag: '爆款直降',
  },
  {
    id: 'flash-4',
    name: '筋膜枪 智能变速版',
    imageUrl: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80',
    salePrice: 469,
    originalPrice: 699,
    currency: 'CNY',
    soldPercent: 74,
  },
]

const brands: HomeContent['brands'] = [
  {
    id: 'midea',
    name: '美的生活季',
    tagline: '爆款家电低至 7 折',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-0ef3c08c0632?w=400&q=80',
    href: '/products?categoryId=electronics',
  },
  {
    id: 'nike',
    name: 'NIKE夏日出街',
    tagline: '会员享专属折扣',
    imageUrl: 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?w=400&q=80',
    href: '/products?categoryId=sports',
  },
  {
    id: 'lenovo',
    name: '联想开学季',
    tagline: '高性能轻薄本立减 800',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80',
    href: '/products?categoryId=computers',
  },
  {
    id: 'loreal',
    name: '欧莱雅618专场',
    tagline: '买 1 享 3 重礼',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80',
    href: '/products?categoryId=beauty',
  },
]

const floors: HomeContent['floors'] = [
  {
    id: 'floor-1',
    title: '1F 家电数码',
    subtitle: '科技焕新季',
    themeColor: '#ff4d4f',
    products: [
      {
        id: 'floor1-1',
        name: '索尼 65 寸 OLED 旗舰电视',
        imageUrl: 'https://images.unsplash.com/photo-1580894897200-2c1cfb5d7cd0?w=520&q=80',
        price: 9999,
        currency: 'CNY',
        tags: ['新品上市'],
      },
      {
        id: 'floor1-2',
        name: '戴森 V12 Detect 吸尘器',
        imageUrl: 'https://images.unsplash.com/photo-1616628182507-0ff1fcecdf2a?w=520&q=80',
        price: 4299,
        currency: 'CNY',
        tags: ['直降600'],
      },
      {
        id: 'floor1-3',
        name: '佳能 EOS R7 微单套机',
        imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=520&q=80',
        price: 7999,
        currency: 'CNY',
        tags: ['热销榜'],
      },
      {
        id: 'floor1-4',
        name: 'BOSE 智能降噪耳机 QC Ultra',
        imageUrl: 'https://images.unsplash.com/photo-1511963211024-6cefacb67f04?w=520&q=80',
        price: 2399,
        currency: 'CNY',
      },
    ],
  },
  {
    id: 'floor-2',
    title: '2F 潮流穿搭',
    subtitle: '夏日穿搭灵感',
    themeColor: '#fa8c16',
    products: [
      {
        id: 'floor2-1',
        name: '阿迪达斯 透气跑鞋',
        imageUrl: 'https://images.unsplash.com/photo-1517677129300-07b130802f46?w=520&q=80',
        price: 699,
        currency: 'CNY',
        tags: ['热卖'],
      },
      {
        id: 'floor2-2',
        name: '优衣库 Airism POLO',
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=520&q=80',
        price: 199,
        currency: 'CNY',
        tags: ['必买清单'],
      },
      {
        id: 'floor2-3',
        name: 'CK 极简双肩包',
        imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=520&q=80',
        price: 1380,
        currency: 'CNY',
      },
      {
        id: 'floor2-4',
        name: '雷朋 经典飞行员墨镜',
        imageUrl: 'https://images.unsplash.com/photo-1502901930015-158e722ed37b?w=520&q=80',
        price: 1199,
        currency: 'CNY',
        tags: ['折扣专区'],
      },
    ],
  },
  {
    id: 'floor-3',
    title: '3F 智慧居家',
    subtitle: '品质生活提案',
    themeColor: '#13c2c2',
    products: [
      {
        id: 'floor3-1',
        name: '石头自清洁扫拖机器人',
        imageUrl: 'https://images.unsplash.com/photo-1586201375754-578c6ee0aea3?w=520&q=80',
        price: 3299,
        currency: 'CNY',
      },
      {
        id: 'floor3-2',
        name: '九阳 破壁料理机',
        imageUrl: 'https://images.unsplash.com/photo-1536520002442-39764a41e04d?w=520&q=80',
        price: 899,
        currency: 'CNY',
        tags: ['爆款推荐'],
      },
      {
        id: 'floor3-3',
        name: 'Delonghi 家用咖啡机',
        imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=520&q=80',
        price: 2799,
        currency: 'CNY',
      },
      {
        id: 'floor3-4',
        name: 'Nespresso 咖啡胶囊礼盒',
        imageUrl: 'https://images.unsplash.com/photo-1527169402691-feff5539e52c?w=520&q=80',
        price: 369,
        currency: 'CNY',
      },
    ],
  },
]

const staticHomeContent: HomeContent = {
  categories,
  quickLinks,
  flashSale: {
    endsAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    items: flashSaleItems,
  },
  brands,
  floors,
}

export const createHomeContent = (): HomeContent => ({
  ...staticHomeContent,
  flashSale: {
    ...staticHomeContent.flashSale,
    endsAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  },
})
