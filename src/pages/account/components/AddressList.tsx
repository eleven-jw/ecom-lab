import { Button, Card, Empty, Popconfirm, Space, Tag, Typography, message } from 'antd'

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
  if (!addresses.length) {
    return <Empty description="暂无地址，点击右上方按钮可新增" />
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
                {address.isDefault ? <Tag color="blue">默认</Tag> : null}
                {isSelected ? <Tag color="green">当前选择</Tag> : null}
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
                    设为默认
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
                  编辑
                </Button>
                <Popconfirm
                  title="确定删除该地址吗？"
                  okText="删除"
                  cancelText="取消"
                  onConfirm={(event) => {
                    event?.stopPropagation()
                    onDelete(address.id)
                    message.success('已删除地址')
                  }}
                  onCancel={(event) => event?.stopPropagation()}
                >
                  <Button
                    type="link"
                    size="small"
                    danger
                    onClick={(event) => event.stopPropagation()}
                  >
                    删除
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
