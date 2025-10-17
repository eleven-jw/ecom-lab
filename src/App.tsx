import type { ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { MainLayout } from './layouts/MainLayout'
import CartPage from './pages/CartPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProductsPage from './pages/ProductsPage'
import AddressesPage from './pages/account/AddressesPage'
import AfterSalePage from './pages/account/AfterSalePage'
import OrdersPage from './pages/account/OrdersPage'
import OverviewPage from './pages/account/OverviewPage'

type AppRoute = {
  path?: string
  index?: boolean
  element: ReactElement
  meta?: { title: string; requiresAuth: boolean };
}

const publicRoutes: AppRoute[] = [
  { index: true, element: <HomePage />, meta: { title: '首页', requiresAuth: false } },
  { path: 'products', element: <ProductsPage />, meta: { title: '产品', requiresAuth: false } },
  { path: 'cart', element: <CartPage />, meta: { title: '购物车', requiresAuth: false } },
  { path: 'auth/login', element: <LoginPage />, meta: { title: '登录', requiresAuth: false } },
]

const accountRoutes: AppRoute[] = [
  { index: true, element: <OverviewPage />, meta: { title: '个人中心', requiresAuth: true } },
  { path: 'orders', element: <OrdersPage />, meta: { title: '我的订单', requiresAuth: true } },
  { path: 'after-sale', element: <AfterSalePage />, meta: { title: '售后服务', requiresAuth: true } },
  { path: 'addresses', element: <AddressesPage />, meta: { title: '地址管理', requiresAuth: true } },
]

const renderRoutes = (routes: AppRoute[]) =>
  routes.map(({ path, index, element }) => (
    <Route key={path ?? 'index'} path={path} index={index} element={element} />
  ))

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>{renderRoutes(publicRoutes)}</Route>

      <Route path="account" element={<MainLayout showSidebar />}>
        {renderRoutes(accountRoutes)}
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
