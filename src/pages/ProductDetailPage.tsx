import { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Input,
  Modal,
  Radio,
  Rate,
  Result,
  Segmented,
  Skeleton,
  Space,
  Tag,
  Typography,
  Upload,
  message,
} from 'antd'
import type { UploadFile, UploadProps } from 'antd'
import type { RcFile } from 'antd/es/upload'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

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

const MAX_REVIEW_PHOTOS = 5
const ADDRESS_MAX = 25

const fileToBase64 = (file: RcFile) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

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
  const { t } = useTranslation()

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
  const [reviewForm] = Form.useForm<{ rating: number; content: string }>()
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('all')
  const [reviews, setReviews] = useState<ProductReview[]>(product?.reviews ?? [])
  const [reviewUploads, setReviewUploads] = useState<UploadFile[]>([])
  const [previewImage, setPreviewImage] = useState<string>()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewTitle, setPreviewTitle] = useState<string>()

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

  const averageRating = useMemo(() => {
    if (!reviews.length) {
      return product?.rating ?? 0
    }
    const total = reviews.reduce((accumulator, review) => accumulator + review.rating, 0)
    return total / reviews.length
  }, [product?.rating, reviews])

  const totalReviewCount = useMemo(
    () => reviews.length || product?.reviewCount || 0,
    [product?.reviewCount, reviews.length],
  )

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

  const reviewFilterOptions = useMemo(
    () => [
      { label: t('pages.productDetail.filters.all'), value: 'all' },
      {
        label: t('pages.productDetail.filters.positive', { count: positiveCount }),
        value: 'positive',
      },
      {
        label: t('pages.productDetail.filters.withPhotos', { count: photoCount }),
        value: 'withPhotos',
      },
    ],
    [photoCount, positiveCount, t],
  )

  const hasPurchased = useMemo(() => {
    if (!product?.id) return false
    return orders.some((order) => order.items.some((item) => item.productId === product.id))
  }, [orders, product?.id])

  const hasReviewed = auth.user ? reviews.some((review) => review.userId === auth.user.id) : false
  const canReview =
    auth.status === 'authenticated' && Boolean(auth.user) && hasPurchased && !hasReviewed

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await fileToBase64(file.originFileObj as RcFile)
    }
    setPreviewImage((file.url ?? (file.preview as string)) ?? undefined)
    setPreviewOpen(true)
    setPreviewTitle(file.name || file.url || t('pages.productDetail.reviewForm.photosLabel'))
  }

  const handleReviewBeforeUpload: UploadProps['beforeUpload'] = async (file) => {
    if (reviewUploads.length >= MAX_REVIEW_PHOTOS) {
      message.warning(t('components.upload.limitReached', { max: MAX_REVIEW_PHOTOS }))
      return Upload.LIST_IGNORE
    }
    try {
      const base64 = await fileToBase64(file as RcFile)
      setReviewUploads((previous) => {
        const filtered = previous.filter((item) => item.uid !== file.uid)
        return [
          ...filtered,
          {
            uid: file.uid,
            name: file.name,
            status: 'done',
            url: base64,
          },
        ]
      })
    } catch (error) {
      message.error(t('components.upload.error'))
    }
    return false
  }

  const handleReviewRemove: UploadProps['onRemove'] = (file) => {
    setReviewUploads((previous) => previous.filter((item) => item.uid !== file.uid))
    return true
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>{t('components.upload.add')}</div>
    </div>
  )

  const handleAddToCart = () => {
    if (!product || !matchedSku || isOutOfStock) return

    const existing = cartItems.find(
      (item) => item.productId === product.id && item.skuId === matchedSku.id,
    )
    const existingQuantity = existing?.quantity ?? 0
    const available = CART_MAX_ITEMS - (cartTotal - existingQuantity)

    if (available <= existingQuantity) {
      message.warning(t('messages.cartLimitReached', { max: CART_MAX_ITEMS }))
      return
    }

    const addable = Math.min(quantity, available - existingQuantity)
    if (addable <= 0) {
      message.warning(t('messages.cartLimitReached', { max: CART_MAX_ITEMS }))
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
    const messageText =
      addable < quantity
        ? t('messages.cartPartialAdd')
        : t('messages.cartAdded')
    if (addable < quantity) {
      message.warning(messageText)
    } else {
      message.success(messageText)
    }
  }

  const handleBuyNow = () => {
    if (!product || !matchedSku || isOutOfStock) return
    if (!selectedAddress) {
      message.warning(t('messages.addressSelectPrompt'))
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
    message.success(t('messages.orderCreated'))
    navigate('/account/orders')
  }

  const handleAddAddress = async () => {
    try {
      const values = await addressForm.validateFields()
      if (!values.region) {
        message.error(t('messages.addressRegionRequired'))
        return
      }

      if (addresses.length >= ADDRESS_MAX) {
        message.warning(t('messages.addressLimitReached', { max: ADDRESS_MAX }))
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
      message.success(t('messages.addressSaved'))
      addressForm.resetFields()
      setAddingAddress(false)
    } catch (error) {
      // 表单校验失败无需处理
    }
  }

  const handleReviewSubmit = async (values: { rating: number; content: string }) => {
    const user = auth.user
    if (!user) return
    const photos = reviewUploads.length
      ? (
          await Promise.all(
            reviewUploads.map(async (file) => {
              if (file.url) return file.url
              if (file.thumbUrl) return file.thumbUrl
              if (file.originFileObj) {
                return await fileToBase64(file.originFileObj as RcFile)
              }
              return undefined
            }),
          )
        ).filter((url): url is string => Boolean(url))
      : undefined
    const newReview: ProductReview = {
      id: `local-${Date.now()}`,
      userId: user.id,
      userName: user.fullName,
      rating: values.rating,
      content: values.content,
      createdAt: new Date().toISOString(),
      photos,
    }
    setReviews((previous) => [newReview, ...previous])
    reviewForm.resetFields()
    setReviewUploads([])
    message.success(t('messages.reviewThanks'))
  }

  if (!productId || isError) {
    return (
      <div className="page-container product-detail-page">
        <Result
          status="404"
          title={t('pages.productDetail.notFoundTitle')}
          subTitle={t('pages.productDetail.notFoundDescription')}
          extra={
            <Button type="primary" onClick={() => navigate('/products')}>
              {t('pages.productDetail.backToList')}
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
          {t('pages.productDetail.back')}
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
            {totalReviewCount > 0 || averageRating > 0 ? (
              <div className="product-detail__rating">
                <Rate allowHalf disabled value={averageRating} />
                <Text type="secondary">
                  {averageRating.toFixed(1)} · {t('pages.productDetail.reviewsTotal', { count: totalReviewCount })}
                </Text>
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
                          aria-disabled={!available}
                          onChange={(checked) => {
                            if (!available || !checked) return
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
              {isOutOfStock
                ? t('pages.productDetail.outOfStock')
                : t('pages.productDetail.stockLabel', { count: stock })}
            </Text>
          </div>

          <div className="product-detail__quantity">
            <Text strong>{t('pages.productDetail.quantity')}</Text>
            <Space size={8} align="center">
              <Button
                disabled={quantity <= 1}
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                aria-label="decrease quantity"
              >
                -
              </Button>
              <Text>{quantity}</Text>
              <Button
                disabled={quantity >= maxQuantity}
                onClick={() => setQuantity((current) => Math.min(maxQuantity, current + 1))}
                aria-label="increase quantity"
              >
                +
              </Button>
            </Space>
            {isOutOfStock ? (
              <Text type="danger">{t('pages.productDetail.skuUnavailable')}</Text>
            ) : (
              <Text type="secondary">
                {t('pages.productDetail.quantityInStock', { count: stock })}
              </Text>
            )}
          </div>

          <div className="product-detail__address">
            <div className="product-detail__address-header">
              <Text strong>{t('pages.productDetail.addressTitle')}</Text>
              <Button type="link" size="small" onClick={() => setAddressModalOpen(true)}>
                {selectedAddress
                  ? t('pages.productDetail.changeAddress')
                  : t('pages.productDetail.addAddress')}
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
              <Text type="secondary">{t('pages.productDetail.noAddress')}</Text>
            )}
          </div>

          <div className="product-detail__actions">
            <Button size="large" onClick={handleAddToCart} disabled={!matchedSku || isOutOfStock}>
              {t('pages.productDetail.addToCart')}
            </Button>
            <Button
              size="large"
              type="primary"
              onClick={handleBuyNow}
              disabled={!matchedSku || isOutOfStock}
            >
              {t('pages.productDetail.buyNow')}
            </Button>
          </div>
        </div>
      </div>

      <Divider style={{ margin: '32px 0 24px' }} />

      <section className="product-detail__reviews">
        <Title level={4}>{t('pages.productDetail.reviewsTitle')}</Title>

        <div className="product-detail__reviews-header">
          <div className="product-detail__reviews-summary">
            <Rate allowHalf disabled value={averageRating} />
            <Text type="secondary">
              {t('pages.productDetail.reviewsTotal', { count: totalReviewCount })}
            </Text>
          </div>
          <Segmented
            value={reviewFilter}
            onChange={(value) => setReviewFilter(value as ReviewFilter)}
            options={reviewFilterOptions}
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
                      <img key={photoUrl} src={photoUrl} alt={review.userName} loading="lazy" />
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
          <Text type="secondary">{t('pages.productDetail.noFilteredReviews')}</Text>
        )}

        {canReview ? (
          <Card className="product-detail__review-form" variant="outlined">
            <Title level={5}>{t('pages.productDetail.reviewForm.title')}</Title>
            <Form form={reviewForm} layout="vertical" onFinish={handleReviewSubmit}>
              <Form.Item
                label={t('pages.productDetail.reviewForm.ratingLabel')}
                name="rating"
                rules={[{ required: true, message: t('pages.productDetail.reviewForm.errors.ratingRequired') }]}
              >
                <Rate allowHalf />
              </Form.Item>
              <Form.Item
                label={t('pages.productDetail.reviewForm.contentLabel')}
                name="content"
                rules={[{ required: true, message: t('pages.productDetail.reviewForm.errors.contentRequired') }]}
              >
                <Input.TextArea
                  placeholder={t('pages.productDetail.reviewForm.contentPlaceholder')}
                  autoSize={{ minRows: 3, maxRows: 5 }}
                  maxLength={300}
                  showCount
                />
              </Form.Item>
              <Form.Item label={t('pages.productDetail.reviewForm.photosLabel')}>
                <Upload
                  listType="picture-card"
                  fileList={reviewUploads}
                  onPreview={handlePreview}
                  onRemove={handleReviewRemove}
                  beforeUpload={handleReviewBeforeUpload}
                >
                  {reviewUploads.length >= MAX_REVIEW_PHOTOS ? null : uploadButton}
                </Upload>
                <Text type="secondary">
                  {t('pages.productDetail.reviewForm.uploadHint', { max: MAX_REVIEW_PHOTOS })}
                </Text>
              </Form.Item>
              <Button type="primary" htmlType="submit">
                {t('pages.productDetail.reviewForm.submit')}
              </Button>
            </Form>
          </Card>
        ) : auth.status === 'authenticated' ? (
          <Text type="secondary">
            {hasReviewed
              ? t('pages.productDetail.reviewState.alreadyReviewed')
              : t('pages.productDetail.reviewState.purchaseRequired')}
          </Text>
        ) : (
          <Text type="secondary">{t('pages.productDetail.reviewState.loginRequired')}</Text>
        )}
      </section>

      <Modal
        open={previewOpen}
        footer={null}
        title={previewTitle}
        onCancel={() => setPreviewOpen(false)}
      >
        {previewImage ? <img alt={previewTitle} style={{ width: '100%' }} src={previewImage} /> : null}
      </Modal>

      <Modal
        title={t('pages.productDetail.addressModal.title')}
        open={addressModalOpen}
        onCancel={() => {
          setAddressModalOpen(false)
          setAddingAddress(false)
        }}
        onOk={() => {
          setAddressModalOpen(false)
          setAddingAddress(false)
        }}
        okText={t('pages.productDetail.addressModal.done')}
        cancelText={t('pages.productDetail.addressModal.cancel')}
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
                    {address.isDefault ? (
                      <Tag color="blue">{t('pages.account.addresses.defaultTag')}</Tag>
                    ) : null}
                  </div>
                </Radio>
              ))}
            </Space>
          </Radio.Group>

          <Divider style={{ margin: '8px 0' }} />

          <Button type="dashed" onClick={() => setAddingAddress((previous) => !previous)}>
            {addingAddress
              ? t('pages.productDetail.addressModal.collapseAdd')
              : t('pages.productDetail.addressModal.toggleAdd')}
          </Button>

          {addingAddress ? (
            <Form form={addressForm} layout="vertical" className="product-detail__address-form">
              <Form.Item
                label={t('pages.productDetail.addressForm.label')}
                name="label"
                rules={[{ required: true, message: t('pages.productDetail.addressForm.errors.labelRequired') }]}
              >
                <Input placeholder={t('pages.productDetail.addressForm.label')} allowClear />
              </Form.Item>
              <Space size={12} style={{ width: '100%' }}>
                <Form.Item
                  label={t('pages.productDetail.addressForm.recipient')}
                  name="recipient"
                  rules={[{ required: true, message: t('pages.productDetail.addressForm.errors.recipientRequired') }]}
                  style={{ flex: 1 }}
                >
                  <Input allowClear />
                </Form.Item>
                <Form.Item
                  label={t('pages.productDetail.addressForm.phone')}
                  name="phone"
                  rules={[
                    { required: true, message: t('pages.productDetail.addressForm.errors.phoneRequired') },
                    { pattern: /^1[3-9]\d{9}$/, message: t('pages.productDetail.addressForm.errors.phoneInvalid') },
                  ]}
                  style={{ flex: 1 }}
                >
                  <Input allowClear />
                </Form.Item>
              </Space>
              <Form.Item
                label={t('pages.productDetail.addressForm.region')}
                name="region"
                rules={[{ required: true, message: t('pages.productDetail.addressForm.errors.regionRequired') }]}
              >
                <RegionCascader />
              </Form.Item>
              <Form.Item
                label={t('pages.productDetail.addressForm.line1')}
                name="line1"
                rules={[{ required: true, message: t('pages.productDetail.addressForm.errors.line1Required') }]}
              >
                <Input allowClear />
              </Form.Item>
              <Form.Item
                label={t('pages.productDetail.addressForm.postalCode')}
                name="postalCode"
                rules={[
                  { required: true, message: t('pages.productDetail.addressForm.errors.postalCodeRequired') },
                  { pattern: /^\d{6}$/, message: t('pages.productDetail.addressForm.errors.postalCodeInvalid') },
                ]}
              >
                <Input allowClear />
              </Form.Item>
              <Form.Item name="isDefault" valuePropName="checked">
                <Checkbox>{t('pages.productDetail.addressForm.isDefault')}</Checkbox>
              </Form.Item>
              <Button type="primary" block onClick={handleAddAddress}>
                {t('pages.productDetail.addressForm.save')}
              </Button>
            </Form>
          ) : null}
        </Space>
      </Modal>
    </div>
  )
}
