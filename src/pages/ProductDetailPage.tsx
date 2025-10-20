import { useMemo } from 'react'
import { Button, Divider, Rate, Result, Skeleton, Tag, Typography } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'

import { useGetProductByIdQuery } from '../services/api'
import './ProductDetailPage.css'

const { Title, Paragraph, Text } = Typography

const currencySymbol: Record<string, string> = {
  CNY: '¥',
  USD: '$',
}

const formatCurrency = (amount: number, currency: string) => {
  const symbol = currencySymbol[currency] ?? currency
  return `${symbol}${amount}`
}

export default function ProductDetailPage() {
  const navigate = useNavigate()
  const { productId } = useParams<{ productId: string }>()

  const {
    data: product,
    isFetching,
    isLoading,
    isError,
  } = useGetProductByIdQuery(productId ?? '', {
    skip: !productId,
  })

  const isBusy = (isLoading || isFetching) && !product

  const ratingText = useMemo(() => {
    if (!product?.rating) return null
    const base = product.rating.toFixed(1)
    if (product.reviewCount) {
      return `${base}（${product.reviewCount} 条评价）`
    }
    return base
  }, [product?.rating, product?.reviewCount])

  if (!productId || isError) {
    return (
      <div className="page-container product-detail-page">
        <Result
          status="404"
          title="未找到该商品"
          subTitle="请检查链接是否正确，或返回商品列表。"
          extra={
            <Button type="primary" onClick={() => navigate('/products')}>
              返回商品列表
            </Button>
          }
        />
      </div>
    )
  }

  if (isBusy) {
    return (
      <div className="page-container product-detail-page">
        <Skeleton active avatar paragraph={{ rows: 12 }} />
      </div>
    )
  }

  if (!product) {
    return null
  }

  return (
    <div className="page-container product-detail-page">
      <div className="product-detail__header">
        <Button type="link" onClick={() => navigate(-1)}>
          返回
        </Button>
      </div>

      <div className="product-detail__body">
        <div className="product-detail__image">
          <img src={product.imageUrl} alt={product.name} loading="lazy" />
        </div>

        <div className="product-detail__meta">
          <Title level={3} className="product-detail__title">
            {product.name}
          </Title>

          <Paragraph type="secondary" className="product-detail__description">
            {product.description}
          </Paragraph>

          <div className="product-detail__pricing">
            <Text className="product-detail__price">
              {formatCurrency(product.price, product.currency)}
            </Text>
            {product.rating ? (
              <div className="product-detail__rating">
                <Rate allowHalf disabled value={product.rating} />
                {ratingText ? <Text type="secondary">{ratingText}</Text> : null}
              </div>
            ) : null}
          </div>

          {product.tags?.length ? (
            <div className="product-detail__tags">
              {product.tags.map((tag) => (
                <Tag key={tag} color="gold" bordered>
                  {tag}
                </Tag>
              ))}
            </div>
          ) : null}

          <div className="product-detail__skus">
            <Text strong>可选规格</Text>
            <div className="product-detail__sku-list">
              {product.skus.map((sku) => (
                <Tag key={sku.id} color="blue">
                  {sku.label} · {formatCurrency(sku.price, product.currency)}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Divider style={{ margin: '32px 0 24px' }} />

      <section className="product-detail__reviews">
        <Title level={4}>用户评价</Title>
        {product.reviews.length ? (
          <div className="product-detail__review-list">
            {product.reviews.map((review) => (
              <div key={review.id} className="product-detail__review-item">
                <div className="product-detail__review-header">
                  <Text strong>{review.userName}</Text>
                  <Rate allowHalf disabled value={review.rating} />
                </div>
                <Paragraph>{review.content}</Paragraph>
                <Text type="secondary" className="product-detail__review-date">
                  {new Date(review.createdAt).toLocaleString()}
                </Text>
              </div>
            ))}
          </div>
        ) : (
          <Text type="secondary">还没有评价，快来抢沙发吧～</Text>
        )}
      </section>
    </div>
  )
}
