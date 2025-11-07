import { PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Empty,
  Form,
  Input,
  List,
  Modal,
  Select,
  Space,
  Tag,
  Typography,
  Upload,
  message,
} from 'antd'
import type { UploadFile, UploadProps } from 'antd'
import type { RcFile } from 'antd/es/upload'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import type { AfterSaleStatus } from '../../services/types'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { submitRequest, updateRequestStatus } from '../../store/slices/afterSaleSlice'

const MAX_ATTACHMENTS = 4

const statusColors: Record<AfterSaleStatus, string> = {
  pending: 'blue',
  in_review: 'gold',
  approved: 'green',
  rejected: 'red',
  completed: 'geekblue',
}

const fileToBase64 = (file: RcFile) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

export default function AfterSalePage() {
  const { t } = useTranslation()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const orders = useAppSelector((state) => state.orders.orders)
  const requests = useAppSelector((state) => state.afterSale.requests)
  const [form] = Form.useForm()
  const [attachments, setAttachments] = useState<UploadFile[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState<string>()
  const [previewTitle, setPreviewTitle] = useState<string>()

  const initialOrderId = (location.state as { orderId?: string } | undefined)?.orderId

  useEffect(() => {
    if (initialOrderId) {
      form.setFieldsValue({ orderId: initialOrderId })
    }
  }, [form, initialOrderId])

  const orderOptions = useMemo(
    () =>
      orders.map((order) => ({
        value: order.id,
        label: t('pages.account.orders.labels.orderNumber', { id: order.id }),
      })),
    [orders, t],
  )

  const afterSaleTypeOptions = useMemo(
    () => [
      { value: 'refund', label: t('pages.account.afterSale.types.refund') },
      { value: 'exchange', label: t('pages.account.afterSale.types.exchange') },
      { value: 'support', label: t('pages.account.afterSale.types.support') },
    ],
    [t],
  )

  const statusOptions = useMemo(
    () =>
      (['pending', 'in_review', 'approved', 'rejected', 'completed'] as AfterSaleStatus[]).map(
        (status) => ({
          value: status,
          label: t(`statuses.afterSale.${status}`),
        }),
      ),
    [t],
  )

  const handleBeforeUpload: UploadProps['beforeUpload'] = async (file) => {
    if (attachments.length >= MAX_ATTACHMENTS) {
      message.warning(t('components.upload.limitReached', { max: MAX_ATTACHMENTS }))
      return Upload.LIST_IGNORE
    }
    try {
      const base64 = await fileToBase64(file as RcFile)
      setAttachments((previous) => [
        ...previous.filter((item) => item.uid !== file.uid),
        {
          uid: file.uid,
          name: file.name,
          status: 'done',
          url: base64,
        },
      ])
    } catch (error) {
      message.error(t('components.upload.error'))
    }
    return false
  }

  const handleRemove: UploadProps['onRemove'] = (file) => {
    setAttachments((previous) => previous.filter((item) => item.uid !== file.uid))
    return true
  }

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await fileToBase64(file.originFileObj as RcFile)
    }
    setPreviewImage((file.url ?? (file.preview as string)) ?? undefined)
    setPreviewTitle(file.name || '')
    setPreviewOpen(true)
  }

  const handleSubmit = async (values: { orderId: string; type: string; reason: string; description?: string; contact?: string }) => {
    const attachmentUrls = attachments.length
      ? (
          await Promise.all(
            attachments.map(async (file) => {
              if (file.url) return file.url
              if (file.thumbUrl) return file.thumbUrl
              if (file.originFileObj) {
                return await fileToBase64(file.originFileObj as RcFile)
              }
              return undefined
            }),
          )
        ).filter((url): url is string => Boolean(url))
      : undefined

    dispatch(
      submitRequest({
        orderId: values.orderId,
        type: values.type as 'refund' | 'exchange' | 'support',
        reason: values.reason,
        description: values.description,
        contact: values.contact,
        attachments: attachmentUrls,
      }),
    )
    message.success(t('messages.afterSaleSubmitted'))
    form.resetFields()
    setAttachments([])
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>{t('components.upload.add')}</div>
    </div>
  )

  return (
    <div className="page-container">
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        <div>
          <Typography.Title level={4}>{t('pages.account.afterSale.title')}</Typography.Title>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
            {t('pages.account.afterSale.description')}
          </Typography.Paragraph>
        </div>

        <Card title={t('pages.account.afterSale.newRequest')} variant="outlined">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ type: afterSaleTypeOptions[0]?.value }}
          >
            <Form.Item
              label={t('pages.account.afterSale.form.order')}
              name="orderId"
              rules={[{ required: true, message: t('pages.account.afterSale.errors.orderRequired') }]}
            >
              <Select
                options={orderOptions}
                placeholder={orderOptions.length ? undefined : t('messages.afterSaleNoOrders')}
                disabled={!orderOptions.length}
              />
            </Form.Item>

            <Form.Item
              label={t('pages.account.afterSale.form.type')}
              name="type"
              rules={[{ required: true }]}
            >
              <Select options={afterSaleTypeOptions} />
            </Form.Item>

            <Form.Item
              label={t('pages.account.afterSale.form.reason')}
              name="reason"
              rules={[{ required: true, message: t('pages.account.afterSale.errors.reasonRequired') }]}
            >
              <Input placeholder={t('pages.account.afterSale.form.reason')} maxLength={80} />
            </Form.Item>

            <Form.Item
              label={t('pages.account.afterSale.form.description')}
              name="description"
            >
              <Input.TextArea
                placeholder={t('pages.account.afterSale.form.description')}
                autoSize={{ minRows: 3, maxRows: 6 }}
                maxLength={400}
                showCount
              />
            </Form.Item>

            <Form.Item label={t('pages.account.afterSale.form.contact')} name="contact">
              <Input
                placeholder={t('pages.account.afterSale.form.contactPlaceholder')}
                maxLength={60}
              />
            </Form.Item>

            <Form.Item label={t('pages.account.afterSale.form.attachments')}>
              <Upload
                listType="picture-card"
                fileList={attachments}
                onPreview={handlePreview}
                onRemove={handleRemove}
                beforeUpload={handleBeforeUpload}
              >
                {attachments.length >= MAX_ATTACHMENTS ? null : uploadButton}
              </Upload>
              <Typography.Text type="secondary">
                {t('pages.account.afterSale.form.attachmentsHint', { max: MAX_ATTACHMENTS })}
              </Typography.Text>
            </Form.Item>

            <Button type="primary" htmlType="submit" disabled={!orderOptions.length}>
              {t('pages.account.afterSale.form.submit')}
            </Button>
          </Form>
        </Card>

        <Card title={t('pages.account.afterSale.table.title')} variant="outlined">
          {requests.length ? (
            <List
              itemLayout="vertical"
              dataSource={requests}
              renderItem={(request) => {
                const statusLabel = t(`statuses.afterSale.${request.status}`)
                const typeLabel = t(`pages.account.afterSale.types.${request.type}`)
                const orderLabel = t('pages.account.orders.labels.orderNumber', { id: request.orderId })
                return (
                  <List.Item key={request.id}>
                    <Space direction="vertical" size={12} style={{ width: '100%' }}>
                      <Space size={12} align="center">
                        <Tag color={statusColors[request.status]}>{statusLabel}</Tag>
                        <Typography.Text strong>{typeLabel}</Typography.Text>
                        <Typography.Text type="secondary">{orderLabel}</Typography.Text>
                      </Space>
                      <Typography.Text>{request.reason}</Typography.Text>
                      {request.description ? (
                        <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
                          {request.description}
                        </Typography.Paragraph>
                      ) : null}
                      {request.attachments && request.attachments.length ? (
                        <Space size={12} wrap>
                          {request.attachments.map((url) => (
                            <img
                              key={url}
                              src={url}
                              alt={request.reason}
                              loading="lazy"
                              style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8 }}
                              onClick={() => {
                                setPreviewImage(url)
                                setPreviewTitle(request.reason)
                                setPreviewOpen(true)
                              }}
                            />
                          ))}
                        </Space>
                      ) : null}
                      <Space size={12} wrap align="center">
                        <Typography.Text type="secondary">
                          {t('pages.account.afterSale.table.statusUpdated', {
                            time: new Date(request.updatedAt).toLocaleString(),
                          })}
                        </Typography.Text>
                        <Select
                          size="small"
                          value={request.status}
                          options={statusOptions}
                          onChange={(status) =>
                            dispatch(updateRequestStatus({ id: request.id, status }))
                          }
                          style={{ minWidth: 160 }}
                        />
                      </Space>
                    </Space>
                  </List.Item>
                )
              }}
            />
          ) : (
            <Empty description={t('pages.account.afterSale.table.empty')} style={{ padding: '48px 0' }} />
          )}
        </Card>
      </Space>

      <Modal
        open={previewOpen}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        title={previewTitle}
      >
        {previewImage ? (
          <img src={previewImage} alt={previewTitle} style={{ width: '100%' }} />
        ) : null}
      </Modal>
    </div>
  )
}
