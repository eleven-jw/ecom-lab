import { useEffect, useMemo, useState } from 'react'
import { Card, Progress, Typography, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'

import type { HomeFlashSale } from '../../services/types'

interface FlashSaleSectionProps {
  flashSale: HomeFlashSale
}

type RemainingTime = {
  hours: string
  minutes: string
  seconds: string
  finished: boolean
}

const calculateRemaining = (target: string): RemainingTime => {
  const endTime = new Date(target).getTime()
  const diff = Math.max(endTime - Date.now(), 0)

  if (!Number.isFinite(endTime) || diff <= 0) {
    return { hours: '00', minutes: '00', seconds: '00', finished: true }
  }

  const totalSeconds = Math.floor(diff / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
    finished: false,
  }
}

export function FlashSaleSection({ flashSale }: FlashSaleSectionProps) {
  if (!flashSale.items.length) return null

  const [remaining, setRemaining] = useState<RemainingTime>(calculateRemaining(flashSale.endsAt))
  const navigate = useNavigate()

  useEffect(() => {
    setRemaining(calculateRemaining(flashSale.endsAt))
    const timer = window.setInterval(() => {
      setRemaining(calculateRemaining(flashSale.endsAt))
    }, 1000)

    return () => {
      window.clearInterval(timer)
    }
  }, [flashSale.endsAt])

  const headline = useMemo(() => {
    if (remaining.finished) return '秒杀已结束'
    return `距结束还剩 ${remaining.hours}:${remaining.minutes}:${remaining.seconds}`
  }, [remaining])

  return (
    <Card
      title={<span className="flash-sale__title">ecom-lab秒杀</span>}
      extra={<Typography.Text type="danger">{headline}</Typography.Text>}
      bordered={false}
      className="flash-sale"
    >
      <div className="flash-sale__grid">
        {flashSale.items.map((item) => {
          const discount = Math.max(item.originalPrice - item.salePrice, 0)
          const discountLabel = discount > 0 ? `立省 ¥${discount}` : undefined

          return (
            <Card
              key={item.id}
              bordered
              hoverable
              className="flash-sale__item"
              onClick={() => navigate(`/products/${item.productId}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(keyboardEvent) => {
                if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
                  if (keyboardEvent.key === ' ') {
                    keyboardEvent.preventDefault()
                  }
                  navigate(`/products/${item.productId}`)
                }
              }}
            >
              <div className="flash-sale__image-wrapper">
                <img src={item.imageUrl} alt={item.name} loading="lazy" />
              </div>
              <Typography.Paragraph className="flash-sale__name" ellipsis={{ rows: 2 }}>
                {item.name}
              </Typography.Paragraph>
              <div className="flash-sale__prices">
                <span className="flash-sale__sale-price">¥{item.salePrice}</span>
                <span className="flash-sale__origin-price">¥{item.originalPrice}</span>
              </div>
              <Progress percent={item.soldPercent} size="small" strokeColor="#ff4d4f" />
              <div className="flash-sale__tags">
                {item.tag ? <Tag color="red">{item.tag}</Tag> : null}
                {discountLabel ? <Tag color="gold">{discountLabel}</Tag> : null}
              </div>
            </Card>
          )
        })}
      </div>
    </Card>
  )
}

export default FlashSaleSection
