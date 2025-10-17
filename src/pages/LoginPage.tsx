import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'

export default function LoginPage() {
  const { t } = useTranslation()

  return (
    <div className="page-container">
      <Typography.Title level={3}>{t('pages.auth.title')}</Typography.Title>
      <Typography.Paragraph>{t('pages.auth.description')}</Typography.Paragraph>
    </div>
  )
}
