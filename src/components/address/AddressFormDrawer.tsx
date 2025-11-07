import { useMemo } from 'react'
import { Checkbox, Form, Input, message, Space } from 'antd'
import type { FormInstance } from 'antd/es/form'
import { useTranslation } from 'react-i18next'

import type { Address } from '../../services/types'
import { RegionCascader } from './RegionCascader'

export interface AddressFormValues {
  label: string
  recipient: string
  phone: string
  region?: {
    province: string
    city: string
    district: string
  }
  line1: string
  postalCode: string
  isDefault?: boolean
}

interface AddressFormProps {
  form: FormInstance<AddressFormValues>
  initialValues?: Partial<Address>
}

export function AddressForm({ form, initialValues }: AddressFormProps) {
  const { t } = useTranslation()
  const cascaderValue = useMemo(() => {
    if (!initialValues?.region || !initialValues?.city || !initialValues?.district) {
      return undefined
    }
    return {
      province: initialValues.region,
      city: initialValues.city,
      district: initialValues.district,
    }
  }, [initialValues?.region, initialValues?.city, initialValues?.district])

  const phoneRule = useMemo(
    () => [
      {
        pattern: /^1[3-9]\d{9}$/,
        message: t('components.addressForm.errors.phoneInvalid'),
      },
    ],
    [t],
  )

  const postalRule = useMemo(
    () => [
      {
        pattern: /^\d{6}$/,
        message: t('components.addressForm.errors.postalCodeInvalid'),
      },
    ],
    [t],
  )

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        label: initialValues?.label,
        recipient: initialValues?.recipient,
        phone: initialValues?.phone,
        region: cascaderValue,
        line1: initialValues?.line1,
        postalCode: initialValues?.postalCode,
        isDefault: initialValues?.isDefault,
      }}
      onFinishFailed={() => message.error(t('components.addressForm.submitError'))}
    >
      <Form.Item
        label={t('components.addressForm.label')}
        name="label"
        rules={[{ required: true, message: t('components.addressForm.errors.labelRequired') }]}
      >
        <Input
          placeholder={t('components.addressForm.labelPlaceholder')}
          allowClear
          maxLength={10}
        />
      </Form.Item>

      <Space size={12} style={{ width: '100%' }}>
        <Form.Item
          label={t('components.addressForm.recipient')}
          name="recipient"
          rules={[{ required: true, message: t('components.addressForm.errors.recipientRequired') }]}
          style={{ flex: 1 }}
        >
          <Input
            placeholder={t('components.addressForm.recipientPlaceholder')}
            allowClear
            maxLength={20}
          />
        </Form.Item>

        <Form.Item
          label={t('components.addressForm.phone')}
          name="phone"
          rules={[{ required: true, message: t('components.addressForm.errors.phoneRequired') }, ...phoneRule]}
          style={{ flex: 1 }}
        >
          <Input
            placeholder={t('components.addressForm.phonePlaceholder')}
            allowClear
            maxLength={11}
          />
        </Form.Item>
      </Space>

      <Form.Item
        label={t('components.addressForm.region')}
        name="region"
        rules={[{ required: true, message: t('components.addressForm.errors.regionRequired') }]}
      >
        <RegionCascader />
      </Form.Item>

      <Form.Item
        label={t('components.addressForm.line1')}
        name="line1"
        rules={[{ required: true, message: t('components.addressForm.errors.line1Required') }]}
      >
        <Input.TextArea
          placeholder={t('components.addressForm.line1Placeholder')}
          autoSize={{ minRows: 3, maxRows: 4 }}
          maxLength={120}
          allowClear
        />
      </Form.Item>

      <Form.Item
        label={t('components.addressForm.postalCode')}
        name="postalCode"
        rules={[{ required: true, message: t('components.addressForm.errors.postalCodeRequired') }, ...postalRule]}
      >
        <Input
          placeholder={t('components.addressForm.postalCodePlaceholder')}
          allowClear
          maxLength={6}
        />
      </Form.Item>

      <Form.Item name="isDefault" valuePropName="checked">
        <Checkbox>{t('components.addressForm.isDefault')}</Checkbox>
      </Form.Item>
    </Form>
  )
}

export default AddressForm
