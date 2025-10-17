import { Layout, Menu, Tag } from 'antd'
import type { MenuProps } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

import { useAppSelector } from '../../store/hooks'

const { Sider } = Layout

const PATH_TO_KEY: Record<string, string> = {
  '/account': 'account-overview',
  '/account/orders': 'account-orders',
  '/account/after-sale': 'account-after-sale',
  '/account/addresses': 'account-addresses',
}

const tierRank: Record<'basic' | 'vip' | 'super_vip', number> = {
  basic: 1,
  vip: 2,
  super_vip: 3,
}

export function Sidebar() {
  const location = useLocation()
  const { t } = useTranslation()
  const auth = useAppSelector((state) => state.auth)
  const userTier = auth.user?.tier ?? 'basic'
  const isVipOrHigher = tierRank[userTier] >= tierRank.vip
  const items: MenuProps['items'] = useMemo(
    () => [
      {
        key: 'account-overview',
        label: <Link to="/account">{t('layout.sidebar.overview')}</Link>,
      },
      {
        key: 'account-orders',
        label: <Link to="/account/orders">{t('layout.sidebar.orders')}</Link>,
      },
      {
        key: 'account-after-sale',
        label: (
          <span>
            <Link to="/account/after-sale">{t('layout.sidebar.afterSale')}</Link>
            <Tag style={{ marginLeft: 8 }} color="gold">
              {t('pages.auth.tiers.vip')}
            </Tag>
          </span>
        ),
        disabled: !isVipOrHigher,
      },
      {
        key: 'account-addresses',
        label: (
          <Link to="/account/addresses">{t('layout.sidebar.addresses')}</Link>
        ),
      },
    ],
    [isVipOrHigher, t],
  )
  const selectedKey = PATH_TO_KEY[location.pathname] ?? 'account-overview'

  return (
    <Sider
      width={220}
      style={{
        background: '#ffffff',
        borderRight: '1px solid #f0f0f0',
      }}
    >
      <Menu
        mode="inline"
        items={items}
        selectedKeys={[selectedKey]}
        style={{ height: '100%', borderRight: 0 }}
      />
    </Sider>
  )
}

export default Sidebar
