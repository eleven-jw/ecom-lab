import { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Input,
  Modal,
  Rate,
  Result,
  Segmented,
  Skeleton,
  Space,
  Tag,
  Typography,
  message,
  Radio
} from 'antd'
import { useNavigate, useParams } from 'react-router-dom'

import { RegionCascader } from '../components/address/RegionCascader'
import type { AddressFormValues } from '../components/address/AddressFormDrawer'
import { useGetProductByIdQuery } from '../services/api'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addAddress, selectAddress } from '../store/slices/addressSlice'
import { CART_MAX_ITEMS, addItem } from '../store/slices/cartSlice'
import { addOrder } from '../store/slices/ordersSlice'
import type { ProductReview } from '../services/types'
import './ProductDetailPage.css'

type ReviewFilter = 'all' | 'positive' | 'withPhotos'

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
  const dispatch = useAppDispatch()
  const addresses = useAppSelector((state) => state.address.addresses)
  const selectedAddressId = useAppSelector((state) => state.address.selectedAddressId)
  const selectedAddress = addresses.find((address) => address.id === selectedAddressId)
  const cartItems = useAppSelector((state) => state.cart.items)
  const orders = useAppSelector((state) => state.orders.orders)
  const auth = useAppSelector((state) => state.auth)

  const {
    data: product,
    isFetching,
    isLoading,
    isError,
  } = useGetProductByIdQuery(productId ?? '', {
    skip: !productId,
  })

  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState<number>(1)
  const [addressModalOpen, setAddressModalOpen] = useState(false)
  const [addingAddress, setAddingAddress] = useState(false)
  const [addressForm] = Form.useForm<AddressFormValues>()
  const [reviewForm] = Form.useForm<{ rating: number; content: string; photos?: string }>()
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('all')
  const [reviews, setReviews] = useState<ProductReview[]>(product?.reviews ?? [])

  useEffect(() => {
    if (product?.skus?.length) {
      setSelectedAttributes(product.skus[0].attributes)
      setQuantity(1)
    } else {
      setSelectedAttributes({})
    }
    setReviews(product?.reviews ?? [])
    setReviewFilter('all')
  }, [product?.id, product?.skus, product?.reviews])

  const cartTotal = useMemo(
    () => cartItems.reduce((accumulator, item) => accumulator + item.quantity, 0),
    [cartItems],
  )

  const matchedSku = useMemo(() => {
    if (!product?.skus?.length) return undefined
    return product.skus.find((sku) =>
      Object.entries(sku.attributes).every(([key, value]) => selectedAttributes[key] === value),
    )
  }, [product?.skus, selectedAttributes])

  useEffect(() => {
    if (matchedSku) {
      setQuantity((prev) => {
        if (matchedSku.stock <= 0) return 1
        return Math.min(prev, matchedSku.stock)
      })
    }
  }, [matchedSku])

  const attributes = product?.attributes ?? []
  const stock = matchedSku?.stock ?? 0
  const maxQuantity = stock > 0 ? stock : 1
  const isOutOfStock = stock === 0
  const displayPrice = matchedSku?.price ?? product?.price ?? 0
  const displayImage = matchedSku?.imageUrl ?? product?.imageUrl ?? ''

  const ratingText = useMemo(() => {
    if (!reviews.length && !product?.rating) return null
    const average = reviews.length
      ? reviews.reduce((accumulator, review) => accumulator + review.rating, 0) / reviews.length
      : product?.rating ?? 0
    const base = average.toFixed(1)
    const count = reviews.length || product?.reviewCount
    if (count) {
      return `${base}（${count} 条评价）`
    }
    return base
  }, [product?.rating, product?.reviewCount, reviews])

  const positiveCount = useMemo(
    () => reviews.filter((review) => review.rating >= 4).length,
    [reviews],
  )
  const photoCount = useMemo(
    () => reviews.filter((review) => review.photos && review.photos.length > 0).length,
    [reviews],
  )

  const filteredReviews = useMemo(() => {
    if (reviewFilter === 'positive') {
      return reviews.filter((review) => review.rating >= 4)
    }
    if (reviewFilter === 'withPhotos') {
      return reviews.filter((review) => review.photos && review.photos.length > 0)
    }
    return reviews
  }, [reviews, reviewFilter])

  const hasPurchased = useMemo(() => {
    if (!product?.id) return false
    return orders.some((order) => order.items.some((item) => item.productId === product.id))
  }, [orders, product?.id])

  const hasReviewed = auth.user ? reviews.some((review) => review.userId === auth.user.id) : false
  const canReview =
    auth.status === 'authenticated' && Boolean(auth.user) && hasPurchased && !hasReviewed

  const handleAddToCart = () => {
    if (!product || !matchedSku || isOutOfStock) return

    const existing = cartItems.find(
      (item) => item.productId === product.id && item.skuId === matchedSku.id,
    )
    const existingQuantity = existing?.quantity ?? 0
    const available = CART_MAX_ITEMS - (cartTotal - existingQuantity)

    if (available <= existingQuantity) {
      message.warning(`购物车最多可添加 ${CART_MAX_ITEMS} 件商品`)
      return
    }

    const addable = Math.min(quantity, available - existingQuantity)
    if (addable <= 0) {
      message.warning(`购物车最多可添加 ${CART_MAX_ITEMS} 件商品`)
      return
    }

    dispatch(
      addItem({
        productId: product.id,
        skuId: matchedSku.id,
        skuLabel: matchedSku.skuLabel,
        name: product.name,
        imageUrl: displayImage,
        unitPrice: matchedSku.price,
        currency: product.currency,
        quantity: addable,
      }),
    )
    const messageText = addable < quantity ? '部分数量未添加，已达到购物车上限' : '已加入购物车'
    message.success(messageText)
  }

  const handleBuyNow = () => {
    if (!product || !matchedSku || isOutOfStock) return
    if (!selectedAddress) {
      message.warning('请先选择收货地址')
      setAddressModalOpen(true)
      return
    }

    dispatch(
      addOrder({
        items: [
          {
            productId: product.id,
            name: product.name,
            imageUrl: displayImage,
            skuLabel: matchedSku.skuLabel,
            quantity,
            price: matchedSku.price,
            currency: product.currency,
          },
        ],
        totalAmount: matchedSku.price * quantity,
        currency: product.currency,
        address: selectedAddress,
        paymentMethod: 'wechat',
      }),
    )
    message.success('已创建订单，可前往订单中心查看')
    navigate('/account/orders')
  }

  const handleAddAddress = async () => {
    try {
      const values = await addressForm.validateFields()
      if (!values.region) {
        message.error('请选择完整的省市区信息')
        return
      }

      if (addresses.length >= 25) {
        message.warning('地址数量已达上限（25 个）')
        return
      }

      dispatch(
        addAddress({
          label: values.label,
          recipient: values.recipient,
          phone: values.phone,
          line1: values.line1,
          region: values.region.province,
          city: values.region.city,
          district: values.region.district,
          postalCode: values.postalCode,
          isDefault: values.isDefault ?? false,
        }),
      )
      message.success('新增地址成功')
      addressForm.resetFields()
      setAddingAddress(false)
    } catch (error) {
      // 表单校验失败无需处理
    }
  }

  const handleReviewSubmit = async (values: { rating: number; content: string; photos?: string }) => {
    if (!auth.user) return
    const photos = values.photos
      ? values.photos
          .split(',')
          .map((url) => url.trim())
          .filter(Boolean)
      : undefined
    const newReview: ProductReview = {
      id: `local-${Date.now()}`,
      userId: auth.user.id,
      userName: auth.user.fullName,
      rating: values.rating,
      content: values.content,
      createdAt: new Date().toISOString(),
      photos,
    }
    setReviews((previous) => [newReview, ...previous])
    reviewForm.resetFields()
    message.success('感谢您的评价')
  }

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

  if ((isLoading || isFetching) && !product) {
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
          <img src={displayImage} alt={product.name} loading="lazy" />
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
              {formatCurrency(displayPrice, product.currency)}
            </Text>
            {ratingText ? (
              <div className="product-detail__rating">
                <Rate allowHalf disabled value={reviews.length ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : product.rating ?? 0} />
                <Text type="secondary">{ratingText}</Text>
              </div>
            ) : null}
          </div>

          {attributes.length ? (
            <div className="product-detail__attributes">
              {attributes.map((attribute) => (
                <div key={attribute.name} className="product-detail__attribute">
                  <Text strong>{attribute.name}</Text>
                  <div className="product-detail__attribute-options">
                    {attribute.values.map((value) => {
                      const tentativeSelection = { ...selectedAttributes, [attribute.name]: value }
                      const available = product.skus?.some((sku) =>
                        Object.entries(tentativeSelection).every(([key, val]) => sku.attributes[key] === val),
                      )
                      return (
                        <Tag.CheckableTag
                          key={value}
                          checked={selectedAttributes[attribute.name] === value}
                          disabled={!available}
                          onChange={() => {
                            if (!available) return
                            setSelectedAttributes((previous) => ({
                              ...previous,
                              [attribute.name]: value,
                            }))
                          }}
                        >
                          {value}
                        </Tag.CheckableTag>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <div className="product-detail__stock">
            <Text type={isOutOfStock ? 'danger' : 'secondary'}>
              {isOutOfStock ? '库存不足' : `库存：${stock} 件`}
            </Text>
          </div>

          <div className="product-detail__quantity">
            <Text strong>购买数量</Text>
            <Space size={8} align="center">
              <Button
                disabled={quantity <= 1}
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              >
                -
              </Button>
              <Text>{quantity}</Text>
              <Button
                disabled={quantity >= maxQuantity}
                onClick={() => setQuantity((current) => Math.min(maxQuantity, current + 1))}
              >
                +
              </Button>
            </Space>
            {isOutOfStock ? (
              <Text type="danger">当前规格暂时缺货</Text>
            ) : (
              <Text type="secondary">库存：{stock}</Text>
            )}
          </div>

          <div className="product-detail__address">
            <div className="product-detail__address-header">
              <Text strong>收货地址</Text>
              <Button type="link" size="small" onClick={() => setAddressModalOpen(true)}>
                {selectedAddress ? '更换地址' : '添加地址'}
              </Button>
            </div>
            {selectedAddress ? (
              <div className="product-detail__address-card">
                <Text>
                  {selectedAddress.recipient}（{selectedAddress.phone}）
                </Text>
                <Text type="secondary">
                  {selectedAddress.region} {selectedAddress.city} {selectedAddress.district}{' '}
                  {selectedAddress.line1}
                </Text>
              </div>
            ) : (
              <Text type="secondary">尚未选择收货地址</Text>
            )}
          </div>

          <div className="product-detail__actions">
            <Button size="large" onClick={handleAddToCart} disabled={!matchedSku || isOutOfStock}>
              加入购物车
            </Button>
            <Button
              size="large"
              type="primary"
              onClick={handleBuyNow}
              disabled={!matchedSku || isOutOfStock}
            >
              立即购买
            </Button>
          </div>
        </div>
      </div>

      <Divider style={{ margin: '32px 0 24px' }} />

      <section className="product-detail__reviews">
        <Title level={4}>用户评价</Title>

        <div className="product-detail__reviews-header">
          <div className="product-detail__reviews-summary">
            <Rate
              allowHalf
              disabled
              value={reviews.length
                ? reviews.reduce((accumulator, review) => accumulator + review.rating, 0) / reviews.length
                : product.rating ?? 0}
            />
            <Text type="secondary">共 {reviews.length || product.reviewCount || 0} 条评价</Text>
          </div>
          <Segmented
            value={reviewFilter}
            onChange={(value) => setReviewFilter(value as ReviewFilter)}
            options={[
              { label: '全部', value: 'all' },
              { label: `好评 (${positiveCount})`, value: 'positive' },
              { label: `晒图 (${photoCount})`, value: 'withPhotos' },
            ]}
          />
        </div>

        {filteredReviews.length ? (
          <div className="product-detail__review-list">
            {filteredReviews.map((review) => (
              <div key={review.id} className="product-detail__review-item">
                <div className="product-detail__review-header">
                  <Text strong>{review.userName}</Text>
                  <Rate allowHalf disabled value={review.rating} />
                </div>
                <Paragraph>{review.content}</Paragraph>
                {review.photos && review.photos.length ? (
                  <div className="product-detail__review-photos">
                    {review.photos.map((photoUrl) => (
                      <img key={photoUrl} src={photoUrl} alt="晒单" loading="lazy" />
                    ))}
                  </div>
                ) : null}
                <Text type="secondary" className="product-detail__review-date">
                  {new Date(review.createdAt).toLocaleString()}
                </Text>
              </div>
            ))}
          </div>
        ) : (
          <Text type="secondary">暂无符合筛选条件的评价</Text>
        )}

        {canReview ? (
          <Card className="product-detail__review-form" variant="outlined">
            <Title level={5}>发表评价</Title>
            <Form form={reviewForm} layout="vertical" onFinish={handleReviewSubmit}>
              <Form.Item
                label="评分"
                name="rating"
                rules={[{ required: true, message: '请为商品打分' }]}
              >
                <Rate allowHalf />
              </Form.Item>
              <Form.Item
                label="评价内容"
                name="content"
                rules={[{ required: true, message: '请输入评价内容' }]}
              >
                <Input.TextArea
                  placeholder="分享使用体验，帮助更多用户~"
                  autoSize={{ minRows: 3, maxRows: 5 }}
                  maxLength={300}
                  showCount
                />
              </Form.Item>
              <Form.Item label="晒图（可选）" name="photos">
                <Input placeholder="输入图片 URL，多个用逗号分隔" allowClear />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                提交评价
              </Button>
            </Form>
          </Card>
        ) : auth.status === 'authenticated' ? (
          <Text type="secondary">
            {hasReviewed ? '您已评价过该商品' : '完成购买后即可发表评论'}
          </Text>
        ) : (
          <Text type="secondary">登录并完成购买后可发表评论</Text>
        )}
      </section>

      <Modal
        title="选择收货地址"
        open={addressModalOpen}
        onCancel={() => {
          setAddressModalOpen(false)
          setAddingAddress(false)
        }}
        onOk={() => {
          setAddressModalOpen(false)
          setAddingAddress(false)
        }}
        okText="完成"
        cancelText="取消"
        destroyOnClose
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Radio.Group
            value={selectedAddressId}
            onChange={(event) => dispatch(selectAddress(event.target.value))}
            className="product-detail__address-group"
          >
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              {addresses.map((address) => (
                <Radio key={address.id} value={address.id} className="product-detail__address-option">
                  <div>
                    <Text strong>
                      {address.recipient}（{address.phone}）
                    </Text>
                    <div>
                      <Text type="secondary">
                        {address.region} {address.city} {address.district} {address.line1}
                      </Text>
                    </div>
                    {address.isDefault ? <Tag color="blue">默认</Tag> : null}
                  </div>
                </Radio>
              ))}
            </Space>
          </Radio.Group>

          <Divider style={{ margin: '8px 0' }} />

          <Button type="dashed" onClick={() => setAddingAddress((previous) => !previous)}>
            {addingAddress ? '收起新增地址' : '新增地址'}
          </Button>

          {addingAddress ? (
            <Form form={addressForm} layout="vertical" className="product-detail__address-form">
              <Form.Item label="地址标签" name="label" rules={[{ required: true, message: '请输入标签' }]}>
                <Input placeholder="家 / 公司" allowClear />
              </Form.Item>
              <Space size={12} style={{ width: '100%' }}>
                <Form.Item
                  label="收件人"
                  name="recipient"
                  rules={[{ required: true, message: '请输入收件人姓名' }]}
                  style={{ flex: 1 }}
                >
                  <Input allowClear />
                </Form.Item>
                <Form.Item
                  label="联系电话"
                  name="phone"
                  rules={[{ required: true, message: '请输入联系电话' }, { pattern: /^1[3-9]\d{9}$/, message: '请输入规范的手机号' }]}
                  style={{ flex: 1 }}
                >
                  <Input allowClear />
                </Form.Item>
              </Space>
              <Form.Item
                label="所在地区"
                name="region"
                rules={[{ required: true, message: '请选择所在地区' }]}
              >
                <RegionCascader />
              </Form.Item>
              <Form.Item label="详细地址" name="line1" rules={[{ required: true, message: '请输入详细地址' }]}>
                <Input allowClear />
              </Form.Item>
              <Form.Item label="邮编" name="postalCode" rules={[{ required: true, message: '请输入邮编' }, { pattern: /^\d{6}$/, message: '邮编为 6 位数字' }]}>
                <Input allowClear />
              </Form.Item>
              <Form.Item name="isDefault" valuePropName="checked">
                <Checkbox>设为默认地址</Checkbox>
              </Form.Item>
              <Button type="primary" block onClick={handleAddAddress}>
                保存地址
              </Button>
            </Form>
          ) : null}
        </Space>
      </Modal>
    </div>
  )
}
