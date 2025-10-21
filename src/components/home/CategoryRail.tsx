import { Card } from 'antd'

import type { HomeCategory } from '../../services/types'

interface CategoryRailProps {
  categories: HomeCategory[]
}

export function CategoryRail({ categories }: CategoryRailProps) {
  if (!categories.length) return null

  return (
    <Card className="category-rail" variant="borderless">
      <div className="category-rail__list">
        {categories.map((category) => {
          const children = category.children?.map((child) => child.name).join(' / ')
          return (
            <div key={category.id} className="category-rail__item">
              {category.iconUrl ? (
                <img
                  src={category.iconUrl}
                  alt={category.name}
                  className="category-rail__icon"
                  loading="lazy"
                />
              ) : null}
              <div className="category-rail__content">
                <span className="category-rail__title">{category.name}</span>
                {children ? (
                  <span className="category-rail__children" title={children}>
                    {children}
                  </span>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default CategoryRail
