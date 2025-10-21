import { Layout, Menu, Typography, Button, Dropdown, Avatar, Tag, Space, Badge } from 'antd'
import type { MenuProps } from 'antd'
import { LogoutOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { logout } from '../../store/slices/authSlice'

const { Header: AntHeader } = Layout

const PATH_TO_PRIMARY_KEY: Record<string, string> = {
  '/': 'home',
  '/products': 'products',
  '/account': 'account',
  '/account/orders': 'orders',
  '/account/after-sale': 'account',
  '/account/addresses': 'account',
}

const tierColors: Record<'basic' | 'vip' | 'super_vip', string> = {
  basic: 'blue',
  vip: 'gold',
  super_vip: 'purple',
}

export function Header() {
  const location = useLocation()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)
  const cartCount = useAppSelector((state) => state.cart.items.reduce((acc, item) => acc + item.quantity, 0))
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
        <Link to="/cart" aria-label={t('layout.actions.cart')} style={{ display: 'inline-flex' }}>
          <Badge count={cartCount} offset={[-2, 2]} showZero>
            <ShoppingCartOutlined style={{ fontSize: 20 }} />
          </Badge>
        </Link>
        {auth.status === 'authenticated' && auth.user ? (
          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                {
                  key: 'account',
                  label: <NavLink to="/account">{t('layout.nav.account')}</NavLink>,
                },
                {
                  key: 'orders',
                  label: <NavLink to="/account/orders">{t('layout.nav.orders')}</NavLink>,
                },
                { type: 'divider' as const },
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: t('layout.actions.logout'),
                },
              ],
              onClick: ({ key }) => {
                if (key === 'logout') {
                  dispatch(logout())
                  navigate('/', { replace: true })
                }
              },
            }}
          >
            <Space size="small" style={{ cursor: 'pointer' }}>
              <Avatar size={32} style={{ backgroundColor: '#1677ff' }}>
                {auth.user.fullName.slice(0, 1).toUpperCase()}
              </Avatar>
              <div style={{ lineHeight: 1 }}>
                <Typography.Text strong>{auth.user.fullName}</Typography.Text>
                <div>
                  <Tag color={tierColors[auth.user.tier]} style={{ marginTop: 4 }}>
                    {t(
                      `pages.auth.tiers.${
                        auth.user.tier === 'super_vip' ? 'superVip' : auth.user.tier
                      }`,
                    )}
                  </Tag>
                </div>
              </div>
            </Space>
          </Dropdown>
        ) : (
          <Space>
            <Button icon={<UserOutlined />} onClick={() => navigate('/auth/login')}>
              {t('layout.actions.login')}
            </Button>
            <Button type="primary" onClick={() => navigate('/auth/register')}>
              {t('layout.actions.signUp')}
            </Button>
          </Space>
        )}
      </div>
    </AntHeader>
  )
}

export default Header
