import { Card, Rate, Tag, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

import type { Product } from '../../services/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate()

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
          {product.currency === 'CNY' ? `¥${product.price}` : `$${product.price}`}
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
    </Card>
  )
}

export default ProductCard
