import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Form,
  Input,
  List,
  Progress,
  Space,
  Statistic,
  Tag,
  Typography,
  message,
} from 'antd'
import { CrownOutlined, EditOutlined, HomeOutlined, ShoppingOutlined } from '@ant-design/icons'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { updateProfile } from '../../store/slices/authSlice'
import './OverviewPage.css'

type ProfileFormValues = {
  fullName: string
  phone?: string
  location?: string
  bio?: string
}

const tierCopy: Record<'basic' | 'vip' | 'super_vip', { label: string; color: string; target: number; perks: string[] }> = {
  basic: {
    label: '基础会员',
    color: 'blue',
    target: 3000,
    perks: ['当季精选商品会员价', '限量抢购优先提醒', '积分换购基础权益'],
  },
  vip: {
    label: 'VIP 会员',
    color: 'gold',
    target: 9000,
    perks: ['专属客服通道', '跨境购包邮券', '新品优先试用资格'],
  },
  super_vip: {
    label: 'Super VIP',
    color: 'purple',
    target: 12000,
    perks: ['尊享奢品私人顾问', '机场贵宾厅权益', '全年生日月双倍积分'],
  },
}

export default function OverviewPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const user = useAppSelector((state) => state.auth.user)
  const orders = useAppSelector((state) => state.orders.orders)
  const cartItems = useAppSelector((state) => state.cart.items)

  const [form] = Form.useForm<ProfileFormValues>()

  const stats = useMemo(
    () => ({
      orderCount: orders.length,
      cartCount: cartItems.reduce((accumulator, item) => accumulator + item.quantity, 0),
      points: user?.points ?? 0,
    }),
    [orders.length, cartItems, user?.points],
  )

  const tierMeta = user ? tierCopy[user.tier] : undefined
  const progress = useMemo(() => {
    if (!user || !tierMeta) return 0
    if (user.tier === 'super_vip') return 100
    const nextTarget = tierMeta.target
    const points = user.points ?? 0
    return Math.min(100, Math.round((points / nextTarget) * 100))
  }, [user, tierMeta])

  if (!user) {
    return (
      <div className="page-container account-overview">
        <Card className="account-overview__empty">
          <Typography.Title level={4}>{t('pages.account.overview.title')}</Typography.Title>
          <Typography.Paragraph type="secondary">
            {t('pages.account.overview.description')}
          </Typography.Paragraph>
          <Button type="primary" onClick={() => navigate('/auth/login')}>
            去登录
          </Button>
        </Card>
      </div>
    )
  }

  useEffect(() => {
    form.setFieldsValue({
      fullName: user.fullName,
      phone: user.phone,
      location: user.location,
      bio: user.bio,
    })
  }, [form, user.fullName, user.phone, user.location, user.bio])

  const handleFinish = (values: ProfileFormValues) => {
    dispatch(updateProfile(values))
    message.success('资料已更新')
  }

  return (
    <div className="page-container account-overview">
      <div className="account-overview__header">
        <Card className="account-overview__profile" variant="outlined">
          <Space size={16} align="start">
            <Badge count={<CrownOutlined />} offset={[-4, 8]} color={tierMeta?.color ?? 'blue'}>
              <Avatar size={72} src={user.avatarUrl}>
                {user.fullName.slice(0, 1).toUpperCase()}
              </Avatar>
            </Badge>
            <div>
              <Typography.Title level={4} style={{ marginBottom: 4 }}>
                {user.fullName}
              </Typography.Title>
              <Space size={8} align="center">
                <Tag color={tierMeta?.color ?? 'blue'}>{tierMeta?.label ?? user.tier}</Tag>
                <Typography.Text type="secondary">注册于 {new Date(user.createdAt).toLocaleDateString()}</Typography.Text>
              </Space>
              {user.bio ? (
                <Typography.Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0 }}>
                  {user.bio}
                </Typography.Paragraph>
              ) : null}
            </div>
          </Space>
          <Divider style={{ margin: '12px 0' }} />
          <div className="account-overview__progress">
            <Typography.Text type="secondary">
              {user.tier === 'super_vip'
                ? '您已达到最高等级'
                : `距离下一等级还差 ${Math.max(0, (tierMeta?.target ?? 0) - (user.points ?? 0))} 积分`}
            </Typography.Text>
            <Progress percent={progress} size="small" status={user.tier === 'super_vip' ? 'success' : 'active'} />
          </div>
        </Card>

        <Card className="account-overview__stats" variant="outlined">
          <Space size={24} wrap>
            <Statistic title="累计订单" value={stats.orderCount} prefix={<ShoppingOutlined />} />
            <Statistic title="购物车商品" value={stats.cartCount} />
            <Statistic title="会员积分" value={stats.points} suffix="pts" />
          </Space>
          <Divider style={{ margin: '12px 0' }} />
          <Space wrap>
            <Button icon={<HomeOutlined />} onClick={() => navigate('/account/addresses')}>
              管理地址
            </Button>
            <Button onClick={() => navigate('/account/orders')}>订单记录</Button>
            <Button type="link" onClick={() => navigate('/products')}>
              去逛逛
            </Button>
          </Space>
        </Card>
      </div>

      <div className="account-overview__content">
        <Card
          className="account-overview__form"
          title="基础资料"
          extra={
            <Button icon={<EditOutlined />} type="link" onClick={() => form.submit()}>
              保存
            </Button>
          }
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              fullName: user.fullName,
              phone: user.phone,
              location: user.location,
              bio: user.bio,
            }}
            onFinish={handleFinish}
          >
            <Form.Item label="姓名" name="fullName" rules={[{ required: true, message: '请输入姓名' }]}
            >
              <Input placeholder="请输入姓名" maxLength={30} />
            </Form.Item>
            <Form.Item
              label="联系电话"
              name="phone"
              rules={[{ pattern: /^1[3-9]\d{9}$/, message: '请输入准确的中国大陆手机号' }]}
            >
              <Input placeholder="用于配送通知" maxLength={11} />
            </Form.Item>
            <Form.Item label="常驻城市" name="location">
              <Input placeholder="例如：北京 · 朝阳" maxLength={40} />
            </Form.Item>
            <Form.Item label="个人简介" name="bio">
              <Input.TextArea placeholder="向卖家和客服介绍自己" maxLength={120} autoSize={{ minRows: 3, maxRows: 4 }} />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              保存修改
            </Button>
          </Form>
        </Card>

        <Card className="account-overview__benefits" title="会员权益">
          <List
            dataSource={tierMeta?.perks ?? []}
            renderItem={(benefit) => (
              <List.Item>
                <Space>
                  <Tag color={tierMeta?.color ?? 'blue'}>权益</Tag>
                  <Typography.Text>{benefit}</Typography.Text>
                </Space>
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  )
}
