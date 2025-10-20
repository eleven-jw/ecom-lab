import { Button, Card, Divider, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

import { useAppSelector } from '../../store/hooks'

export function UserGreetingCard() {
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)

  const isAuthenticated = Boolean(user)

  return (
    <Card className="user-greeting-card" bordered={false}>
      <Typography.Text type="secondary">你好，</Typography.Text>
      <Typography.Title level={5} style={{ marginTop: 4 }}>
        {isAuthenticated ? user?.fullName ?? user?.email : '欢迎来到ecom-lab风格体验'}
      </Typography.Title>

      <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
        {isAuthenticated
          ? '立即查看你的订单和会员权益。'
          : '登录后可同步收藏、订单与会员权益。'}
      </Typography.Paragraph>

      <Button
        type="primary"
        block
        onClick={() => navigate(isAuthenticated ? '/account' : '/auth/login')}
      >
        {isAuthenticated ? '进入我的ecom-lab' : '立即登录'}
      </Button>

      {!isAuthenticated ? (
        <Button
          block
          style={{ marginTop: 12 }}
          onClick={() => navigate('/auth/register')}
        >
          免费注册
        </Button>
      ) : null}

      <Divider style={{ margin: '16px 0' }} />

      <div className="user-greeting-card__benefits">
        <Typography.Text strong>会员专享</Typography.Text>
        <ul>
          <li>运费券包月领取</li>
          <li>专属客服随时在线</li>
          <li>精选神券每日更新</li>
        </ul>
      </div>
    </Card>
  )
}

export default UserGreetingCard
