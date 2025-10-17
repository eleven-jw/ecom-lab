import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'

export default function OverviewPage() {
  const { t } = useTranslation()

  return (
    <div className="page-container">
      <Typography.Title level={4}>{t('pages.account.overview.title')}</Typography.Title>
      <Typography.Paragraph>
        {t('pages.account.overview.description')}
      </Typography.Paragraph>
    </div>
  )
}
