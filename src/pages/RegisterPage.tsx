import { Alert, Button, Form, Input, Select, Typography } from 'antd'
import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { AuthShell } from '../components/auth/AuthShell'
import { useRegisterMutation } from '../services/api'
import { useAppSelector } from '../store/hooks'

interface RegisterFormValues {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  tier: 'basic' | 'vip' | 'super_vip'
  inviteCode?: string
}

const schema = yup
  .object({
    fullName: yup.string().min(2, 'Enter your full name').required('Full name is required'),
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[A-Z]/, 'Must include an uppercase letter')
      .matches(/[a-z]/, 'Must include a lowercase letter')
      .matches(/\d/, 'Must include a digit')
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Please confirm password'),
    tier: yup.mixed<'basic' | 'vip' | 'super_vip'>().oneOf(['basic', 'vip', 'super_vip']).required(),
    inviteCode: yup.string().when('tier', {
      is: (value: RegisterFormValues['tier']) => value !== 'basic',
      then: (schema) => schema.required('Invite code is required for VIP tiers'),
      otherwise: (schema) => schema.optional(),
    }),
  })
  .required()

export default function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const authStatus = useAppSelector((state) => state.auth.status)
  const [registerUser, { isLoading, error }] = useRegisterMutation()
  const redirectPath = (location.state as { from?: string } | null)?.from ?? '/account'

  const tierOptions = useMemo(
    () => [
      { label: t('pages.auth.tiers.basic'), value: 'basic' },
      { label: t('pages.auth.tiers.vip'), value: 'vip' },
      { label: t('pages.auth.tiers.superVip'), value: 'super_vip' },
    ],
    [t],
  )

  const {
    handleSubmit,
    register,
    watch,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      tier: 'basic',
      inviteCode: '',
    },
    resolver: yupResolver(schema),
  })

  const selectedTier = watch('tier')

  useEffect(() => {
    if (authStatus === 'authenticated') {
      navigate(redirectPath, { replace: true })
    }
  }, [authStatus, navigate, redirectPath])

  const onSubmit = async (values: RegisterFormValues) => {
    const payload = {
      email: values.email,
      password: values.password,
      fullName: values.fullName,
      inviteCode: values.tier === 'basic' ? undefined : values.inviteCode,
    }
    try {
      await registerUser(payload).unwrap()
      navigate(redirectPath, { replace: true })
    } catch (err) {
      // handled below
    }
  }

  const apiErrorMessage = (() => {
    if (!error || !('data' in error)) return null
    const data = error.data as { message?: string }
    return data?.message ?? 'Unable to create account with provided details.'
  })()

  return (
    <AuthShell
      title={t('pages.auth.signUpTitle')}
      description={t('pages.auth.signUpDescription')}
      footer={
        <Typography.Paragraph style={{ textAlign: 'center', marginBottom: 0 }}>
          {t('pages.auth.haveAccount')}{' '}
          <Link to="/auth/login">{t('pages.auth.signInInstead')}</Link>
        </Typography.Paragraph>
      }
    >
      {apiErrorMessage ? (
        <Alert type="error" message={apiErrorMessage} style={{ marginBottom: 16 }} />
      ) : null}
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)} autoComplete="off">
        <Form.Item
          label={t('pages.auth.fullNameLabel')}
          validateStatus={errors.fullName ? 'error' : undefined}
          help={errors.fullName?.message}
        >
          <Input placeholder="Jane Doe" {...register('fullName')} size="large" />
        </Form.Item>
        <Form.Item
          label={t('pages.auth.emailLabel')}
          validateStatus={errors.email ? 'error' : undefined}
          help={errors.email?.message}
        >
          <Input placeholder="you@example.com" {...register('email')} size="large" />
        </Form.Item>
        <Form.Item
          label={t('pages.auth.passwordLabel')}
          validateStatus={errors.password ? 'error' : undefined}
          help={errors.password?.message}
        >
          <Input.Password
            placeholder={t('pages.auth.passwordPlaceholder')}
            {...register('password')}
            size="large"
          />
        </Form.Item>
        <Form.Item
          label={t('pages.auth.confirmPasswordLabel')}
          validateStatus={errors.confirmPassword ? 'error' : undefined}
          help={errors.confirmPassword?.message}
        >
          <Input.Password
            placeholder={t('pages.auth.confirmPasswordPlaceholder')}
            {...register('confirmPassword')}
            size="large"
          />
        </Form.Item>
        <Form.Item label={t('pages.auth.tierLabel')}>
          <Controller
            control={control}
            name="tier"
            render={({ field }) => (
              <Select
                {...field}
                options={tierOptions}
                size="large"
                value={field.value}
              />
            )}
          />
        </Form.Item>
        {selectedTier !== 'basic' ? (
          <Form.Item
            label={t('pages.auth.inviteCodeLabel')}
            validateStatus={errors.inviteCode ? 'error' : undefined}
            help={errors.inviteCode?.message}
          >
            <Input placeholder="VIP2025" {...register('inviteCode')} size="large" />
          </Form.Item>
        ) : null}
        <Button type="primary" htmlType="submit" block size="large" loading={isLoading}>
          {t('pages.auth.signUpCta')}
        </Button>
      </Form>
      <Typography.Paragraph type="secondary" style={{ marginTop: 16 }}>
        {t('pages.auth.inviteCodeHelp')}
      </Typography.Paragraph>
      <ul style={{ paddingLeft: 16, marginBottom: 0 }}>
        <li>VIP: VIP2025</li>
        <li>Super VIP: SUPER2025</li>
      </ul>
    </AuthShell>
  )
}
