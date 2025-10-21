import {
  Button,
  Card,
  Divider,
  Empty,
  InputNumber,
  List,
  Popconfirm,
  Space,
  Typography,
  message,
} from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../store/hooks'
import { CART_MAX_ITEMS, clearCart, removeItem, updateQuantity } from '../store/slices/cartSlice'
import { addOrder } from '../store/slices/ordersSlice'
import './CartPage.css'

const { Title, Text } = Typography

const formatCurrency = (amount: number, currency: string) => {
  const symbol = currency === 'CNY' ? '¥' : currency === 'USD' ? '$' : currency
  return `${symbol}${amount.toFixed(2)}`
}

export default function CartPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const cartItems = useAppSelector((state) => state.cart.items)
  const selectedAddressId = useAppSelector((state) => state.address.selectedAddressId)
  const addresses = useAppSelector((state) => state.address.addresses)
  const selectedAddress = useMemo(
    () => addresses.find((address) => address.id === selectedAddressId) ?? addresses.find((address) => address.isDefault),
    [addresses, selectedAddressId],
  )

  const totals = useMemo(() => {
    return cartItems.reduce(
      (accumulator, item) => {
        const lineTotal = item.unitPrice * item.quantity
        accumulator.amount += lineTotal
        accumulator.quantity += item.quantity
        return accumulator
      },
      { amount: 0, quantity: 0 },
    )
  }, [cartItems])

  const handleQuantityChange = (id: string, value: number | null) => {
    if (!value) return
    const currentTotal = cartItems.reduce((acc, item) => acc + item.quantity, 0)
    const targetItem = cartItems.find((item) => item.id === id)
    if (!targetItem) return
    const available = CART_MAX_ITEMS - (currentTotal - targetItem.quantity)
    const nextQuantity = Math.max(1, Math.min(value, available))
    if (value > available) {
      message.warning(`购物车最多可添加 ${CART_MAX_ITEMS} 件商品`)
    }
    dispatch(updateQuantity({ id, quantity: nextQuantity }))
  }

  const handleRemove = (id: string) => {
    dispatch(removeItem(id))
    message.success('已移除商品')
  }

  const handleClear = () => {
    dispatch(clearCart())
    message.success('购物车已清空')
  }

  const handleCheckout = () => {
    if (!cartItems.length) {
      message.info('购物车为空，无需结算')
      return
    }

    if (!selectedAddress) {
      message.warning('请先选择收货地址')
      navigate('/account/addresses')
      return
    }

    const currency = cartItems[0]?.currency ?? 'CNY'

    dispatch(
      addOrder({
        items: cartItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          imageUrl: item.imageUrl,
          skuLabel: item.skuLabel,
          quantity: item.quantity,
          price: item.unitPrice,
          currency: item.currency,
        })),
        totalAmount: totals.amount,
        currency,
        address: selectedAddress,
        paymentMethod: 'wechat',
      }),
    )
    dispatch(clearCart())
    message.success('订单已创建，可前往订单中心查看')
    navigate('/account/orders')
  }

  if (!cartItems.length) {
    return (
      <div className="page-container cart-page">
        <Title level={3}>{t('pages.cart.title')}</Title>
        <Empty description="购物车空空如也，去逛逛吧" style={{ padding: '64px 0' }}>
          <Button type="primary" onClick={() => navigate('/products')}>
            立即选购
          </Button>
        </Empty>
      </div>
    )
  }

  return (
    <div className="page-container cart-page">
      <Title level={3}>{t('pages.cart.title')}</Title>

      <div className="cart-page__layout">
        <Card className="cart-page__list" variant="outlined">
          <div className="cart-page__list-header">
            <Text type="secondary">商品信息</Text>
            <Button type="link" onClick={handleClear}>
              清空购物车
            </Button>
          </div>
          <Divider style={{ margin: '12px 0' }} />

          <List
            dataSource={cartItems}
            split
            renderItem={(item) => (
              <List.Item className="cart-page__item">
                <div className="cart-page__item-info">
                  <img src={item.imageUrl} alt={item.name} loading="lazy" />
                  <div className="cart-page__item-meta">
                    <Text strong>{item.name}</Text>
                    <Text type="secondary">规格：{item.skuLabel}</Text>
                  </div>
                </div>

                <div className="cart-page__item-actions">
                  <Text strong>{formatCurrency(item.unitPrice, item.currency)}</Text>
                  <InputNumber
                    min={1}
                    max={CART_MAX_ITEMS}
                    value={item.quantity}
                    onChange={(value) => handleQuantityChange(item.id, value)}
                  />
                  <Popconfirm
                    title="确定要移除该商品吗？"
                    okText="移除"
                    cancelText="取消"
                    onConfirm={() => handleRemove(item.id)}
                  >
                    <Button type="link" danger>
                      移除
                    </Button>
                  </Popconfirm>
                </div>
              </List.Item>
            )}
          />
        </Card>

        <Space direction="vertical" size={16} className="cart-page__sidebar">
          <Card className="cart-page__summary" variant="outlined">
            <Title level={4}>订单摘要</Title>
            <div className="cart-page__summary-row">
              <Text type="secondary">商品数量</Text>
              <Text>{totals.quantity}</Text>
            </div>
            <div className="cart-page__summary-row">
              <Text type="secondary">商品合计</Text>
              <Text strong>{formatCurrency(totals.amount, cartItems[0]?.currency ?? 'CNY')}</Text>
            </div>
            <Divider style={{ margin: '12px 0' }} />
            <div className="cart-page__summary-row">
              <Text type="secondary">应付金额</Text>
              <Text strong className="cart-page__summary-total">
                {formatCurrency(totals.amount, cartItems[0]?.currency ?? 'CNY')}
              </Text>
            </div>
            <Button type="primary" block size="large" onClick={handleCheckout}>
              去结算
            </Button>
            <Button block size="large" style={{ marginTop: 12 }} onClick={() => navigate('/products')}>
              继续选购
            </Button>
          </Card>

          <Card className="cart-page__address" variant="outlined">
            <div className="cart-page__address-header">
              <Text strong>收货地址</Text>
              <Button type="link" size="small" onClick={() => navigate('/account/addresses')}>
                管理地址
              </Button>
            </div>
            {selectedAddress ? (
              <div className="cart-page__address-body">
                <Text>{selectedAddress.recipient}（{selectedAddress.phone}）</Text>
                <Text type="secondary">
                  {selectedAddress.region} {selectedAddress.city} {selectedAddress.district} {selectedAddress.line1}
                </Text>
              </div>
            ) : (
              <Text type="secondary">暂无默认地址，请先添加</Text>
            )}
          </Card>
        </Space>
      </div>
    </div>
  )
}
