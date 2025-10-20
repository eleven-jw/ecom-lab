import { Empty, Pagination, Skeleton, Typography } from 'antd'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { SearchBar } from '../components/common/SearchBar'
import { ProductCard } from '../components/products/ProductCard'
import { ProductListFilters } from '../components/products/ProductListFilters'
import { useQueryParams } from '../hooks/useQueryParams'
import { useGetCategoriesQuery, useGetProductsQuery } from '../services/api'
import type { ProductListRequest } from '../services/types'
import './ProductsPage.css'

export default function ProductsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const query = useQueryParams()

  const [page, setPage] = useState(() => Number(query.get('page') ?? '1'))
  const [pageSize, setPageSize] = useState(() => Number(query.get('pageSize') ?? '12'))

  const filters = useMemo(() => {
    const params = query.toObject<ProductListRequest>()
    return {
      keyword: params.keyword,
      categoryId: params.categoryId,
      sort: params.sort,
      priceRange: params.priceRange,
    }
  }, [query])

  const productQueryArgs = useMemo(() => {
    const [minPrice, maxPrice] = (() => {
      if (!filters.priceRange) return []
      if (filters.priceRange.endsWith('+')) {
        const min = Number(filters.priceRange.replace('+', ''))
        return [min, undefined]
      }
      const [minRaw, maxRaw] = filters.priceRange.split('-')
      return [Number(minRaw), Number(maxRaw)]
    })()

    const args: ProductListRequest = {
      page,
      pageSize,
      categoryId: filters.categoryId,
      keyword: filters.keyword,
      sort: filters.sort as ProductListRequest['sort'],
    }

    if (typeof minPrice === 'number' && !Number.isNaN(minPrice)) {
      args.minPrice = minPrice
    }
    if (typeof maxPrice === 'number' && !Number.isNaN(maxPrice)) {
      args.maxPrice = maxPrice
    }

    return args
  }, [filters.categoryId, filters.keyword, filters.priceRange, filters.sort, page, pageSize])

  const { data: categories = [] } = useGetCategoriesQuery()
  const { data, isLoading, isFetching } = useGetProductsQuery(productQueryArgs)

  const syncAndNavigate = (next: Record<string, string | undefined>) => {
    const params = new URLSearchParams(query.toObject<Record<string, string>>())
    Object.entries(next).forEach(([key, value]) => {
      if (!value) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    navigate({ pathname: '/products', search: params.toString() })
  }

  const handleSearch = (value: string) => {
    syncAndNavigate({ keyword: value || undefined, page: '1' })
    setPage(1)
  }

  const handleCategoryChange = (categoryId?: string) => {
    syncAndNavigate({ categoryId, page: '1' })
    setPage(1)
  }

  const handleSortChange = (sort?: string) => {
    syncAndNavigate({ sort, page: '1' })
    setPage(1)
  }

  const handlePriceChange = (priceRange?: string) => {
    syncAndNavigate({ priceRange, page: '1' })
    setPage(1)
  }

  const handleClear = () => {
    navigate('/products')
    setPage(1)
    setPageSize(12)
  }

  const handlePageChange = (nextPage: number, nextPageSize: number) => {
    syncAndNavigate({
      page: String(nextPage),
      pageSize: String(nextPageSize),
    })
    setPage(nextPage)
    setPageSize(nextPageSize)
  }

  const items = data?.items ?? []

  const [filtersExpanded, setFiltersExpanded] = useState(false)

  return (
    <div className="page-container products-page">
      <main className="products-page__content">
        <SearchBar
          placeholder={t('pages.products.searchPlaceholder')}
          buttonText={t('pages.products.searchCta')}
          onSearch={handleSearch}
        />

        <ProductListFilters
          categories={categories}
          keyword={filters.keyword}
          selectedCategory={filters.categoryId}
          selectedPrice={filters.priceRange}
          selectedSort={filters.sort}
          collapsed={!filtersExpanded}
          onToggleCollapse={() => setFiltersExpanded((state) => !state)}
          onCategoryChange={handleCategoryChange}
          onPriceChange={handlePriceChange}
          onSortChange={handleSortChange}
          onClear={handleClear}
        />

        <div className="products-page__actions">
          <div>
            <Typography.Title level={4} style={{ margin: 0 }}>
              {t('pages.products.title')}
            </Typography.Title>
            <Typography.Text type="secondary">
              共 {data?.total ?? 0} 件商品
            </Typography.Text>
          </div>
        </div>

        {isLoading ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : items.length ? (
          <>
            <section className="products-page__grid">
              {(isFetching ? Array.from({ length: pageSize }) : items).map((item, index) =>
                isFetching
                  ? (
                      <Skeleton.Button key={`placeholder-${index}`} active style={{ height: 320 }} />
                    )
                  : (
                      <ProductCard key={item.id} product={item} />
                    ),
              )}
            </section>

            <div className="products-page__pagination">
              <Pagination
                current={page}
                pageSize={pageSize}
                total={data?.total ?? 0}
                onChange={handlePageChange}
                showSizeChanger
              />
            </div>
          </>
        ) : (
          <Empty description="暂无符合条件的商品" style={{ padding: '64px 0' }} />
        )}
      </main>
    </div>
  )
}
