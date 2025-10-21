import { useMemo } from 'react'
import { Checkbox, Form, Input, message, Space } from 'antd'
import type { FormInstance } from 'antd/es/form'

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

const phoneRule = [{ pattern: /^1[3-9]\d{9}$/, message: '请输入规范的中国大陆手机号' }]
const postalRule = [{ pattern: /^\d{6}$/, message: '请输入 6 位数字邮政编码' }]

export function AddressForm({ form, initialValues }: AddressFormProps) {
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
      onFinishFailed={() => message.error('请完善地址信息后再保存')}
    >
      <Form.Item
        label="地址标签"
        name="label"
        rules={[{ required: true, message: '请填写方便识别的地址标签' }]}
      >
        <Input placeholder="家 / 公司 / 朋友等" allowClear maxLength={10} />
      </Form.Item>

      <Space size={12} style={{ width: '100%' }}>
        <Form.Item
          label="收件人"
          name="recipient"
          rules={[{ required: true, message: '请输入收件人姓名' }]}
          style={{ flex: 1 }}
        >
          <Input placeholder="张三" allowClear maxLength={20} />
        </Form.Item>

        <Form.Item
          label="联系电话"
          name="phone"
          rules={[{ required: true, message: '请输入联系电话' }, ...phoneRule]}
          style={{ flex: 1 }}
        >
          <Input placeholder="11 位手机号码" allowClear maxLength={11} />
        </Form.Item>
      </Space>

      <Form.Item
        label="所在地区"
        name="region"
        rules={[{ required: true, message: '请选择完整的省 / 市 / 区信息' }]}
      >
        <RegionCascader />
      </Form.Item>

      <Form.Item
        label="详细地址"
        name="line1"
        rules={[{ required: true, message: '请输入详细地址信息' }]}
      >
        <Input.TextArea
          placeholder="例如：张江路 888 号 XX 大厦 XX 室"
          autoSize={{ minRows: 3, maxRows: 4 }}
          maxLength={120}
          allowClear
        />
      </Form.Item>

      <Form.Item
        label="邮政编码"
        name="postalCode"
        rules={[{ required: true, message: '请输入邮政编码' }, ...postalRule]}
      >
        <Input placeholder="6 位邮编" allowClear maxLength={6} />
      </Form.Item>

      <Form.Item name="isDefault" valuePropName="checked">
        <Checkbox>设为默认地址</Checkbox>
      </Form.Item>
    </Form>
  )
}

export default AddressForm
