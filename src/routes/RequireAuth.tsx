import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAppSelector } from '../store/hooks'

type RequireAuthProps = PropsWithChildren<{
  minTier?: 'basic' | 'vip' | 'super_vip'
}>

const tierRank: Record<'basic' | 'vip' | 'super_vip', number> = {
  basic: 1,
  vip: 2,
  super_vip: 3,
}

export function RequireAuth({ children, minTier = 'basic' }: RequireAuthProps) {
  const location = useLocation()
  const auth = useAppSelector((state) => state.auth)

  if (auth.status !== 'authenticated' || !auth.user) {
    return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />
  }

  if (tierRank[auth.user.tier] < tierRank[minTier]) {
    return <Navigate to="/account" replace state={{ upgradeRequired: minTier }} />
  }

  return children
}

export default RequireAuth
