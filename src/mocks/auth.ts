import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UserProfile,
  UserTier,
} from '../services/types'

type StoredUser = UserProfile & { password: string }

const toBase64Url = (input: string) =>
  (typeof btoa === 'function'
    ? btoa(input)
    : (globalThis.Buffer as typeof Buffer).from(input, 'utf8').toString('base64'))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

export const fromBase64Url = (input: string) => {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
  if (typeof atob === 'function') {
    return atob(padded)
  }
  return (globalThis.Buffer as typeof Buffer).from(padded, 'base64').toString('utf8')
}

const defaultUsers: StoredUser[] = [
  {
    id: 'user-basic-1',
    email: 'jane.basic@example.com',
    fullName: 'Jane Basic',
    tier: 'basic',
    createdAt: '2025-01-01T08:00:00.000Z',
    phone: '13811112222',
    location: '上海 · 浦东新区',
    avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
    bio: '热爱摄影与滑雪的普通会员。',
    points: 1200,
    password: 'Password123!'
  },
  {
    id: 'user-vip-1',
    email: 'owen.vip@example.com',
    fullName: 'Owen VIP',
    tier: 'vip',
    createdAt: '2025-01-05T10:15:00.000Z',
    phone: '13933334444',
    location: '北京 · 朝阳区',
    avatarUrl: 'https://avatars.githubusercontent.com/u/2?v=4',
    bio: '跨境电商买手，热衷智能家居。',
    points: 5600,
    password: 'Password123!'
  },
  {
    id: 'user-super-1',
    email: 'sara.super@example.com',
    fullName: 'Sara Super',
    tier: 'super_vip',
    createdAt: '2025-01-08T12:30:00.000Z',
    phone: '13755556666',
    location: '深圳 · 南山区',
    avatarUrl: 'https://avatars.githubusercontent.com/u/3?v=4',
    bio: '超级 VIP，热衷收藏限量版潮玩。',
    points: 12800,
    password: 'Password123!'
  }
]

let users: StoredUser[] = [...defaultUsers]

const tierInviteCodes: Record<string, UserTier> = {
  VIP2025: 'vip',
  SUPER2025: 'super_vip',
}

const accessExpirySeconds = 60 * 15 // 15 minutes

export function resetUsers() {
  users = [...defaultUsers]
}

function createTokens(user: UserProfile) {
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    sub: user.id,
    email: user.email,
    tier: user.tier,
    exp: now + accessExpirySeconds,
  }
  const base64Payload = toBase64Url(JSON.stringify(payload))
  const accessToken = `mock.${base64Payload}.signature`
  const refreshTokenPayload = toBase64Url(
    JSON.stringify({ sub: user.id, createdAt: now }),
  )
  const refreshToken = `mock.${refreshTokenPayload}.signature`

  return {
    accessToken,
    refreshToken,
    expiresIn: accessExpirySeconds,
  }
}

export function login({ email, password }: LoginRequest): AuthResponse | null {
  const user = users.find((candidate) => candidate.email === email)
  if (!user || user.password !== password) {
    return null
  }

  const { password: _password, ...publicProfile } = user
  return {
    user: publicProfile,
    tokens: createTokens(publicProfile),
  }
}

export function register({ email, password, fullName, inviteCode }: RegisterRequest) {
  const existing = users.find((candidate) => candidate.email === email)
  if (existing) {
    throw new Error('EMAIL_EXISTS')
  }

  let tier: UserTier = 'basic'
  if (inviteCode && tierInviteCodes[inviteCode]) {
    tier = tierInviteCodes[inviteCode]
  }

  const profile: StoredUser = {
    id:
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `user-${Date.now()}`,
    email,
    fullName,
    tier,
    createdAt: new Date().toISOString(),
    password,
  }

  users.push(profile)

  const { password: _password, ...publicProfile } = profile

  return {
    user: publicProfile,
    tokens: createTokens(publicProfile),
  }
}

export function refresh(refreshToken: string): AuthResponse | null {
  if (!refreshToken.startsWith('mock.')) {
    return null
  }

  try {
    const [, base64Payload] = refreshToken.split('.')
    const payload = JSON.parse(fromBase64Url(base64Payload)) as {
      sub: string
    }
    const user = users.find((candidate) => candidate.id === payload.sub)
    if (!user) {
      return null
    }
    const { password: _password, ...publicProfile } = user
    return {
      user: publicProfile,
      tokens: createTokens(publicProfile),
    }
  } catch (error) {
    return null
  }
}

export function getUserById(userId: string): UserProfile | null {
  const user = users.find((candidate) => candidate.id === userId)
  if (!user) return null
  const { password: _password, ...publicProfile } = user
  return publicProfile
}

export function decodeAccessToken(token: string): { sub: string } | null {
  if (!token.startsWith('mock.')) return null
  const [, base64Payload] = token.split('.')
  try {
    return JSON.parse(fromBase64Url(base64Payload)) as { sub: string }
  } catch (error) {
    return null
  }
}
