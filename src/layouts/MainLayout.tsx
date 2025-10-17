import type { PropsWithChildren } from 'react'
import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'

import { Header } from '../components/navigation/Header'
import { Footer } from '../components/common/Footer'
import { Sidebar } from '../components/navigation/Sidebar'
import { useGetProfileQuery } from '../services/api'
import { useAppSelector } from '../store/hooks'

const { Content } = Layout

type MainLayoutProps = PropsWithChildren<{
  showSidebar?: boolean
}>

export function MainLayout({ children, showSidebar = false }: MainLayoutProps) {
  const hasToken = useAppSelector((state) => Boolean(state.auth.tokens?.accessToken))
  useGetProfileQuery(undefined, { skip: !hasToken })

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header />
      <Layout>
        {showSidebar ? <Sidebar /> : null}
        <Content style={{ padding: '24px 32px', background: 'transparent' }}>
          {children ?? <Outlet />}
        </Content>
      </Layout>
      <Footer />
    </Layout>
  )
}

export default MainLayout
