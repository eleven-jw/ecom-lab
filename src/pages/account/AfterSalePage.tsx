import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'

export default function AfterSalePage() {
  const { t } = useTranslation()

  return (
    <div className="page-container">
      <Typography.Title level={4}>{t('pages.account.afterSale.title')}</Typography.Title>
      <Typography.Paragraph>
        {t('pages.account.afterSale.description')}
      </Typography.Paragraph>
    </div>
  )
}
