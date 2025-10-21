import { Button, Drawer, Form, Space, Typography, message } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import AddressForm from '../../components/address/AddressFormDrawer'
import type { AddressFormValues } from '../../components/address/AddressFormDrawer'
import { AddressList } from './components/AddressList'
import type { Address } from '../../services/types'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  addAddress,
  deleteAddress,
  selectAddress,
  setDefaultAddress,
  updateAddress,
} from '../../store/slices/addressSlice'
import './AddressesPage.css'

export default function AddressesPage() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const addresses = useAppSelector((state) => state.address.addresses)
  const selectedAddressId = useAppSelector((state) => state.address.selectedAddressId)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [form] = Form.useForm<AddressFormValues>()

  const maxReached = addresses.length >= 25

  const handleAdd = () => {
    setEditingAddress(null)
    form.resetFields()
    setDrawerOpen(true)
  }

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    form.setFieldsValue({
      label: address.label,
      recipient: address.recipient,
      phone: address.phone,
      region: {
        province: address.region,
        city: address.city,
        district: address.district,
      },
      line1: address.line1,
      postalCode: address.postalCode,
      isDefault: address.isDefault,
    })
    setDrawerOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const values = (await form.validateFields()) as AddressFormValues
      if (!values.region) {
        message.error('请选择完整的省市区信息')
        return
      }

      const payload: Omit<Address, 'id'> = {
        label: values.label,
        recipient: values.recipient,
        phone: values.phone,
        line1: values.line1,
        city: values.region.city,
        region: values.region.province,
        district: values.region.district,
        postalCode: values.postalCode,
        isDefault: values.isDefault ?? false,
      }

      if (editingAddress) {
        dispatch(updateAddress({ id: editingAddress.id, ...payload }))
        message.success('已更新地址')
      } else {
        if (maxReached) {
          message.warning('地址数量已达上限（25 个）')
          return
        }
        dispatch(addAddress(payload))
        message.success('已新增地址')
      }

      setDrawerOpen(false)
      setEditingAddress(null)
      form.resetFields()
    } catch (error) {
      // validation already handled
    }
  }

  const handleDelete = (id: string) => {
    dispatch(deleteAddress(id))
  }

  const handleSetDefault = (id: string) => {
    dispatch(setDefaultAddress(id))
    message.success('已设为默认地址')
  }

  const handleSelect = (id: string) => {
    dispatch(selectAddress(id))
  }

  return (
    <div className="page-container addresses-page">
      <div className="addresses-page__header">
        <div>
          <Typography.Title level={4}>{t('pages.account.addresses.title')}</Typography.Title>
          <Typography.Text type="secondary">{`已保存 ${addresses.length}/25 个地址`}</Typography.Text>
        </div>
        <Button type="primary" disabled={maxReached} onClick={handleAdd}>
          新增地址
        </Button>
      </div>

      <AddressList
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        onSelect={handleSelect}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSetDefault={handleSetDefault}
      />

      <Drawer
        title={editingAddress ? '编辑地址' : '新增地址'}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false)
          setEditingAddress(null)
          form.resetFields()
        }}
        width={480}
        extra={
          <Space>
            <Button
              onClick={() => {
                setDrawerOpen(false)
                setEditingAddress(null)
                form.resetFields()
              }}
            >
              取消
            </Button>
            <Button type="primary" onClick={handleSubmit}>
              保存
            </Button>
          </Space>
        }
      >
        <AddressForm form={form} initialValues={editingAddress ?? undefined} />
      </Drawer>
    </div>
  )
}
