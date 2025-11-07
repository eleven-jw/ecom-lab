import { Button, Card, Divider, Empty, List, Popconfirm, Segmented, Space, Tag, Typography, message } from 'antd'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import type { OrderStatus } from '../../services/types'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { cancelOrder, updateOrderStatus } from '../../store/slices/ordersSlice'
import './OrdersPage.css'

const statusColors: Record<OrderStatus, string> = {
  pending: 'orange',
  processing: 'blue',
  fulfilled: 'geekblue',
  delivered: 'green',
  cancelled: 'red',
}

const formatCurrency = (amount: number, currency: string) => {
  const symbol = currency === 'CNY' ? '¥' : currency === 'USD' ? '$' : currency
  return `${symbol}${amount}`
}

export default function OrdersPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const orders = useAppSelector((state) => state.orders.orders)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')

  const statusSegments = useMemo(
    () => [
      { label: t('pages.account.orders.tabs.all'), value: 'all' },
      { label: t('pages.account.orders.tabs.pending'), value: 'pending' as const },
      { label: t('pages.account.orders.tabs.processing'), value: 'processing' as const },
      { label: t('pages.account.orders.tabs.fulfilled'), value: 'fulfilled' as const },
      { label: t('pages.account.orders.tabs.delivered'), value: 'delivered' as const },
      { label: t('pages.account.orders.tabs.cancelled'), value: 'cancelled' as const },
    ],
    [t],
  )

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders
    return orders.filter((order) => order.status === statusFilter)
  }, [orders, statusFilter])

  const nextStatusMap: Partial<Record<OrderStatus, OrderStatus>> = {
    pending: 'processing',
    processing: 'fulfilled',
    fulfilled: 'delivered',
  }

  return (
    <div className="page-container orders-page">
      <div className="orders-page__header">
        <div>
          <Typography.Title level={4}>{t('pages.account.orders.title')}</Typography.Title>
          <Typography.Text type="secondary">
            {t('pages.account.orders.total', { count: filteredOrders.length })}
          </Typography.Text>
        </div>
        <Segmented
          size="large"
          value={statusFilter}
          onChange={(value) => setStatusFilter(value as OrderStatus | 'all')}
          options={statusSegments.map(({ label, value }) => ({ label, value }))}
        />
      </div>

      {filteredOrders.length ? (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={filteredOrders}
          renderItem={(order) => {
            const statusLabel = t(`statuses.order.${order.status}`)
            const canCancel = order.status !== 'delivered' && order.status !== 'cancelled'
            const nextStatus = nextStatusMap[order.status]
            return (
              <List.Item key={order.id}>
                <Card className="orders-page__card" variant="borderless">
                  <div className="orders-page__card-header">
                    <Space size={12} wrap>
                      <Typography.Text strong>
                        {t('pages.account.orders.labels.orderNumber', { id: order.id })}
                      </Typography.Text>
                      <Typography.Text type="secondary">
                        {t('pages.account.orders.labels.placedAt', {
                          date: new Date(order.createdAt).toLocaleString(),
                        })}
                      </Typography.Text>
                    </Space>
                    <Tag color={statusColors[order.status]}>{statusLabel}</Tag>
                  </div>

                  <div className="orders-page__items">
                    {order.items.map((item) => (
                      <div key={`${order.id}-${item.productId}`} className="orders-page__item">
                        <img src={item.imageUrl} alt={item.name} loading="lazy" />
                        <div className="orders-page__item-meta">
                          <Typography.Text strong>{item.name}</Typography.Text>
                          <Typography.Text type="secondary">
                            {t('pages.account.orders.labels.specification', { value: item.skuLabel })}
                          </Typography.Text>
                          <Typography.Text type="secondary">
                            {t('pages.account.orders.labels.quantity', { value: item.quantity })}
                          </Typography.Text>
                        </div>
                        <Typography.Text strong>
                          {formatCurrency(item.price, item.currency)}
                        </Typography.Text>
                      </div>
                    ))}
                  </div>

                  <Divider style={{ margin: '12px 0' }} />

                  <div className="orders-page__footer">
                    <div>
                      <Typography.Text type="secondary">
                        {t('pages.account.orders.labels.shipTo')}
                      </Typography.Text>
                      <Typography.Text>
                        {order.address.region} {order.address.city} {order.address.district} {order.address.line1}
                      </Typography.Text>
                    </div>
                    <Typography.Text strong>
                      {t('pages.account.orders.labels.total', {
                        amount: formatCurrency(order.totalAmount, order.currency),
                      })}
                    </Typography.Text>
                  </div>

                  <Divider style={{ margin: '12px 0' }} />

                  <Space size={12} wrap>
                    {canCancel ? (
                      <Popconfirm
                        title={t('pages.account.orders.actions.cancel')}
                        okText={t('common.confirm')}
                        cancelText={t('common.cancel')}
                        onConfirm={() => {
                          dispatch(cancelOrder(order.id))
                          message.success(t('messages.orderCancelled'))
                        }}
                      >
                        <Button type="link" danger>
                          {t('pages.account.orders.actions.cancel')}
                        </Button>
                      </Popconfirm>
                    ) : null}

                    {nextStatus ? (
                      <Button
                        type="link"
                        onClick={() => {
                          dispatch(updateOrderStatus({ id: order.id, status: nextStatus }))
                          message.success(t('messages.orderStatusUpdated'))
                        }}
                      >
                        {t(
                          `pages.account.orders.actions.${
                            nextStatus === 'processing'
                              ? 'markProcessing'
                              : nextStatus === 'fulfilled'
                                ? 'markFulfilled'
                                : 'markDelivered'
                          }`,
                        )}
                      </Button>
                    ) : null}

                    <Button
                      type="link"
                      onClick={() => navigate('/account/after-sale', { state: { orderId: order.id } })}
                    >
                      {t('pages.account.orders.actions.requestAfterSale')}
                    </Button>
                  </Space>
                </Card>
              </List.Item>
            )
          }}
        />
      ) : (
        <Empty description={t('pages.account.orders.empty')} style={{ padding: '64px 0' }} />
      )}
    </div>
  )
}
