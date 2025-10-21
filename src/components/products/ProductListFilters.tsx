import { Button, Card, Divider, Segmented, Space, Tag, Typography } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { Category } from '../../services/types'

const priceOptions = [
  { label: '不限', value: 'all' },
  { label: '0 - 500', value: '0-500' },
  { label: '500 - 1500', value: '500-1500' },
  { label: '1500 - 5000', value: '1500-5000' },
  { label: '5000 以上', value: '5000+' },
]

const sortOptions = [
  { label: '综合', value: 'default' },
  { label: '价格从低到高', value: 'price-asc' },
  { label: '价格从高到低', value: 'price-desc' },
  { label: '销量优先', value: 'sales' },
  { label: '新品优先', value: 'newest' },
]

interface ProductListFiltersProps {
  categories: Category[]
  selectedCategory?: string
  selectedSort?: string
  selectedPrice?: string
  keyword?: string
  collapsed?: boolean
  onToggleCollapse?: () => void
  onCategoryChange: (categoryId?: string) => void
  onSortChange: (sort?: string) => void
  onPriceChange: (range?: string) => void
  onClear: () => void
}

export function ProductListFilters({
  categories,
  selectedCategory,
  selectedSort,
  selectedPrice,
  keyword,
  collapsed = false,
  onToggleCollapse,
  onCategoryChange,
  onSortChange,
  onPriceChange,
  onClear,
}: ProductListFiltersProps) {
  const { t } = useTranslation()

  const activeTags = (
    [
      keyword ? { label: `关键词：${keyword}` } : null,
      selectedCategory
        ? {
            label: `分类：${categories.find((cat) => cat.id === selectedCategory)?.name ?? selectedCategory}`,
          }
        : null,
      selectedPrice && selectedPrice !== 'all'
        ? { label: `价格：${selectedPrice}` }
        : null,
      selectedSort && selectedSort !== 'default'
        ? {
            label: `排序：${sortOptions.find((option) => option.value === selectedSort)?.label ?? selectedSort}`,
          }
        : null,
    ].filter(Boolean) as Array<{ label: string }>
  )

  const displayedCategories = useMemo(() => {
    if (!collapsed) return categories
    const limit = 6
    const initial = categories.slice(0, limit)
    if (!selectedCategory) return initial
    if (initial.some((category) => category.id === selectedCategory)) return initial
    const selected = categories.find((category) => category.id === selectedCategory)
    return selected ? [...initial, selected] : initial
  }, [categories, collapsed, selectedCategory])

  const selectedSortLabel =
    sortOptions.find((option) => option.value === selectedSort)?.label ?? '综合'
  const selectedPriceLabel =
    priceOptions.find((option) => option.value === selectedPrice)?.label ?? '不限'

  return (
    <Card
      className={`product-filters ${collapsed ? 'product-filters--collapsed' : ''}`}
      variant="borderless"
    >
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <div className="product-filters__header">
          <Typography.Text strong>{t('pages.products.filtersTitle')}</Typography.Text>
          <Space size={12}>
            <Typography.Link onClick={onClear}>清空筛选</Typography.Link>
            {onToggleCollapse ? (
              <Button type="text" onClick={() => onToggleCollapse()}>
                {collapsed ? '展开筛选' : '收起筛选'}
              </Button>
            ) : null}
          </Space>
        </div>

        {activeTags.length ? (
          <div className="product-filters__active">
            {activeTags.map((tag) => (
              <Tag key={tag.label} color="blue">
                {tag.label}
              </Tag>
            ))}
          </div>
        ) : null}

        <div className="product-filters__summary">
          <Tag color="default">价格：{selectedPriceLabel}</Tag>
          <Tag color="default">排序：{selectedSortLabel}</Tag>
        </div>

        <Divider style={{ margin: '8px 0' }} />

        <section className="product-filters__section">
          <Typography.Text type="secondary">商品分类</Typography.Text>
          <div className="product-filters__chips">
            <Tag.CheckableTag
              key="all"
              checked={!selectedCategory}
              onChange={(checked) => {
                if (checked) onCategoryChange(undefined)
              }}
            >
              全部
            </Tag.CheckableTag>
            {displayedCategories.map((category) => (
              <Tag.CheckableTag
                key={category.id}
                checked={selectedCategory === category.id}
                onChange={(checked) => {
                  onCategoryChange(checked ? category.id : undefined)
                }}
              >
                {category.name}
              </Tag.CheckableTag>
            ))}
          </div>
        </section>

        {!collapsed ? (
          <>
            <section className="product-filters__section">
              <Typography.Text type="secondary">价格区间</Typography.Text>
              <Segmented
                block
                size="middle"
                value={selectedPrice ?? 'all'}
                onChange={(value) => {
                  const nextValue = value as string
                  onPriceChange(nextValue === 'all' ? undefined : nextValue)
                }}
                options={priceOptions.map((option) => ({ label: option.label, value: option.value }))}
              />
            </section>

            <section className="product-filters__section">
              <Typography.Text type="secondary">排序方式</Typography.Text>
              <Segmented
                block
                size="middle"
                value={selectedSort ?? 'default'}
                onChange={(value) => {
                  const nextValue = value as string
                  onSortChange(nextValue === 'default' ? undefined : nextValue)
                }}
                options={sortOptions.map((option) => ({ label: option.label, value: option.value }))}
              />
            </section>
          </>
        ) : null}
      </Space>
    </Card>
  )
}

export default ProductListFilters
