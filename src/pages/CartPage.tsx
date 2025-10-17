import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'

export default function CartPage() {
  const { t } = useTranslation()

  return (
    <div className="page-container">
      <Typography.Title level={3}>{t('pages.cart.title')}</Typography.Title>
      <Typography.Paragraph>{t('pages.cart.description')}</Typography.Paragraph>
    </div>
  )
}
