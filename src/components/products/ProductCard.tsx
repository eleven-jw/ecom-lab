import { Button, Card, Rate, Tag, Typography, message } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { useMemo, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import type { Product } from '../../services/types'
import { CART_MAX_ITEMS, addItem } from '../../store/slices/cartSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

interface ProductCardProps {
  product: Product
}

const formatCurrency = (amount: number, currency: string) => {
  const formatter = new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: currency === 'CNY' ? 0 : 2,
    maximumFractionDigits: currency === 'CNY' ? 0 : 2,
  })
  const symbol = currency === 'CNY' ? '¥' : currency === 'USD' ? '$' : ''
  return `${symbol}${formatter.format(amount)}${symbol ? '' : ` ${currency}`}`
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector((state) => state.cart.items)
  const { t } = useTranslation()

  const cartTotal = useMemo(
    () => cartItems.reduce((accumulator, item) => accumulator + item.quantity, 0),
    [cartItems],
  )

  const handleQuickAdd = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    event.preventDefault()

    const skuId = product.id
    const existing = cartItems.find((item) => item.productId === product.id && item.skuId === skuId)
    const existingQuantity = existing?.quantity ?? 0
    const available = CART_MAX_ITEMS - (cartTotal - existingQuantity)

    if (available <= existingQuantity) {
      message.warning(t('messages.cartLimitReached', { max: CART_MAX_ITEMS }))
      return
    }

    const addable = Math.max(0, Math.min(1, available - existingQuantity))
    if (addable <= 0) {
      message.warning(t('messages.cartLimitReached', { max: CART_MAX_ITEMS }))
      return
    }

    dispatch(
      addItem({
        productId: product.id,
        skuId,
        skuLabel: t('components.productCard.defaultSku'),
        name: product.name,
        imageUrl: product.imageUrl,
        unitPrice: product.price,
        currency: product.currency,
        quantity: addable,
      }),
    )
    message.success(t('messages.cartAdded'))
  }

  return (
    <Card
      hoverable
      variant="borderless"
      className="product-card"
      onClick={() => navigate(`/products/${product.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          if (event.key === ' ') event.preventDefault()
          navigate(`/products/${product.id}`)
        }
      }}
      cover={<img src={product.imageUrl} alt={product.name} loading="lazy" />}
    >
      <Typography.Title level={5} className="product-card__title" ellipsis={{ rows: 2 }}>
        {product.name}
      </Typography.Title>
      <Typography.Paragraph type="secondary" ellipsis={{ rows: 2 }}>
        {product.description}
      </Typography.Paragraph>
      <div className="product-card__meta">
        <Typography.Text className="product-card__price">
          {formatCurrency(product.price, product.currency)}
        </Typography.Text>
        {product.rating ? (
          <div className="product-card__rating">
            <Rate allowHalf disabled value={product.rating} />
            {product.reviewCount ? (
              <Typography.Text type="secondary">({product.reviewCount})</Typography.Text>
            ) : null}
          </div>
        ) : null}
      </div>
      {product.tags?.length ? (
        <div className="product-card__tags">
          {product.tags.map((tag) => (
            <Tag key={`${product.id}-${tag}`} color="blue">
              {tag}
            </Tag>
          ))}
        </div>
      ) : null}
      <div className="product-card__actions">
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          block
          onClick={handleQuickAdd}
        >
          {t('components.productCard.addToCart')}
        </Button>
      </div>
    </Card>
  )
}

export default ProductCard
