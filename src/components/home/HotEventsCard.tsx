import { Card, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

import type { BrandSpotlight } from '../../services/types'

interface HotEventsCardProps {
  events: BrandSpotlight[]
}

export function HotEventsCard({ events }: HotEventsCardProps) {
  const navigate = useNavigate()

  if (!events.length) return null

  return (
    <Card className="hot-events-card" variant="borderless">
      <Typography.Title level={5} style={{ marginBottom: 12 }}>
        热门活动
      </Typography.Title>
      <div className="hot-events-card__list">
        {events.map((event) => (
          <div
            key={event.id}
            className="hot-events-card__item"
            role="button"
            tabIndex={0}
            onClick={() => navigate(event.href)}
            onKeyDown={(keyboardEvent) => {
              if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
                navigate(event.href)
              }
            }}
          >
            <img src={event.imageUrl} alt={event.name} loading="lazy" />
            <div>
              <Typography.Text strong>{event.name}</Typography.Text>
              {event.tagline ? (
                <Typography.Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                  {event.tagline}
                </Typography.Paragraph>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default HotEventsCard
