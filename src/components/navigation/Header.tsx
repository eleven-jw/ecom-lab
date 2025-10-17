import { Layout, Menu, Typography } from 'antd'
import type { MenuProps } from 'antd'
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, useLocation } from 'react-router-dom'

const { Header: AntHeader } = Layout

const PATH_TO_PRIMARY_KEY: Record<string, string> = {
  '/': 'home',
  '/products': 'products',
  '/account': 'account',
  '/account/orders': 'orders',
  '/account/after-sale': 'account',
  '/account/addresses': 'account',
}

export function Header() {
  const location = useLocation()
  const { t } = useTranslation()
  const selectedKey = PATH_TO_PRIMARY_KEY[location.pathname]
  const primaryNavItems: MenuProps['items'] = useMemo(
    () => [
      {
        key: 'home',
        label: <NavLink to="/">{t('layout.nav.home')}</NavLink>,
      },
      {
        key: 'products',
        label: <NavLink to="/products">{t('layout.nav.products')}</NavLink>,
      },
      {
        key: 'account',
        label: <NavLink to="/account">{t('layout.nav.account')}</NavLink>,
      },
      {
        key: 'orders',
        label: <NavLink to="/account/orders">{t('layout.nav.orders')}</NavLink>,
      },
    ],
    [t],
  )

  return (
    <AntHeader
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        paddingInline: '2rem',
        background: '#ffffff',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <Typography.Title level={4} style={{ margin: 0 }}>
        <Link to="/" style={{ color: 'inherit' }}>
          {t('layout.brand')}
        </Link>
      </Typography.Title>
      <Menu
        mode="horizontal"
        items={primaryNavItems}
        selectedKeys={selectedKey ? [selectedKey] : []}
        style={{ flex: 1, minWidth: 0 }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/cart" aria-label={t('layout.actions.cart')}>
          <ShoppingCartOutlined style={{ fontSize: 18 }} />
        </Link>
        <Link to="/auth/login" aria-label={t('layout.actions.login')}>
          <UserOutlined style={{ fontSize: 18 }} />
        </Link>
      </div>
    </AntHeader>
  )
}

export default Header
