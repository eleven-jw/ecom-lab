import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'

export default function AddressesPage() {
  const { t } = useTranslation()

  return (
    <div className="page-container">
      <Typography.Title level={4}>{t('pages.account.addresses.title')}</Typography.Title>
      <Typography.Paragraph>
        {t('pages.account.addresses.description')}
      </Typography.Paragraph>
    </div>
  )
}
