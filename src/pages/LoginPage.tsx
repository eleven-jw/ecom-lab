import { Alert, Button, Form, Input, Typography } from 'antd'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { AuthShell } from '../components/auth/AuthShell'
import { useLoginMutation } from '../services/api'
import { useAppSelector } from '../store/hooks'

interface LoginFormValues {
  email: string
  password: string
}

const schema = yup.object({
  email: yup.string().trim().email('Enter a valid email').required('Email is required'),
  password: yup.string().trim().min(8, 'Password must be at least 8 characters').required('Password is required'),
})

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const authStatus = useAppSelector((state) => state.auth.status)
  const [login, { isLoading, error }] = useLoginMutation()
  const redirectPath = (location.state as { from?: string } | null)?.from ?? '/account'

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    if (authStatus === 'authenticated') {
      navigate(redirectPath, { replace: true })
    }
  }, [authStatus, navigate, redirectPath])

  const onSubmit = async (values: LoginFormValues) => {
    console.log('values', values)
    try {
      await login(values).unwrap()
      navigate(redirectPath, { replace: true })
    } catch (err) {
      // errors handled below
    }
  }

  const apiErrorMessage = (() => {
    if (!error || !('data' in error)) return null
    const data = error.data as { message?: string }
    return data?.message ?? 'Unable to sign in with provided credentials.'
  })()

  return (
    <AuthShell
      title={t('pages.auth.signInTitle')}
      description={t('pages.auth.signInDescription')}
      footer={
        <Typography.Paragraph style={{ textAlign: 'center', marginBottom: 0 }}>
          {t('pages.auth.noAccount')}{' '}
          <Link to="/auth/register">{t('pages.auth.createAccount')}</Link>
        </Typography.Paragraph>
      }
    >
      {apiErrorMessage ? (
        <Alert type="error" message={apiErrorMessage} style={{ marginBottom: 16 }} />
      ) : null}
      <Form
        layout="vertical"
        onFinish={() => {
          void handleSubmit(onSubmit)()
        }}
        autoComplete="off"
      >
        <Form.Item
          label={t('pages.auth.emailLabel')}
          validateStatus={errors.email ? 'error' : undefined}
          help={errors.email?.message}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => <Input {...field} placeholder="you@example.com" size="large" />}
          />
        </Form.Item>
        <Form.Item
          label={t('pages.auth.passwordLabel')}
          validateStatus={errors.password ? 'error' : undefined}
          help={errors.password?.message}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                placeholder={t('pages.auth.passwordPlaceholder')}
                size="large"
              />
            )}
          />
        </Form.Item>
        <Button type="primary" htmlType="submit" block size="large" loading={isLoading}>
          {t('pages.auth.signInCta')}
        </Button>
      </Form>
      <Typography.Paragraph type="secondary" style={{ marginTop: 16 }}>
        {t('pages.auth.demoAccounts')}
      </Typography.Paragraph>
      <ul style={{ paddingLeft: 16, marginBottom: 0 }}>
        <li>jane.basic@example.com / Password123! ({t('pages.auth.tiers.basic')})</li>
        <li>owen.vip@example.com / Password123! ({t('pages.auth.tiers.vip')})</li>
        <li>sara.super@example.com / Password123! ({t('pages.auth.tiers.superVip')})</li>
      </ul>
    </AuthShell>
  )
}
