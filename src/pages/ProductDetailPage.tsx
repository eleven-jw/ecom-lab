import { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  Modal,
  Radio,
  Rate,
  Result,
  Skeleton,
  Space,
  Tag,
  Typography,
  message,
} from 'antd'
import { useNavigate, useParams } from 'react-router-dom'

import { RegionCascader } from '../components/address/RegionCascader'
import type { AddressFormValues } from '../components/address/AddressFormDrawer'
import { useGetProductByIdQuery } from '../services/api'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addAddress, selectAddress } from '../store/slices/addressSlice'
import { addItem } from '../store/slices/cartSlice'
import { addOrder } from '../store/slices/ordersSlice'
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
  const dispatch = useAppDispatch()
  const addresses = useAppSelector((state) => state.address.addresses)
  const selectedAddressId = useAppSelector((state) => state.address.selectedAddressId)
  const selectedAddress = addresses.find((address) => address.id === selectedAddressId)

  const {
    data: product,
    isFetching,
    isLoading,
    isError,
  } = useGetProductByIdQuery(productId ?? '', {
    skip: !productId,
  })

  const isBusy = (isLoading || isFetching) && !product
  const [selectedSkuId, setSelectedSkuId] = useState<string | undefined>()
  const [quantity, setQuantity] = useState<number>(1)
  const [addressModalOpen, setAddressModalOpen] = useState(false)
  const [addingAddress, setAddingAddress] = useState(false)
  const [addressForm] = Form.useForm<AddressFormValues>()

  useEffect(() => {
    if (product?.skus?.length) {
      setSelectedSkuId(product.skus[0].id)
      setQuantity(1)
    }
  }, [product?.skus])

  useEffect(() => {
    setQuantity(1)
  }, [selectedSkuId])

  const ratingText = useMemo(() => {
    if (!product?.rating) return null
    const base = product.rating.toFixed(1)
    if (product.reviewCount) {
      return `${base}（${product.reviewCount} 条评价）`
    }
    return base
  }, [product?.rating, product?.reviewCount])

  const selectedSku = product?.skus.find((sku) => sku.id === selectedSkuId)
  const stock = selectedSku?.stock ?? 0
  const maxQuantity = stock > 0 ? stock : 1
  const isOutOfStock = stock === 0

  const handleAddToCart = () => {
    if (!product || !selectedSku || isOutOfStock) return
    dispatch(
      addItem({
        productId: product.id,
        skuId: selectedSku.id,
        skuLabel: selectedSku.label,
        name: product.name,
        imageUrl: product.imageUrl,
        unitPrice: selectedSku.price,
        currency: product.currency,
        quantity,
      }),
    )
    message.success('已加入购物车')
  }

  const handleBuyNow = () => {
    if (!product || !selectedSku || isOutOfStock) return
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
            imageUrl: product.imageUrl,
            skuLabel: selectedSku.label,
            quantity,
            price: selectedSku.price,
            currency: product.currency,
          },
        ],
        totalAmount: selectedSku.price * quantity,
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
            <Radio.Group
              className="product-detail__sku-list"
              value={selectedSkuId}
              onChange={(event) => setSelectedSkuId(event.target.value)}
            >
              {product.skus.map((sku) => (
                <Radio.Button key={sku.id} value={sku.id}>
                  {sku.label} · {formatCurrency(sku.price, product.currency)}
                </Radio.Button>
              ))}
            </Radio.Group>
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
                onClick={() =>
                  setQuantity((current) => Math.min(maxQuantity, current + 1))
                }
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
                <Text>{selectedAddress.recipient}（{selectedAddress.phone}）</Text>
                <Text type="secondary">
                  {selectedAddress.region} {selectedAddress.city} {selectedAddress.district} {selectedAddress.line1}
                </Text>
              </div>
            ) : (
              <Text type="secondary">尚未选择收货地址</Text>
            )}
          </div>

          <div className="product-detail__actions">
            <Button size="large" onClick={handleAddToCart} disabled={!selectedSku || isOutOfStock}>
              加入购物车
            </Button>
            <Button
              size="large"
              type="primary"
              onClick={handleBuyNow}
              disabled={!selectedSku || isOutOfStock}
            >
              立即购买
            </Button>
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
              <Form.Item
                label="地址标签"
                name="label"
                rules={[{ required: true, message: '请输入地址标签' }]}
              >
                <Input placeholder="家 / 公司" allowClear maxLength={10} />
              </Form.Item>

              <Space size={12} style={{ width: '100%' }}>
                <Form.Item
                  label="收件人"
                  name="recipient"
                  rules={[{ required: true, message: '请输入收件人姓名' }]}
                  style={{ flex: 1 }}
                >
                  <Input placeholder="张三" allowClear maxLength={20} />
                </Form.Item>
                <Form.Item
                  label="联系电话"
                  name="phone"
                  rules={[
                    { required: true, message: '请输入联系电话' },
                    { pattern: /^1[3-9]\d{9}$/, message: '请输入规范的中国大陆手机号' },
                  ]}
                  style={{ flex: 1 }}
                >
                  <Input placeholder="11 位手机号" allowClear maxLength={11} />
                </Form.Item>
              </Space>

              <Form.Item
                label="所在地区"
                name="region"
                rules={[{ required: true, message: '请选择省 / 市 / 区' }]}
              >
                <RegionCascader />
              </Form.Item>

              <Form.Item
                label="详细地址"
                name="line1"
                rules={[{ required: true, message: '请输入详细地址' }]}
              >
                <Input.TextArea
                  placeholder="街道、门牌号、楼层房间等"
                  autoSize={{ minRows: 2, maxRows: 3 }}
                  allowClear
                  maxLength={120}
                />
              </Form.Item>

              <Form.Item
                label="邮政编码"
                name="postalCode"
                rules={[
                  { required: true, message: '请输入邮政编码' },
                  { pattern: /^\d{6}$/, message: '邮政编码为 6 位数字' },
                ]}
              >
                <Input placeholder="6 位邮编" allowClear maxLength={6} />
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
