import type { PropsWithChildren, ReactNode } from 'react'
import { Card, Typography } from 'antd'

type AuthShellProps = PropsWithChildren<{
  title: string
  description?: string
  footer?: ReactNode
}>

export function AuthShell({ title, description, footer, children }: AuthShellProps) {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '70vh',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 16px',
      }}
    >
      <Card
        style={{ maxWidth: 420, width: '100%', boxShadow: '0 20px 60px rgba(15,23,42,0.12)' }}
      >
        <Typography.Title level={3} style={{ marginBottom: 8 }}>
          {title}
        </Typography.Title>
        {description ? (
          <Typography.Paragraph type="secondary" style={{ marginBottom: 24 }}>
            {description}
          </Typography.Paragraph>
        ) : null}
        {children}
        {footer ? <div style={{ marginTop: 24 }}>{footer}</div> : null}
      </Card>
    </div>
  )
}

export default AuthShell
