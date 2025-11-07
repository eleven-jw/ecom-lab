import { Card, Tag, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

import type { HomeFloor } from '../../services/types'

interface ProductFloorProps {
  floor: HomeFloor
}

export function ProductFloor({ floor }: ProductFloorProps) {
  if (!floor.products.length) return null
  const navigate = useNavigate()

  return (
    <section className="product-floor">
      <header className="product-floor__header" style={{ borderColor: floor.themeColor }}>
        <Typography.Title level={3}>{floor.title}</Typography.Title>
        <Typography.Text type="secondary">{floor.subtitle}</Typography.Text>
      </header>
      <div className="product-floor__grid">
        {floor.products.map((product) => (
          <Card
            key={product.id}
            hoverable
            variant="borderless"
            className="product-floor__card"
            cover={<img src={product.imageUrl} alt={product.name} loading="lazy" />}
            onClick={() => navigate(`/products/${product.productId}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(keyboardEvent) => {
              if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
                if (keyboardEvent.key === ' ') {
                  keyboardEvent.preventDefault()
                }
                navigate(`/products/${product.productId}`)
              }
            }}
          >
            <Typography.Title level={5} className="product-floor__name" ellipsis={{ rows: 2 }}>
              {product.name}
            </Typography.Title>
            <div className="product-floor__meta">
              <span className="product-floor__price">¥{product.price}</span>
              <div className="product-floor__tags">
                {product.tags?.map((tag) => (
                  <Tag key={tag} color={floor.themeColor}>
                    {tag}
                  </Tag>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default ProductFloor
