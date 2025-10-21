import { Card, Divider, Empty, List, Segmented, Space, Tag, Typography } from 'antd'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { OrderStatus } from '../../services/types'
import { useAppSelector } from '../../store/hooks'
import './OrdersPage.css'

const statusSegments: Array<{ label: string; value: OrderStatus | 'all' }> = [
  { label: '全部', value: 'all' },
  { label: '待处理', value: 'pending' },
  { label: '处理中', value: 'processing' },
  { label: '已发货', value: 'fulfilled' },
  { label: '已送达', value: 'delivered' },
]

const statusMeta: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: '待付款', color: 'orange' },
  processing: { label: '备货中', color: 'blue' },
  fulfilled: { label: '运输中', color: 'geekblue' },
  delivered: { label: '已送达', color: 'green' },
}

export default function OrdersPage() {
  const { t } = useTranslation()
  const orders = useAppSelector((state) => state.orders.orders)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders
    return orders.filter((order) => order.status === statusFilter)
  }, [orders, statusFilter])

  return (
    <div className="page-container orders-page">
      <div className="orders-page__header">
        <div>
          <Typography.Title level={4}>{t('pages.account.orders.title')}</Typography.Title>
          <Typography.Text type="secondary">
            共 {filteredOrders.length} 笔订单
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
            const meta = statusMeta[order.status]
            return (
              <List.Item key={order.id}>
                <Card className="orders-page__card" bordered={false}>
                  <div className="orders-page__card-header">
                    <Space size={12} wrap>
                      <Typography.Text strong>订单号：{order.id}</Typography.Text>
                      <Typography.Text type="secondary">
                        下单时间：{new Date(order.createdAt).toLocaleString()}
                      </Typography.Text>
                    </Space>
                    <Tag color={meta?.color}>{meta?.label}</Tag>
                  </div>

                  <div className="orders-page__items">
                    {order.items.map((item) => (
                      <div key={`${order.id}-${item.productId}`} className="orders-page__item">
                        <img src={item.imageUrl} alt={item.name} loading="lazy" />
                        <div className="orders-page__item-meta">
                          <Typography.Text strong>{item.name}</Typography.Text>
                          <Typography.Text type="secondary">规格：{item.skuLabel}</Typography.Text>
                          <Typography.Text type="secondary">数量：{item.quantity}</Typography.Text>
                        </div>
                        <Typography.Text strong>
                          {item.currency === 'CNY' ? '¥' : item.currency}
                          {item.price}
                        </Typography.Text>
                      </div>
                    ))}
                  </div>

                  <Divider style={{ margin: '12px 0' }} />

                  <div className="orders-page__footer">
                    <div>
                      <Typography.Text type="secondary">配送至</Typography.Text>
                      <Typography.Text>
                        {order.address.city} {order.address.region} {order.address.line1}
                      </Typography.Text>
                    </div>
                    <Typography.Text strong>
                      合计：{order.currency === 'CNY' ? '¥' : order.currency}
                      {order.totalAmount}
                    </Typography.Text>
                  </div>
                </Card>
              </List.Item>
            )
          }}
        />
      ) : (
        <Empty description="暂无相关订单" style={{ padding: '64px 0' }} />
      )}
    </div>
  )
}
