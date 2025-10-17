import { Layout, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

const { Footer: AntFooter } = Layout

export function Footer() {
  const year = new Date().getFullYear()
  const { t } = useTranslation()

  return (
    <AntFooter
      style={{
        textAlign: 'center',
        padding: '1.5rem 2rem',
        background: '#ffffff',
        borderTop: '1px solid #f0f0f0',
      }}
    >
      <Typography.Text type="secondary">
        {t('layout.footer', { year })}
      </Typography.Text>
    </AntFooter>
  )
}

export default Footer
