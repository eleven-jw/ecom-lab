import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="page-container">
      <Typography.Title level={3}>{t('pages.home.title')}</Typography.Title>
      <Typography.Paragraph>{t('pages.home.description')}</Typography.Paragraph>
    </div>
  )
}
