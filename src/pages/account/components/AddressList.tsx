import { Button, Card, Empty, Popconfirm, Space, Tag, Typography, message } from 'antd'
import { useTranslation } from 'react-i18next'

import type { Address } from '../../../services/types'

const { Text } = Typography

interface AddressListProps {
  addresses: Address[]
  selectedAddressId?: string
  onSelect: (id: string) => void
  onEdit: (address: Address) => void
  onDelete: (id: string) => void
  onSetDefault: (id: string) => void
}

export function AddressList({
  addresses,
  selectedAddressId,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressListProps) {
  const { t } = useTranslation()
  if (!addresses.length) {
    return <Empty description={t('pages.account.addresses.empty')} />
  }

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      {addresses.map((address) => {
        const isSelected = selectedAddressId === address.id
        return (
          <Card
            key={address.id}
            className={`address-card ${isSelected ? 'address-card--active' : ''}`}
            variant="borderless"
            onClick={() => onSelect(address.id)}
          >
            <div className="address-card__header">
              <Space size={12}>
                <Text strong>{address.label}</Text>
                {address.isDefault ? <Tag color="blue">{t('pages.account.addresses.defaultTag')}</Tag> : null}
                {isSelected ? <Tag color="green">{t('pages.account.addresses.selected')}</Tag> : null}
              </Space>
              <Space size={8}>
                {!address.isDefault ? (
                  <Button
                    type="link"
                    size="small"
                    onClick={(event) => {
                      event.stopPropagation()
                      onSetDefault(address.id)
                    }}
                  >
                    {t('pages.account.addresses.setDefault')}
                  </Button>
                ) : null}
                <Button
                  type="link"
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation()
                    onEdit(address)
                  }}
                >
                  {t('common.edit')}
                </Button>
                <Popconfirm
                  title={t('pages.account.addresses.deleteConfirm')}
                  okText={t('pages.account.addresses.deleteConfirmOk')}
                  cancelText={t('pages.account.addresses.deleteConfirmCancel')}
                  onConfirm={(event) => {
                    event?.stopPropagation()
                    onDelete(address.id)
                    message.success(t('messages.addressDeleted'))
                  }}
                  onCancel={(event) => event?.stopPropagation()}
                >
                  <Button
                    type="link"
                    size="small"
                    danger
                    onClick={(event) => event.stopPropagation()}
                  >
                    {t('common.delete')}
                  </Button>
                </Popconfirm>
              </Space>
            </div>
            <div className="address-card__body">
              <Text>{address.recipient}（{address.phone}）</Text>
              <Text type="secondary">
                {address.region} {address.city} {address.district} {address.line1}
              </Text>
              <Text type="secondary">邮编：{address.postalCode}</Text>
            </div>
          </Card>
        )
      })}
    </Space>
  )
}

export default AddressList
