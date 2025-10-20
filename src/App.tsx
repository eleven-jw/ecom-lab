import type { ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { MainLayout } from './layouts/MainLayout'
import CartPage from './pages/CartPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import RegisterPage from './pages/RegisterPage'
import AddressesPage from './pages/account/AddressesPage'
import AfterSalePage from './pages/account/AfterSalePage'
import OrdersPage from './pages/account/OrdersPage'
import OverviewPage from './pages/account/OverviewPage'
import { RequireAuth } from './routes/RequireAuth'

type AppRoute = {
  path?: string
  index?: boolean
  element: ReactElement
  requiresAuth?: boolean
  minTier?: 'basic' | 'vip' | 'super_vip'
}

const publicRoutes: AppRoute[] = [
  { index: true, element: <HomePage /> },
  { path: 'products/:productId', element: <ProductDetailPage /> },
  { path: 'products', element: <ProductsPage /> },
  { path: 'cart', element: <CartPage /> },
  { path: 'auth/login', element: <LoginPage /> },
  { path: 'auth/register', element: <RegisterPage /> },
]

const accountRoutes: AppRoute[] = [
  { index: true, element: <OverviewPage />, requiresAuth: true },
  { path: 'orders', element: <OrdersPage />, requiresAuth: true },
  { path: 'after-sale', element: <AfterSalePage />, requiresAuth: true, minTier: 'vip' },
  { path: 'addresses', element: <AddressesPage />, requiresAuth: true },
]

const renderRoutes = (routes: AppRoute[]) =>
  routes.map(({ path, index, element, requiresAuth, minTier }) => {
    const guardedElement = requiresAuth ? (
      <RequireAuth minTier={minTier}>{element}</RequireAuth>
    ) : (
      element
    )
    return <Route key={path ?? 'index'} path={path} index={index} element={guardedElement} />
  })

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
