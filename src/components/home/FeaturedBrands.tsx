import { Card, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

import type { BrandSpotlight } from '../../services/types'

interface FeaturedBrandsProps {
  brands: BrandSpotlight[]
}

export function FeaturedBrands({ brands }: FeaturedBrandsProps) {
  const navigate = useNavigate()

  if (!brands.length) return null

  return (
    <div className="featured-brands">
      {brands.map((brand) => (
        <Card
          key={brand.id}
          hoverable
          bordered={false}
          className="featured-brands__card"
          onClick={() => navigate(brand.href)}
        >
          <div className="featured-brands__poster">
            <img src={brand.imageUrl} alt={brand.name} loading="lazy" />
          </div>
          <div className="featured-brands__content">
            <Typography.Title level={4}>{brand.name}</Typography.Title>
            {brand.tagline ? (
              <Typography.Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                {brand.tagline}
              </Typography.Paragraph>
            ) : null}
          </div>
        </Card>
      ))}
    </div>
  )
}

export default FeaturedBrands
