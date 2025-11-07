import { Button, Card, Divider, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useAppSelector } from '../../store/hooks'

export function UserGreetingCard() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const user = useAppSelector((state) => state.auth.user)

  const isAuthenticated = Boolean(user)
  const perks = t('components.userGreeting.perks', { returnObjects: true }) as unknown
  const perkList = Array.isArray(perks) ? perks : []

  return (
    <Card className="user-greeting-card" variant="borderless">
      <Typography.Text type="secondary">{t('components.userGreeting.hello')}</Typography.Text>
      <Typography.Title level={5} style={{ marginTop: 4 }}>
        {isAuthenticated
          ? user?.fullName ?? user?.email
          : t('components.userGreeting.welcome')}
      </Typography.Title>

      <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
        {isAuthenticated
          ? t('components.userGreeting.authenticatedSubtitle')
          : t('components.userGreeting.guestSubtitle')}
      </Typography.Paragraph>

      <Button
        type="primary"
        block
        onClick={() => navigate(isAuthenticated ? '/account' : '/auth/login')}
      >
        {isAuthenticated
          ? t('components.userGreeting.primaryCtaAuthenticated')
          : t('components.userGreeting.primaryCtaGuest')}
      </Button>

      {!isAuthenticated ? (
        <Button
          block
          style={{ marginTop: 12 }}
          onClick={() => navigate('/auth/register')}
        >
          {t('components.userGreeting.secondaryCta')}
        </Button>
      ) : null}

      <Divider style={{ margin: '16px 0' }} />

      <div className="user-greeting-card__benefits">
        <Typography.Text strong>{t('components.userGreeting.perksTitle')}</Typography.Text>
        <ul>
          {perkList.map((perk) => (
            <li key={perk}>{perk}</li>
          ))}
        </ul>
      </div>
    </Card>
  )
}

export default UserGreetingCard
