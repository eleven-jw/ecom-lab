import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'

export default function OrdersPage() {
  const { t } = useTranslation()

  return (
    <div className="page-container">
      <Typography.Title level={4}>{t('pages.account.orders.title')}</Typography.Title>
      <Typography.Paragraph>
        {t('pages.account.orders.description')}
      </Typography.Paragraph>
    </div>
  )
}
