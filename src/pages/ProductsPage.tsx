import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'

export default function ProductsPage() {
  const { t } = useTranslation()

  return (
    <div className="page-container">
      <Typography.Title level={3}>{t('pages.products.title')}</Typography.Title>
      <Typography.Paragraph>{t('pages.products.description')}</Typography.Paragraph>
    </div>
  )
}
